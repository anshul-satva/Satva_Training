import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/HttpErrors";
import { verifyAuthToken } from "../utils/token";

const protect = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.header("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new UnauthorizedError("No token provided. Access denied"));
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAuthToken(token);
    req.userId = decoded.userId;
    next();
  } catch {
    next(new UnauthorizedError("Invalid or expired token"));
  }
};

export default protect;
