import { body, param } from "express-validator";

export const createCategoryValidators = [
  body("name").trim().notEmpty().withMessage("name is required"),
];

export const categoryIdParamValidators = [
  param("id").trim().notEmpty().withMessage("Category id is required"),
];
