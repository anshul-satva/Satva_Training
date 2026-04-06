import { ValidationResult } from "../../shared/types/api.types";
import { LoginInput, RegisterInput } from "./auth.types";

const isValidEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const validateRegisterInput = (
  body: unknown,
): ValidationResult<RegisterInput> => {
  const errors: Record<string, string[]> = {};

  const input = (body ?? {}) as Partial<RegisterInput>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email =
    typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";

  if (!name) {
    errors.name = ["Name is required"];
  }

  if (!email) {
    errors.email = ["Email is required"];
  } else if (!isValidEmail(email)) {
    errors.email = ["Invalid email format"];
  }

  if (!password) {
    errors.password = ["Password is required"];
  } else if (password.length < 6) {
    errors.password = ["Password must be at least 6 characters"];
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      name,
      email,
      password,
    },
  };
};

export const validateLoginInput = (
  body: unknown,
): ValidationResult<LoginInput> => {
  const errors: Record<string, string[]> = {};

  const input = (body ?? {}) as Partial<LoginInput>;
  const email =
    typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";

  if (!email) {
    errors.email = ["Email is required"];
  } else if (!isValidEmail(email)) {
    errors.email = ["Invalid email format"];
  }

  if (!password) {
    errors.password = ["Password is required"];
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      email,
      password,
    },
  };
};
