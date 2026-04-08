import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.js";
import apiRoutes from "./routes/index.js";
import { sendResponse } from "./utils/response.util.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_request, response) =>
  sendResponse(response, 200, "Server is healthy", {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }),
);

app.use("/api", apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
