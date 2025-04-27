import { API_BASE, API_KEY } from "../types/types";
import type { Organization, CustomerRegisterParams } from "../types/types";
import axiosInstance from "@/utils/axiosInstace";

class JoaliApi {
  /**
   * Pay for a booking
   * @param bookingId The booking/order id to pay for
   */
  async payForBooking(bookingId: number | string) {
    try {
      const response = await axiosInstance.post(
        `${this.baseUrl}/api/service/pay`,
        String(bookingId),
        {
          headers: {
            "Content-Type": "text/plain", // assuming backend expects plain string
          },
        }
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Payment failed";
      throw new Error(message);
    }
  }

  // --- Services ---
  /**
   * Fetch all services or filtered services (e.g., rooms for a hotel) by passing filter params.
   * @param filters Optional filters: { orgId, typeId, ... }
   */
  async getAllServices(filters?: {
    orgId?: number | string;
    typeId?: number | string;
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
    try {
      const response = await axiosInstance.get(url);
      let data = response.data;
      if (!Array.isArray(data)) data = [];
      return data;
    } catch (error: any) {
      console.error("Error fetching services:", error);
      return [];
    }
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
    try {
      const response = await axiosInstance.post(
        `${this.baseUrl}/api/Service/create`,
        service
      );
      return response.data;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || error.message || "Failed to create service";
      throw new Error(message);
    }
  }

  // --- Service Types ---
  async getAllServiceTypes() {
    try {
      const response = await axiosInstance.get(
        `${this.baseUrl}/api/Service/all-service-types`
      );
      let data = response.data;
      if (!Array.isArray(data)) data = [];
      return data;
    } catch (error: any) {
      console.error("Error fetching service types:", error);
      return [];
    }
  }

  async createServiceType(serviceType: { name: string; description: string }) {
    try {
      const response = await axiosInstance.post(
        `${this.baseUrl}/api/Service/create-service-type`,
        serviceType
      );
      return response.data;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || error.message || "Failed to create service type";
      throw new Error(message);
    }
  }

  async refreshTokenIfNeeded(): Promise<boolean> {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    if (!accessToken || !refreshToken) return false;
    
    try {
      // Use a direct fetch here instead of axiosInstance to avoid circular token refresh
      const response = await fetch(`${this.baseUrl}/api/Auth/RefreshToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, refreshToken }),
      });
      
      const data = await response.json();
      
      if (
        response.ok &&
        data.token &&
        data.token.accessToken &&
        data.token.refreshToken
      ) {
        this.setLocalStorage(data.token.accessToken, data.token.refreshToken);
        return true;
      }
      
      this.clearTokens();
      return false;
    } catch (error) {
      this.clearTokens();
      return false;
    }
  }

  // This method is kept for backward compatibility but is no longer used
  // All API calls now use axiosInstance which handles token refresh via interceptors
  async fetchWithAuth(input: RequestInfo, init?: RequestInit, retry = true) {
    console.warn('fetchWithAuth is deprecated. Use axiosInstance instead.');
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
    try {
      const response = await axiosInstance.post(
        `${this.baseUrl}/api/Auth/Login`,
        { email, password, apiKey: this.apiKey }
      );
      const data = response.data;
      console.log(data);
      
      // Cache accessToken in localStorage
      if (data.token && data.token.accessToken) {
        this.setLocalStorage(data.token.accessToken, data.token.refreshToken);
      }
      
      return data;
    } catch (error: any) {
      console.error("Login error:", error.response?.data);
      const message = 
        error.response?.data?.message || error.message || "Login failed";
      throw new Error(message);
    }
  }

  async customerRegister(params: CustomerRegisterParams) {
    try {
      const response = await axiosInstance.post(
        `${this.baseUrl}/api/User/CustomerRegister?apiKey=${this.apiKey}`,
        params
      );
      return response.data;
    } catch (error: any) {
      console.error("Registration error:", error.response?.data);
      const message = 
        error.response?.data?.message || error.message || "Registration failed";
      throw new Error(message);
    }
  }

  async getAllUsers() {
    try {
      const response = await axiosInstance.get(
        `${this.baseUrl}/api/User/AllUsers?apiKey=${this.apiKey}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Get users error:", error);
      const message = 
        error.response?.data?.message || error.message || "Failed to fetch users";
      throw new Error(message);
    }
  }

  async logout() {
    const accessToken = this.getAccessToken();
    if (!accessToken) throw new Error("No access token found");
    
    try {
      const response = await axiosInstance.post(`${this.baseUrl}/api/Auth/Logout`);
      this.clearTokens();
      return response.data;
    } catch (error: any) {
      console.error("Logout error:", error.response?.data);
      const message = 
        error.response?.data?.message || error.message || "Logout failed";
      throw new Error(message);
    }
  }

  async toggleUser(email: string) {
    try {
      const response = await axiosInstance.put(
        `${this.baseUrl}/api/User/ToggleUser?apiKey=${this.apiKey}&Email=${email}`
      );
      return response.data;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || error.message || "Failed to toggle user";
      throw new Error(message);
    }
  }

  async toggleOrganization(id: number) {
    console.log(id);
    try {
      const response = await axiosInstance.put(
        `${this.baseUrl}/api/Organization/toggle/${id}`
      );
      return response.data;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || error.message || "Failed to toggle organization";
      throw new Error(message);
    }
  }

  async getOrganizationById(id: number): Promise<Organization | null> {
    try {
      const response = await axiosInstance.get(
        `${this.baseUrl}/api/Organization/${id}`
      );
      return response.data;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || error.message || "Failed to fetch organization";
      throw new Error(message);
    }
  }

  async getAllOrganizations(orgType?: number): Promise<Organization[]> {
    try {
      const response = await axiosInstance.get(
        `${this.baseUrl}/api/Organization?orgtype=${orgType || ""}`
      );
      let data = response.data;
      if (!Array.isArray(data)) data = [];
      return data;
    } catch (error: any) {
      console.error("Error fetching organizations:", error);
      return [];
    }
  }

  async createOrganization(org: {
    name: string;
    registrationNumber: string;
    email: string;
    phone: string;
    address: string;
    country: string;
    logoUrl: string;
    website: string;
    orgType: number;
  }) {
    try {
      const response = await axiosInstance.post(
        `${this.baseUrl}/api/Organization/Create`,
        org
      );
      return response.data;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || error.message || "Failed to create organization";
      throw new Error(message);
    }
  }

  async resetInitialPassword(
    email: string,
    temporaryKey: string,
    newPassword: string
  ) {
    try {
      const response = await axiosInstance.post(
        `${this.baseUrl}/api/Auth/ResetPassword`,
        { email, temporaryKey, newPassword }
      );
      return response.data;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || error.message || "Failed to reset initial password";
      throw new Error(message);
    }
  }

  async createStaff(staff: {
    name: string;
    email: string;
    phoneNumber: string;
    orgId: number;
  }) {
    try {
      const response = await axiosInstance.post(
        `${this.baseUrl}/api/User/NewStaff?apiKey=${this.apiKey}`,
        staff
      );
      return response.data;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || error.message || "Failed to create staff";
      throw new Error(message);
    }
  }

  async toggleService(id: number) {
    try {
      const response = await axiosInstance.post(
        `${this.baseUrl}/api/Service/toggle/${id}`
      );
      return response.data;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || error.message || "Failed to toggle service";
      throw new Error(message);
    }
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
    try {
      const response = await axiosInstance.post(
        `${this.baseUrl}/api/ServiceOrder/place`,
        order
      );
      // bookingId is response.data.data.id
      return response.data?.data?.id;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || error.message || "Failed to place order";
      throw new Error(message);
    }
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
    try {
      const response = await axiosInstance.get(
        `${this.baseUrl}/api/ServiceOrder/my-orders`
      );
      return response.data;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || error.message || "Failed to fetch your orders";
      throw new Error(message);
    }
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
    try {
      const response = await axiosInstance.get(
        `${this.baseUrl}/api/ServiceOrder/all${query}`
      );
      return response.data;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || error.message || "Failed to fetch all orders";
      throw new Error(message);
    }
  }

  /**
   * Update the status of a service order
   * @param id Order ID
   * @param status New status (number)
   */
  async updateServiceOrderStatus(id: number, status: number) {
    try {
      const response = await axiosInstance.put(
        `${this.baseUrl}/api/ServiceOrder/update-status/${id}`,
        { status }
      );
      return response.data;
    } catch (error: any) {
      const message = 
        error.response?.data?.message || error.message || "Failed to update order status";
      throw new Error(message);
    }
  }
}

// Export a singleton instance
export const api = new JoaliApi(API_BASE, API_KEY);
