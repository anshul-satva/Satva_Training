import { Router } from "express";
import protect from "../../shared/middlewares/auth.middleware";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/response";
import { getRecentTasks, getUserActivitySummary } from "../task/task.service";

const router = Router();

router.use(protect);

router.get(
  "/summary",
  asyncHandler(async (req, res) => {
    const summary = await getUserActivitySummary(req.userId!);
    sendSuccess(res, 200, "Activity summary fetched successfully.", summary);
  }),
);

router.get(
  "/recent",
  asyncHandler(async (req, res) => {
    const recentTasks = await getRecentTasks(req.userId!);
    sendSuccess(res, 200, "Recent tasks fetched successfully.", recentTasks);
  }),
);

export default router;
