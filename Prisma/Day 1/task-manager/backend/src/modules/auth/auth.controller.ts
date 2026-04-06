import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/response";
import { ValidationError } from "../../shared/errors/HttpErrors";
import { validateRegisterInput, validateLoginInput } from "./auth.validation";
import { registerUser, loginUser } from "./auth.service";

export const register = asyncHandler(async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  const parsed = validateRegisterInput(req.body);
  if (!parsed.success || !parsed.data) {
    throw new ValidationError(parsed.errors ?? {});
  }
  const result = await registerUser(parsed.data);
  sendSuccess(res, 201, "Registered successfully.", result);
});

export const login = asyncHandler(async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  const parsed = validateLoginInput(req.body);
  if (!parsed.success || !parsed.data) {
    throw new ValidationError(parsed.errors ?? {});
  }
  const result = await loginUser(parsed.data);
  sendSuccess(res, 200, "Login successful.", result);
});
