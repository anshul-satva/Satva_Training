import { apiClient } from "../../../shared/api/axios";
import type { ApiSuccess } from "../../../shared/types/api.types";
import type { ActivitySummary } from "../types/dashboard.types";
import type { TaskSummary } from "../../tasks/types/task.types";

export const fetchActivitySummary = async () => {
  const response =
    await apiClient.get<ApiSuccess<ActivitySummary>>("/dashboard/summary");
  return response.data;
};

export const fetchRecentTasks = async () => {
  const response =
    await apiClient.get<ApiSuccess<TaskSummary[]>>("/dashboard/recent");
  return response.data;
};
