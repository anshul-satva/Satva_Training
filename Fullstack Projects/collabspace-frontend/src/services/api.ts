import axios from 'axios';
import { storage } from '../lib/storage';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api',
});

apiClient.interceptors.request.use((config) => {
  const token = storage.getToken();
  const activeOrganizationId = storage.getActiveOrganizationId();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (activeOrganizationId) {
    config.headers['x-organization-id'] = activeOrganizationId;
  }

  return config;
});

export const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.Message ??
      error.response?.data?.message ??
      error.message ??
      'Request failed'
    );
  }

  return error instanceof Error ? error.message : 'Something went wrong';
};
