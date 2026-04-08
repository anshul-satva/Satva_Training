import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.util.js";
import { getMe, login, register } from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.schema.js";

const authRoutes = Router();

authRoutes.post(
  "/register",
  validateRequest({ body: registerSchema }),
  asyncHandler(register),
);
authRoutes.post(
  "/login",
  validateRequest({ body: loginSchema }),
  asyncHandler(login),
);
authRoutes.get("/me", asyncHandler(requireAuth), asyncHandler(getMe));

export default authRoutes;
