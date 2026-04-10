import { Router } from "express";
import { requireTaskAccess } from "../../middlewares/access.middleware.js";

import { validateRequest } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.util.js";
import { createComment, listComments } from "./comment.controller.js";
import { commentParamsSchema, createCommentSchema } from "./comment.schema.js";

const commentRoutes = Router();



commentRoutes.get(
  "/tasks/:taskId/comments",
  validateRequest({ params: commentParamsSchema }),
  asyncHandler(requireTaskAccess()),
  asyncHandler(listComments),
);
commentRoutes.post(
  "/tasks/:taskId/comments",
  validateRequest({ params: commentParamsSchema, body: createCommentSchema }),
  asyncHandler(requireTaskAccess()),
  asyncHandler(createComment),
);

export default commentRoutes;
