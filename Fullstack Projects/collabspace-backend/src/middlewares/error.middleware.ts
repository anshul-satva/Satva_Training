import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ResponseStatus } from "../constants/app.constant.js";
import { sendResponse } from "../utils/response.util.js";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly responseStatus: number;

  constructor(message: string, statusCode = 400, responseStatus = ResponseStatus.Error) {
    super(message);
    this.statusCode = statusCode;
    this.responseStatus = responseStatus;
  }
}

export const notFoundHandler = (_request: Request, response: Response) =>
  sendResponse(
    response,
    404,
    "Route not found",
    null,
    ResponseStatus.NotFound,
  );

export const errorHandler = (
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    return sendResponse(
      response,
      error.statusCode,
      error.message,
      null,
      error.responseStatus,
    );
  }

  if (error instanceof ZodError) {
    return sendResponse(
      response,
      422,
      "Validation failed",
      error.flatten(),
      ResponseStatus.ValidationError,
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return sendResponse(
      response,
      400,
      "Database request failed",
      {
        code: error.code,
        meta: error.meta,
      },
      ResponseStatus.Error,
    );
  }

  return sendResponse(
    response,
    500,
    "Internal server error",
    null,
    ResponseStatus.Error,
  );
};
