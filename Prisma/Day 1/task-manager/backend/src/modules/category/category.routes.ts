import { Router } from "express";
import protect from "../../shared/middlewares/auth.middleware";
import { create, getAll, getTasks } from "./category.controller";

const router = Router();

router.use(protect);

router.post("/", create);
router.get("/", getAll);
router.get("/:id/tasks", getTasks);

export default router;
