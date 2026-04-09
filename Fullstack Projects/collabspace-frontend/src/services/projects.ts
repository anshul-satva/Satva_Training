import type { ApiResponse } from "../types/api";
import type { Project } from "../types/entities";
import { apiClient } from "./api";

export const projectService = {
  async list(organizationId: string) {
    const { data } = await apiClient.get<ApiResponse<Project[]>>(
      `/organizations/${organizationId}/projects`,
    );
    return data.Result;
  },
  async create(
    organizationId: string,
    payload: { name?: string; description?: string },
  ) {
    const { data } = await apiClient.post<ApiResponse<Project>>(
      `/organizations/${organizationId}/projects`,
      payload,
    );
    return data.Result;
  },
  async getById(projectId: string) {
    const { data } = await apiClient.get<ApiResponse<Project>>(
      `/projects/${projectId}`,
    );
    return data.Result;
  },
  async update(
    projectId: string,
    payload: { name?: string; description?: string },
  ) {
    const { data } = await apiClient.patch<ApiResponse<Project>>(
      `/projects/${projectId}`,
      payload,
    );
    return data.Result;
  },
  async remove(projectId: string) {
    const { data } = await apiClient.delete<ApiResponse<Project>>(
      `/projects/${projectId}`,
    );
    return data.Result;
  },
};
