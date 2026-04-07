import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import categoryRoutes from "../modules/category/category.routes";
import dashboardRoutes from "../modules/dashboard/dashboard.routes";
import tagRoutes from "../modules/tag/tag.routes";
import taskRoutes from "../modules/task/task.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/categories", categoryRoutes);
apiRouter.use("/dashboard", dashboardRoutes);
apiRouter.use("/tags", tagRoutes);
apiRouter.use("/tasks", taskRoutes);

export default apiRouter;
