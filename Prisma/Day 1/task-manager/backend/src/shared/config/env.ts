import dotenv from "dotenv";

dotenv.config();

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const ENV = {
  PORT: Number(process.env.PORT || 5000),
  JWT_SECRET: getRequiredEnv("JWT_SECRET"),
  DATABASE_URL: getRequiredEnv("DATABASE_URL"),
  NODE_ENV: process.env.NODE_ENV || "development",
};
