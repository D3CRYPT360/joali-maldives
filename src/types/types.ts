export const API_BASE = "http://144.91.126.109:5000";
export const API_KEY = "sk-8fj29dk3nf03jfldkf0293jf02ldkf03";

export type Organization = {
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

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string | null;
  organizationId?: number;
};

export type CustomerRegisterParams = {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
};

export type Service = {
  name: string;
  description: string;
  price: number;
  orgId: number;
  serviceTypeId: number;
  capacity?: number | 0;
  durationInMinutes?: number | 0;
};
