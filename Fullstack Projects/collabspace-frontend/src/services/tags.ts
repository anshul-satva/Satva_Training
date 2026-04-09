import type { ApiResponse } from "../types/api";
import type { TagEntity } from "../types/entities";
import { apiClient } from "./api";

export const tagService = {
  async list(organizationId: string) {
    const { data } = await apiClient.get<ApiResponse<TagEntity[]>>(
      `/organizations/${organizationId}/tags`,
    );
    return data.Result;
  },
  async create(
    organizationId: string,
    payload: { name?: string; color?: string },
  ) {
    const { data } = await apiClient.post<ApiResponse<TagEntity>>(
      `/organizations/${organizationId}/tags`,
      payload,
    );
    return data.Result;
  },
  async update(tagId: string, payload: { name?: string; color?: string }) {
    const { data } = await apiClient.patch<ApiResponse<TagEntity>>(
      `/tags/${tagId}`,
      payload,
    );
    return data.Result;
  },
  async remove(tagId: string) {
    await apiClient.delete(`/tags/${tagId}`);
  },
};
