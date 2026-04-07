import { Router } from "express";
import { matchedData } from "express-validator";
import protect from "../../shared/middlewares/auth.middleware";
import { validateRequest } from "../../shared/middlewares/validateRequest.middleware";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/response";
import { createTag, getTags, getTasksByTag } from "./tag.service";
import { createTagValidators, tagIdParamValidators } from "./tag.validation";
import { CreateTagInput } from "./tag.types";

const router = Router();

router.use(protect);

router.post(
  "/",
  createTagValidators,
  validateRequest,
  asyncHandler(async (req, res) => {
    const data = matchedData(req, {
      locations: ["body"],
      includeOptionals: true,
    }) as CreateTagInput;

    const tag = await createTag(data);
    sendSuccess(res, 201, "Tag created successfully.", tag);
  }),
);

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const tags = await getTags();
    sendSuccess(res, 200, "Tags fetched successfully.", tags);
  }),
);

router.get(
  "/:id/tasks",
  tagIdParamValidators,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = matchedData(req, {
      locations: ["params"],
      includeOptionals: true,
    }) as { id: string };

    const tasks = await getTasksByTag(id, req.userId!);
    sendSuccess(res, 200, "Tagged tasks fetched successfully.", tasks);
  }),
);

export default router;
