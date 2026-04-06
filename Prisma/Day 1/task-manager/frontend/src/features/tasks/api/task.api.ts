import { apiClient } from "../../../shared/api/axios";
import type { ApiSuccess } from "../../../shared/types/api.types";
import type {
  Attachment,
  Category,
  Comment,
  CreateTaskPayload,
  ReactionType,
  Tag,
  TaskDetail,
  TaskFilters,
  TaskSummary,
  UpdateTaskPayload,
} from "../types/task.types";

export const fetchTasks = async (filters: TaskFilters) => {
  const response = await apiClient.get<ApiSuccess<TaskSummary[]>>("/tasks", {
    params: {
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.priority ? { priority: filters.priority } : {}),
      ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
      ...(filters.tagId ? { tagId: filters.tagId } : {}),
    },
  });

  return response.data;
};

export const fetchTaskById = async (taskId: string) => {
  const response = await apiClient.get<ApiSuccess<TaskDetail>>(`/tasks/${taskId}`);
  return response.data;
};

export const createTask = async (payload: CreateTaskPayload) => {
  const response = await apiClient.post<ApiSuccess<TaskDetail>>("/tasks", payload);
  return response.data;
};

export const updateTask = async (taskId: string, payload: UpdateTaskPayload) => {
  const response = await apiClient.put<ApiSuccess<TaskDetail>>(`/tasks/${taskId}`, payload);
  return response.data;
};

export const deleteTask = async (taskId: string) => {
  const response = await apiClient.delete<ApiSuccess<undefined>>(`/tasks/${taskId}`);
  return response.data;
};

export const fetchTags = async () => {
  const response = await apiClient.get<ApiSuccess<Tag[]>>("/tags");
  return response.data;
};

export const fetchCategories = async () => {
  const response = await apiClient.get<ApiSuccess<Category[]>>("/categories");
  return response.data;
};

export const createCategory = async (name: string) => {
  const response = await apiClient.post<ApiSuccess<Category>>("/categories", { name });
  return response.data;
};

export const createTag = async (name: string) => {
  const response = await apiClient.post<ApiSuccess<Tag>>("/tags", { name });
  return response.data;
};

export const createComment = async (taskId: string, content: string) => {
  const response = await apiClient.post<ApiSuccess<Comment>>(`/tasks/${taskId}/comments`, {
    content,
  });
  return response.data;
};

export const addAttachment = async (
  taskId: string,
  file: File,
) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<ApiSuccess<Attachment>>(
    `/tasks/${taskId}/attachments`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const deleteAttachment = async (taskId: string, attachmentId: string) => {
  const response = await apiClient.delete<ApiSuccess<undefined>>(
    `/tasks/${taskId}/attachments/${attachmentId}`,
  );
  return response.data;
};

export const addReaction = async (commentId: string, reactionType: ReactionType) => {
  const response = await apiClient.post<ApiSuccess<unknown>>(
    `/tasks/comments/${commentId}/reactions`,
    { reactionType },
  );
  return response.data;
};

export const removeReaction = async (commentId: string) => {
  const response = await apiClient.delete<ApiSuccess<unknown>>(
    `/tasks/comments/${commentId}/reactions`,
  );
  return response.data;
};
