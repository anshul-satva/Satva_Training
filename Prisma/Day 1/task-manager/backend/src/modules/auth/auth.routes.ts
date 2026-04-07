import { Router } from "express";
import { matchedData } from "express-validator";
import { validateRequest } from "../../shared/middlewares/validateRequest.middleware";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/response";
import { loginUser, registerUser } from "./auth.service";
import { loginValidators, registerValidators } from "./auth.validation";
import { LoginInput, RegisterInput } from "./auth.types";

const router = Router();

router.post(
  "/register",
  registerValidators,
  validateRequest,
  asyncHandler(async (req, res) => {
    const data = matchedData(req, {
      locations: ["body"],
      includeOptionals: true,
    }) as RegisterInput;

    const result = await registerUser(data);
    sendSuccess(res, 201, "Registered successfully.", result);
  }),
);

router.post(
  "/login",
  loginValidators,
  validateRequest,
  asyncHandler(async (req, res) => {
    const data = matchedData(req, {
      locations: ["body"],
      includeOptionals: true,
    }) as LoginInput;

    const result = await loginUser(data);
    sendSuccess(res, 200, "Login successful.", result);
  }),
);

export default router;
