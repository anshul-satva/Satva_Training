import { body, param } from "express-validator";

export const createTagValidators = [
  body("name").trim().notEmpty().withMessage("name is required"),
];

export const tagIdParamValidators = [
  param("id").trim().notEmpty().withMessage("Tag id is required"),
];
