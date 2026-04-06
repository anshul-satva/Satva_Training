import { apiClient } from "../../../shared/api/axios";
import type { ApiSuccess } from "../../../shared/types/api.types";
import type {
  AuthResponseData,
  LoginPayload,
  RegisterPayload,
} from "../types/auth.types";

export const registerUser = async (payload: RegisterPayload) => {
  const response = await apiClient.post<ApiSuccess<AuthResponseData>>(
    "/auth/register",
    payload,
  );
  return response.data;
};

export const loginUser = async (payload: LoginPayload) => {
  const response = await apiClient.post<ApiSuccess<AuthResponseData>>(
    "/auth/login",
    payload,
  );
  return response.data;
};
