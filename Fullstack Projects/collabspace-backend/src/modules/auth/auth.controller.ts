import type { Request, Response } from "express";
import { sendResponse } from "../../utils/response.util.js";
import { authService } from "./auth.service.js";

export const register = async (request: Request, response: Response) => {
  const result = await authService.register(request.body);
  return sendResponse(response, 201, "User registered successfully", result);
};

export const login = async (request: Request, response: Response) => {
  const result = await authService.login(request.body);
  return sendResponse(response, 200, "Login successful", result);
};

export const getMe = async (request: Request, response: Response) => {
  const user = await authService.getMe(request.currentUser?.id as string);
  return sendResponse(response, 200, "User profile fetched successfully", user);
};
