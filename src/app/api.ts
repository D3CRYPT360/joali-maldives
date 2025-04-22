// API utility using a class-based system for better structure and reusability

const API_BASE = "http://144.91.126.109:5000";
const API_KEY = "sk-8fj29dk3nf03jfldkf0293jf02ldkf03";

type Organization = {
  id: number;
  name: string;
  registrationNumber: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  website?: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string | null;
  parentOrganizationId?: number | null;
  parentOrganization?: any | null;
  type: number;
};

class JoaliApi {
  

  baseUrl: string;
  apiKey: string;
  headers: Record<string, string>;
  tokenKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.tokenKey = '';
    this.headers = { "Content-Type": "application/json", 'Authorization': `Bearer ${this.getAccessToken()}` };
  }

  

  setAccessToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  clearAccessToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
  }

  async login({ email, password }: { email: string; password: string }) {
    const res = await fetch(`${this.baseUrl}/api/Auth/Login`, {
      method: "POST",
      headers: this.headers,
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
    
    return data;
  }

  async customerRegister({ name, email, phone, password, passwordConfirm }: { name: string; email: string; phone: string; password: string; passwordConfirm: string }) {
    const res = await fetch(`${this.baseUrl}/api/User/CustomerRegister?apiKey=${this.apiKey}`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ name, email, phone, password, passwordConfirm }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("Registration error:", data);
      throw new Error(data.message || JSON.stringify(data) || "Registration failed");
    }
    return data;
  }

  async getAllUsers() {
    const res = await fetch(`${this.baseUrl}/api/User/AllUsers?apiKey=${this.apiKey}`, {
      method: "GET",
      headers: this.headers,
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("Get users error:", data);
      throw new Error(data.message || JSON.stringify(data) || "Failed to fetch users");
    }
    return data;
  }

  async logout() {
    const accessToken = this.getAccessToken();
    if (!accessToken) throw new Error('No access token found');
    const res = await fetch(`${this.baseUrl}/api/Auth/Logout`, {
      method: "POST",
      headers: this.headers
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
    const res = await fetch(`${this.baseUrl}/api/User/ToggleUser?apiKey=${this.apiKey}&Email=${email}`, {
      method: "POST",
      headers: this.headers,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to toggle user');
    }
    return data;
  }

  async getAllOrganizations(): Promise<Organization[]> {
    const res = await fetch(`${this.baseUrl}/api/Organization`, {
      method: "GET",
      headers: this.headers
    });
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

  async createOrganization(org: Omit<Organization, 'id' | 'createdAt' | 'updatedAt' | 'parentOrganizationId' | 'parentOrganization' | 'isActive'>) {
    const res = await fetch(`${this.baseUrl}/api/Organization/Create`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(org),
    });
    let data = null;
    const text = await res.text();
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      data = null;
    }
    if (!res.ok) throw new Error((data && data.message) || 'Failed to create organization');
    return data;
  }
}

// Export a singleton instance
export const api = new JoaliApi(API_BASE, API_KEY);