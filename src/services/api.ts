import { API_BASE, API_KEY } from "../types/types";
import type { Organization, CustomerRegisterParams } from "../types/types";

class JoaliApi {
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
      this.setToken(
        data.token.accessToken,
        data.token.refreshToken,
        data.token.role
      );
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
  roleKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.tokenKey = "accessToken";
    this.refreshKey = "refreshToken";
    this.roleKey = "Role";
  }

  getAuthHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.getAccessToken()}`,
    };
  }

  setLocalStorage(accessToken: string, refreshToken: string, Role: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.tokenKey, accessToken);
      localStorage.setItem(this.refreshKey, refreshToken);
      localStorage.setItem(this.roleKey, Role);
    }
  }

  clearTokens(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.refreshKey);
      localStorage.removeItem(this.roleKey);
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
      this.setAccessToken(data.token.accessToken);
    }
    if (data.token && data.token.refreshToken) {
      this.setRefreshToken(data.token.refreshToken);
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
    this.clearAccessToken();
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
    org: Omit<
      Organization,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "parentOrganizationId"
      | "parentOrganization"
      | "isActive"
    >
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
}

// Export a singleton instance
export const api = new JoaliApi(API_BASE, API_KEY);
