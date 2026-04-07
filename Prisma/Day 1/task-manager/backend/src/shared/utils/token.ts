import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export interface AuthTokenPayload {
  userId: string;
  name: string;
  email: string;
}

export const signAuthToken = (payload: AuthTokenPayload): string => {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "7d" });
};

export const verifyAuthToken = (token: string): AuthTokenPayload => {
  return jwt.verify(token, ENV.JWT_SECRET) as AuthTokenPayload;
};
