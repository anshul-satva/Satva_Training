import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../shared/types/api-response.types.js";
import { fail, isAppError } from "../shared/utils/api-response.js";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response<ApiResponse<null>>,
  _next: NextFunction,
): void => {
  if (isAppError(err)) {
    res.status(err.statusCode).json(fail(err.message));
    return;
  }

  res.status(500).json(fail("Internal server error"));
};
