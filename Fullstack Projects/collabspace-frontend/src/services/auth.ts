import type { ApiResponse } from '../types/api';
import type { AuthUser } from '../types/entities';
import { apiClient } from './api';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export type AuthPayload = {
  token: string;
  user: AuthUser;
};

export const authService = {
  async login(payload: { email: string; password: string }) {
    const { data } = await apiClient.post<ApiResponse<AuthPayload>>('/auth/login', {
      ...payload,
      email: normalizeEmail(payload.email),
    });
    return data.Result;
  },
  async register(payload: {
    name?: string;
    email: string;
    password: string;
    organizationName: string;
  }) {
    const { data } = await apiClient.post<ApiResponse<AuthUser>>('/auth/register', {
      ...payload,
      email: normalizeEmail(payload.email),
    });
    return data.Result;
  },
  async me() {
    const { data } = await apiClient.get<ApiResponse<AuthUser>>('/auth/me');
    return data.Result;
  },
};
