import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/response";
import { ValidationError } from "../../shared/errors/HttpErrors";
import {
  createCategory,
  getCategories,
  getCategoryTasks,
} from "./category.service";
import { validateCreateCategoryInput } from "./category.validation";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const parsed = validateCreateCategoryInput(req.body);

  if (!parsed.success || !parsed.data) {
    throw new ValidationError(parsed.errors ?? {});
  }

  const category = await createCategory(parsed.data);
  sendSuccess(res, 201, "Category created successfully.", category);
});

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await getCategories();
  sendSuccess(res, 200, "Categories fetched successfully.", categories);
});

export const getTasks = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const tasks = await getCategoryTasks(req.params.id, req.userId!);
    sendSuccess(res, 200, "Category tasks fetched successfully.", tasks);
  },
);
