import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/response";
import { ValidationError } from "../../shared/errors/HttpErrors";
import { createTag, getTags, getTasksByTag } from "./tag.service";
import { validateCreateTagInput } from "./tag.validation";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const parsed = validateCreateTagInput(req.body);

  if (!parsed.success || !parsed.data) {
    throw new ValidationError(parsed.errors ?? {});
  }

  const tag = await createTag(parsed.data);
  sendSuccess(res, 201, "Tag created successfully.", tag);
});

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const tags = await getTags();
  sendSuccess(res, 200, "Tags fetched successfully.", tags);
});

export const getTasks = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const tasks = await getTasksByTag(req.params.id, req.userId!);
    sendSuccess(res, 200, "Tagged tasks fetched successfully.", tasks);
  },
);
