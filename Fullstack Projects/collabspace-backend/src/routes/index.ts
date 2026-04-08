import { Router } from "express";
import activityRoutes from "../modules/activities/activity.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import commentRoutes from "../modules/comments/comment.routes.js";
import organizationRoutes from "../modules/organizations/organization.routes.js";
import projectRoutes from "../modules/projects/project.routes.js";
import tagRoutes from "../modules/tags/tag.routes.js";
import taskRoutes from "../modules/tasks/task.routes.js";

const apiRoutes = Router();

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/organizations", organizationRoutes);
apiRoutes.use("/", projectRoutes);
apiRoutes.use("/", tagRoutes);
apiRoutes.use("/", taskRoutes);
apiRoutes.use("/", commentRoutes);
apiRoutes.use("/", activityRoutes);

export default apiRoutes;
