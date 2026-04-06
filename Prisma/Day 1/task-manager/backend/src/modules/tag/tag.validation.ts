import { ValidationResult } from "../../shared/types/api.types";
import { CreateTagInput } from "./tag.types";

export const validateCreateTagInput = (
  body: unknown,
): ValidationResult<CreateTagInput> => {
  const input = (body ?? {}) as Partial<CreateTagInput>;
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
