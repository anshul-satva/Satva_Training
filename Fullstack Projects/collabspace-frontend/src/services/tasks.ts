import type { ApiResponse, TaskStatus } from "../types/api";
import type {
  ActivityEntity,
  AssignmentHistoryEntity,
  BoardResponse,
  CommentEntity,
  TaskEntity,
} from "../types/entities";
import { apiClient } from "./api";

export const taskService = {
  async list(projectId: string, includeArchived = false) {
    const { data } = await apiClient.get<ApiResponse<TaskEntity[]>>(
      `/projects/${projectId}/tasks`,
      {
        params: includeArchived ? { includeArchived: true } : undefined,
      },
    );
    return data.Result;
  },
  async board(projectId: string) {
    const { data } = await apiClient.get<ApiResponse<BoardResponse>>(
      `/projects/${projectId}/board`,
    );
    return data.Result;
  },
  async create(
    projectId: string,
    payload: {
      title?: string;
      description?: string;
      assignedUserId?: string | null;
      status?: TaskStatus;
      tagIds?: string[];
    },
  ) {
    const { data } = await apiClient.post<ApiResponse<TaskEntity>>(
      `/projects/${projectId}/tasks`,
      payload,
    );
    return data.Result;
  },
  async getById(taskId: string) {
    const { data } = await apiClient.get<ApiResponse<TaskEntity>>(
      `/tasks/${taskId}`,
    );
    return data.Result;
  },
  async update(
    taskId: string,
    payload: {
      title?: string;
      description?: string;
      assignedUserId?: string | null;
      status?: TaskStatus;
      tagIds?: string[];
    },
  ) {
    const { data } = await apiClient.patch<ApiResponse<TaskEntity>>(
      `/tasks/${taskId}`,
      payload,
    );
    return data.Result;
  },
  async archive(taskId: string) {
    const { data } = await apiClient.delete<ApiResponse<TaskEntity>>(
      `/tasks/${taskId}`,
    );
    return data.Result;
  },
  async comments(taskId: string) {
    const { data } = await apiClient.get<ApiResponse<CommentEntity[]>>(
      `/tasks/${taskId}/comments`,
    );
    return data.Result;
  },
  async addComment(taskId: string, payload: { content: string }) {
    const { data } = await apiClient.post<ApiResponse<CommentEntity>>(
      `/tasks/${taskId}/comments`,
      payload,
    );
    return data.Result;
  },
  async activities(taskId: string) {
    const { data } = await apiClient.get<ApiResponse<ActivityEntity[]>>(
      `/tasks/${taskId}/activities`,
    );
    return data.Result;
  },
  async assignmentHistory(taskId: string) {
    const { data } = await apiClient.get<
      ApiResponse<AssignmentHistoryEntity[]>
    >(`/tasks/${taskId}/assignment-history`);
    return data.Result;
  },
};
