import type { TaskSummary } from "../../tasks/types/task.types";

export interface ActivitySummary {
  taskCount: number;
  commentCount: number;
  attachmentCount: number;
  reactionCount: number;
  overdueCount: number;
}

export interface DashboardPayload {
  summary: ActivitySummary;
  recentTasks: TaskSummary[];
}
