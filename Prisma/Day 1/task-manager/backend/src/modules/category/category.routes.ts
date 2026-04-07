import { Router } from "express";
import { matchedData } from "express-validator";
import protect from "../../shared/middlewares/auth.middleware";
import { validateRequest } from "../../shared/middlewares/validateRequest.middleware";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/response";
import {
  createCategory,
  getCategories,
  getCategoryTasks,
} from "./category.service";
import {
  categoryIdParamValidators,
  createCategoryValidators,
} from "./category.validation";
import { CreateCategoryInput } from "./category.types";

const router = Router();

router.use(protect);

router.post(
  "/",
  createCategoryValidators,
  validateRequest,
  asyncHandler(async (req, res) => {
    const data = matchedData(req, {
      locations: ["body"],
      includeOptionals: true,
    }) as CreateCategoryInput;

    const category = await createCategory(data);
    sendSuccess(res, 201, "Category created successfully.", category);
  }),
);

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const categories = await getCategories();
    sendSuccess(res, 200, "Categories fetched successfully.", categories);
  }),
);

router.get(
  "/:id/tasks",
  categoryIdParamValidators,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = matchedData(req, {
      locations: ["params"],
      includeOptionals: true,
    }) as { id: string };

    const tasks = await getCategoryTasks(id, req.userId!);
    sendSuccess(res, 200, "Category tasks fetched successfully.", tasks);
  }),
);

export default router;
