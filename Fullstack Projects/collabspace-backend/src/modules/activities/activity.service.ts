import { activityRepository } from "./activity.repository.js";

export const activityService = {
  listActivities(taskId: string) {
    return activityRepository.findActivitiesByTask(taskId);
  },

  listAssignmentHistory(taskId: string) {
    return activityRepository.findAssignmentHistoryByTask(taskId);
  },
};
