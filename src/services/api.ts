import { API_BASE, API_KEY } from "../types/types";
import type { Organization, CustomerRegisterParams } from "../types/types";
import { jwtDecode } from "jwt-decode";

class JoaliApi {
  /**
   * Pay for a booking
   * @param bookingId The booking/order id to pay for
   */
  async payForBooking(bookingId: number | string) {
    const res = await this.fetchWithAuth(`${this.baseUrl}/api/service/pay`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: String(bookingId),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Payment failed");
    }
    return data;
  }

  // --- Services ---
  /**
   * Fetch all services or filtered services (e.g., rooms for a hotel) by passing filter params.
   * @param filters Optional filters: { orgId, typeId, ... }
   */
  async getAllServices(filters?: {
    orgId?: number | string;
    typeId?: number | string;
    [key: string]: any;
  }) {
    let url = `${this.baseUrl}/api/Service/all`;
    if (filters && Object.keys(filters).length > 0) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
      url += `?${params.toString()}`;
    }
    const res = await this.fetchWithAuth(url, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    let data = [];
    const text = await res.text();
    try {
      data = text ? JSON.parse(text) : [];
    } catch (e) {
      data = [];
    }
    if (!Array.isArray(data)) data = [];
    return data;
  }

  async createService(service: {
    name: string;
    description: string;
    price: number;
    orgId: number;
    serviceTypeId: number;
    imageUrl: string;
    capacity?: number;
    durationInMinutes?: number;
  }) {
    const res = await this.fetchWithAuth(`${this.baseUrl}/api/Service/create`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(service),
    });
    let data = null;
    const text = await res.text();
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      data = null;
    }
    if (!res.ok)
      throw new Error((data && data.message) || "Failed to create service");
    return data;
  }

  // --- Service Types ---
  async getAllServiceTypes() {
    const res = await this.fetchWithAuth(
      `${this.baseUrl}/api/Service/all-service-types`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );
    let data = [];
    const text = await res.text();
    try {
      data = text ? JSON.parse(text) : [];
    } catch (e) {
      data = [];
    }
    if (!Array.isArray(data)) data = [];
    return data;
  }

  async createServiceType(serviceType: { name: string; description: string }) {
    const res = await this.fetchWithAuth(
      `${this.baseUrl}/api/Service/create-service-type`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(serviceType),
      }
    );
    let data = null;
    const text = await res.text();
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      data = null;
    }
    if (!res.ok)
      throw new Error(
        (data && data.message) || "Failed to create service type"
      );
    return data;
  }

  async refreshTokenIfNeeded(): Promise<boolean> {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    if (!accessToken || !refreshToken) return false;
    const res = await fetch(`${this.baseUrl}/api/Auth/RefreshToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken, refreshToken }),
    });
    const data = await res.json();
    if (
      res.ok &&
      data.token &&
      data.token.accessToken &&
      data.token.refreshToken
    ) {
      this.setLocalStorage(data.token.accessToken, data.token.refreshToken);
      return true;
    }
    this.clearTokens();
    return false;
  }

  // Wrapper for fetch with auto token refresh
  async fetchWithAuth(input: RequestInfo, init?: RequestInit, retry = true) {
    let res = await fetch(input, init);
    if (res.status === 401 && retry) {
      const refreshed = await this.refreshTokenIfNeeded();
      if (refreshed) {
        // Update Authorization header
        if (init && init.headers) {
          (init.headers as Record<string, string>)[
            "Authorization"
          ] = `Bearer ${this.getAccessToken()}`;
        }
        res = await fetch(input, init);
      }
    }
    return res;
  }
  baseUrl: string;
  apiKey: string;
  tokenKey: string;
  refreshKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.tokenKey = "accessToken";
    this.refreshKey = "refreshToken";
  }

  getAuthHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.getAccessToken()}`,
    };
  }

  setLocalStorage(accessToken: string, refreshToken: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.tokenKey, accessToken);
      localStorage.setItem(this.refreshKey, refreshToken);
    }
  }

  clearTokens(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.refreshKey);
    }
  }

  getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.refreshKey);
    }
    return null;
  }

  async login({ email, password }: { email: string; password: string }) {
    const res = await fetch(`${this.baseUrl}/api/Auth/Login`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email, password, apiKey: this.apiKey }),
    });
    const data = await res.json();
    console.log(data);
    if (!res.ok) {
      console.error("Login error:", data);
      throw new Error(data.message || JSON.stringify(data) || "Login failed");
    }
    // Cache accessToken in localStorage
    if (data.token && data.token.accessToken) {
      this.setLocalStorage(data.token.accessToken, data.token.refreshToken);
    }

    return data;
  }

  async customerRegister(params: CustomerRegisterParams) {
    const res = await fetch(
      `${this.baseUrl}/api/User/CustomerRegister?apiKey=${this.apiKey}`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(params),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      console.error("Registration error:", data);
      throw new Error(
        data.message || JSON.stringify(data) || "Registration failed"
      );
    }
    return data;
  }

  async getAllUsers() {
    const res = await this.fetchWithAuth(
      `${this.baseUrl}/api/User/AllUsers?apiKey=${this.apiKey}`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      console.error("Get users error:", data);
      throw new Error(
        data.message || JSON.stringify(data) || "Failed to fetch users"
      );
    }
    return data;
  }

  async logout() {
    const accessToken = this.getAccessToken();
    if (!accessToken) throw new Error("No access token found");
    const res = await this.fetchWithAuth(`${this.baseUrl}/api/Auth/Logout`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("Logout error:", data);
      throw new Error(data.message || JSON.stringify(data) || "Logout failed");
    }
    this.clearTokens();
    return data;
  }

  async toggleUser(email: string) {
    const res = await this.fetchWithAuth(
      `${this.baseUrl}/api/User/ToggleUser?apiKey=${this.apiKey}&Email=${email}`,
      {
        method: "PUT",
        headers: this.getAuthHeaders(),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to toggle user");
    }
    return data;
  }

  async toggleOrganization(id: number) {
    console.log(id);
    const res = await this.fetchWithAuth(
      `${this.baseUrl}/api/Organization/toggle/${id}`,
      {
        method: "PUT",
        headers: this.getAuthHeaders(),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to toggle organization");
    }
    return data;
  }

  async getOrganizationById(id: number): Promise<Organization | null> {
    const res = await this.fetchWithAuth(
      `${this.baseUrl}/api/Organization/${id}`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );
    let data: Organization | null = null;
    const text = await res.text();
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      data = null;
    }
    if (!res.ok)
      throw new Error(
        (data && (data as any).message) || "Failed to fetch organization"
      );
    return data;
  }

  async getAllOrganizations(orgType?: number): Promise<Organization[]> {
    const res = await this.fetchWithAuth(
      `${this.baseUrl}/api/Organization?orgtype=${orgType || ""}`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );
    let data: Organization[] = [];
    const text = await res.text();
    try {
      data = text ? JSON.parse(text) : [];
    } catch (e) {
      data = [];
    }
    if (!Array.isArray(data)) data = [];
    return data;
  }

  async createOrganization(
    org: {
      name: string,
      registrationNumber: string,
      email: string,
      phone: string,
      address: string,
      country: string,
      logoUrl: string,
      website: string,
      orgType: number
    }
  ) {
    const res = await this.fetchWithAuth(
      `${this.baseUrl}/api/Organization/Create`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(org),
      }
    );
    let data = null;
    const text = await res.text();
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      data = null;
    }
    if (!res.ok)
      throw new Error(
        (data && data.message) || "Failed to create organization"
      );
    return data;
  }

  async resetInitialPassword(
    email: string,
    temporaryKey: string,
    newPassword: string
  ) {
    const res = await this.fetchWithAuth(
      `${this.baseUrl}/api/Auth/ResetPassword`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ email, temporaryKey, newPassword }),
      }
    );
    let data = null;
    const text = await res.text();
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      data = null;
    }
    if (!res.ok)
      throw new Error(
        (data && data.message) || "Failed to reset initial password"
      );
    return data;
  }

  async createStaff(staff: {
    name: string;
    email: string;
    phoneNumber: string;
    orgId: number;
  }) {
    const res = await this.fetchWithAuth(
      `${this.baseUrl}/api/User/NewStaff?apiKey=${this.apiKey}`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(staff),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to create staff");
    }
    return data;
  }

  async toggleService(id: number) {
    const res = await this.fetchWithAuth(
      `${this.baseUrl}/api/Service/toggle/${id}`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to toggle service");
    }
    return data;
  }

  // --- ServiceOrder APIs ---

  /**
   * Place a new service order
   * @param order { serviceId: number, quantity: number, scheduledFor: string }
   */
  /**
   * Places a new service order and returns the booking ID.
   * @param order { serviceId: number, quantity: number, scheduledFor: string }
   * @returns bookingId (number) if successful
   */
  async placeServiceOrder(order: {
    serviceId: number;
    quantity: number;
    scheduledFor: string;
  }): Promise<number> {
    const res = await this.fetchWithAuth(
      `${this.baseUrl}/api/ServiceOrder/place`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(order),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to place order");
    }
    // bookingId is data.data.id
    return data?.data?.id;
  }

  /**
   * Extracts the bookingId from a placeServiceOrder API response object.
   * @param response API response object
   * @returns bookingId (number) or undefined
   */
  getBookingIdFromOrderResponse(response: any): number | undefined {
    return response?.data?.id;
  }

  /**
   * Get orders for the current user
   */
  async getMyServiceOrders() {
    const res = await this.fetchWithAuth(
      `${this.baseUrl}/api/ServiceOrder/my-orders`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch your orders");
    }
    return data;
  }

  /**
   * Get all service orders (admin/org)
   * @param params Optional: { orgId?: number, status?: number, from?: string, to?: string }
   */
  async getAllServiceOrders(params?: {
    orgId?: number;
    status?: number;
    from?: string;
    to?: string;
  }) {
    const query = params
      ? "?" +
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== null && v !== "")
          .map(
            ([k, v]) =>
              `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`
          )
          .join("&")
      : "";
    const res = await this.fetchWithAuth(
      `${this.baseUrl}/api/ServiceOrder/all${query}`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch all orders");
    }
    return data;
  }

  /**
   * Update the status of a service order
   * @param id Order ID
   * @param status New status (number)
   */
  async updateServiceOrderStatus(id: number, status: number) {
    const res = await this.fetchWithAuth(
      `${this.baseUrl}/api/ServiceOrder/update-status/${id}`,
      {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to update order status");
    }
    return data;
  }
}

// Export a singleton instance
export const api = new JoaliApi(API_BASE, API_KEY);
