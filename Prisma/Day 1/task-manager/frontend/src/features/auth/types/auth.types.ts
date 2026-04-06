import type { ApiSuccess } from "../../../shared/types/api.types";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponseData {
  token: string;
  user: SessionUser;
}

export type AuthResponse = ApiSuccess<AuthResponseData>;
