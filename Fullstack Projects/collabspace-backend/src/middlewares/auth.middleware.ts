import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { ResponseStatus } from "../constants/app.constant.js";
import { verifyAccessToken } from "../utils/jwt.util.js";
import { AppError } from "./error.middleware.js";

export const requireAuth = async (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return next(
      new AppError("Authentication token is required", 401, ResponseStatus.Unauthorized),
    );
  }

  const token = authorizationHeader.replace("Bearer ", "");
  let payload: { userId: string; email: string };
  try {
    payload = verifyAccessToken(token);
  } catch {
    return next(
      new AppError(
        "Invalid or expired authentication token",
        401,
        ResponseStatus.Unauthorized,
      ),
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  if (!user) {
    return next(new AppError("User not found", 401, ResponseStatus.Unauthorized));
  }

  request.currentUser = user;
  next();
};
