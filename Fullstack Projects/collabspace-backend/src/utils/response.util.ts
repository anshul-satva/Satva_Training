import type { Response } from "express";
import { ResponseStatus } from "../constants/app.constant.js";

type ApiResponse = {
  ResponseStatus: number;
  Message: string;
  Result: unknown;
};

export const sendResponse = (
  response: Response,
  statusCode: number,
  message: string,
  result: unknown,
  responseStatus = ResponseStatus.Success,
) => {
  const payload: ApiResponse = {
    ResponseStatus: responseStatus,
    Message: message,
    Result: result,
  };

  return response.status(statusCode).json(payload);
};
