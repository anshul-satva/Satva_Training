import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject, ZodTypeAny } from "zod";

type ValidationSchemas = {
  body?: ZodTypeAny;
  params?: AnyZodObject;
  query?: AnyZodObject;
};

export const validateRequest =
  (schemas: ValidationSchemas) =>
  (request: Request, _response: Response, next: NextFunction) => {
    if (schemas.body) {
      request.body = schemas.body.parse(request.body);
    }

    if (schemas.params) {
      request.params = schemas.params.parse(request.params);
    }

    if (schemas.query) {
      request.query = schemas.query.parse(request.query);
    }

    next();
  };

  