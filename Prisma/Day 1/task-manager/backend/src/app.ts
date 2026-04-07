import express from "express";
import cors from "cors";
import path from "path";
import apiRouter from "./api";
import { errorHandler } from "./shared/middlewares/errorHandler.middleware";
import { requestLogger } from "./shared/middlewares/requestLogger.middleware";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(requestLogger);

app.use("/api", apiRouter);

app.get("/", (_req, res) => {
  res.json({ status: "OK", message: "API is running" });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;
