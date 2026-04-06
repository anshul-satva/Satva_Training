import { ValidationResult } from "../../shared/types/api.types";
import { CreateCategoryInput } from "./category.types";

export const validateCreateCategoryInput = (
  body: unknown,
): ValidationResult<CreateCategoryInput> => {
  const input = (body ?? {}) as Partial<CreateCategoryInput>;
  const errors: Record<string, string[]> = {};
  const name = typeof input.name === "string" ? input.name.trim() : "";

  if (!name) {
    errors.name = ["name is required"];
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      name,
    },
  };
};
