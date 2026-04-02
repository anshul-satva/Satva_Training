import { ApiResponse, ResponseStatus } from "../types/api-response.types.js";

export interface AppError extends Error {
  statusCode: number;
}

export const createAppError = (statusCode: number, message: string): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  return error;
};

export const isAppError = (error: unknown): error is AppError => {
  return (
    error instanceof Error &&
    typeof (error as { statusCode?: unknown }).statusCode === "number"
  );
};

export const ok = <T>(message: string, result: T): ApiResponse<T> => {
  return {
    responseStatus: ResponseStatus.Success,
    message,
    result,
  };
};

export const fail = (message: string): ApiResponse<null> => {
  return {
    responseStatus: ResponseStatus.Error,
    message,
    result: null,
  };
};
