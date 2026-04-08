import { Router } from "express";
import { requireProjectAccess, requireTaskAccess } from "../../middlewares/access.middleware.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.util.js";
import {
  archiveTask,
  createTask,
  getProjectBoard,
  getTask,
  listTasks,
  updateTask,
} from "./task.controller.js";
import {
  createTaskSchema,
  projectTaskParamsSchema,
  taskParamsSchema,
  updateTaskSchema,
} from "./task.schema.js";

const taskRoutes = Router();

taskRoutes.use(asyncHandler(requireAuth));

taskRoutes.get(
  "/projects/:projectId/tasks",
  validateRequest({ params: projectTaskParamsSchema }),
  asyncHandler(requireProjectAccess()),
  asyncHandler(listTasks),
);
taskRoutes.get(
  "/projects/:projectId/board",
  validateRequest({ params: projectTaskParamsSchema }),
  asyncHandler(requireProjectAccess()),
  asyncHandler(getProjectBoard),
);
taskRoutes.post(
  "/projects/:projectId/tasks",
  validateRequest({ params: projectTaskParamsSchema, body: createTaskSchema }),
  asyncHandler(requireProjectAccess()),
  asyncHandler(createTask),
);
taskRoutes.get(
  "/tasks/:taskId",
  validateRequest({ params: taskParamsSchema }),
  asyncHandler(requireTaskAccess()),
  asyncHandler(getTask),
);
taskRoutes.patch(
  "/tasks/:taskId",
  validateRequest({ params: taskParamsSchema, body: updateTaskSchema }),
  asyncHandler(requireTaskAccess()),
  asyncHandler(updateTask),
);
taskRoutes.delete(
  "/tasks/:taskId",
  validateRequest({ params: taskParamsSchema }),
  asyncHandler(requireTaskAccess()),
  asyncHandler(archiveTask),
);

export default taskRoutes;
