import { Router } from "express";
import { requireTaskAccess } from "../../middlewares/access.middleware.js";

import { validateRequest } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.util.js";
import { listActivities, listAssignmentHistory } from "./activity.controller.js";
import { activityParamsSchema } from "./activity.schema.js";

const activityRoutes = Router();



activityRoutes.get(
  "/tasks/:taskId/activities",
  validateRequest({ params: activityParamsSchema }),
  asyncHandler(requireTaskAccess()),
  asyncHandler(listActivities),
);
activityRoutes.get(
  "/tasks/:taskId/assignment-history",
  validateRequest({ params: activityParamsSchema }),
  asyncHandler(requireTaskAccess()),
  asyncHandler(listAssignmentHistory),
);

export default activityRoutes;
