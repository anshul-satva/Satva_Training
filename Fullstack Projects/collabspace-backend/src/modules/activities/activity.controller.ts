import type { Request, Response } from "express";
import { sendResponse } from "../../utils/response.util.js";
import { activityService } from "./activity.service.js";

export const listActivities = async (request: Request, response: Response) => {
  const activities = await activityService.listActivities(request.params.taskId);

  return sendResponse(response, 200, "Activity log fetched successfully", activities);
};

export const listAssignmentHistory = async (request: Request, response: Response) => {
  const history = await activityService.listAssignmentHistory(request.params.taskId);

  return sendResponse(response, 200, "Assignment history fetched successfully", history);
};
