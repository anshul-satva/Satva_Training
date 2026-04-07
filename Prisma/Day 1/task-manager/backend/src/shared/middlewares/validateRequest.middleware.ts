import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ValidationError } from "../errors/HttpErrors";

export const validateRequest = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    next();
    return;
  }

  const errors = result.array().reduce<Record<string, string[]>>((acc, error) => {
    const field = error.type === "field" ? error.path : "request";

    if (!acc[field]) {
      acc[field] = [];
    }

    acc[field].push(error.msg);
    return acc;
  }, {});

  next(new ValidationError(errors));
};
