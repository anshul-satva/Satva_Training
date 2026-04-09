import type { ApiResponse, OrganizationRole } from "../types/api";
import type {
  OrganizationDetail,
  OrganizationMembership,
} from "../types/entities";
import { apiClient } from "./api";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const organizationService = {
  async list() {
    const { data } =
      await apiClient.get<ApiResponse<OrganizationMembership[]>>(
        "/organizations",
      );
    return data.Result;
  },
  async create(payload: { name?: string; description?: string }) {
    const { data } = await apiClient.post<ApiResponse<OrganizationDetail>>(
      "/organizations",
      payload,
    );
    return data.Result;
  },
  async getById(organizationId: string) {
    const { data } = await apiClient.get<ApiResponse<OrganizationDetail>>(
      `/organizations/${organizationId}`,
    );
    return data.Result;
  },
  async update(
    organizationId: string,
    payload: { name?: string; description?: string },
  ) {
    const { data } = await apiClient.patch<ApiResponse<OrganizationDetail>>(
      `/organizations/${organizationId}`,
      payload,
    );
    return data.Result;
  },
  async listMembers(organizationId: string) {
    const { data } = await apiClient.get<ApiResponse<OrganizationMembership[]>>(
      `/organizations/${organizationId}/members`,
    );
    return data.Result;
  },
  async addMember(
    organizationId: string,
    payload: {
      name?: string;
      email: string;
      password?: string;
      role?: OrganizationRole;
    },
  ) {
    const { data } = await apiClient.post<ApiResponse<OrganizationMembership>>(
      `/organizations/${organizationId}/members`,
      {
        ...payload,
        email: normalizeEmail(payload.email),
      },
    );
    return data.Result;
  },
  async updateMemberRole(
    organizationId: string,
    memberId: string,
    payload: { role: OrganizationRole },
  ) {
    const { data } = await apiClient.patch<ApiResponse<OrganizationMembership>>(
      `/organizations/${organizationId}/members/${memberId}`,
      payload,
    );
    return data.Result;
  },
  async removeMember(organizationId: string, memberId: string) {
    await apiClient.delete(
      `/organizations/${organizationId}/members/${memberId}`,
    );
  },
};
