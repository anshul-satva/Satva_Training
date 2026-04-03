import express, { Application } from "express";
import { errorHandler } from "./middleware/error-handler.js";
import { logger } from "./middleware/logger.js";
import taskRouter from "./modules/task/task.route.js";

const app: Application = express();

const PORT: number = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(logger);
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.status(200).json({ message: "my-ts-api is running from TypeScript" });
});

app.use("/api/tasks", taskRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
