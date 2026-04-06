import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/response";
import { getRecentTasks, getUserActivitySummary } from "../task/task.service";

export const getSummary = asyncHandler(async (req: Request, res: Response) => {
  const summary = await getUserActivitySummary(req.userId!);
  sendSuccess(res, 200, "Activity summary fetched successfully.", summary);
});

export const getRecent = asyncHandler(async (req: Request, res: Response) => {
  const recentTasks = await getRecentTasks(req.userId!);
  sendSuccess(res, 200, "Recent tasks fetched successfully.", recentTasks);
});
