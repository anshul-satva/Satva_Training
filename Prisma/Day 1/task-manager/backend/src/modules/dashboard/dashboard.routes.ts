import { Router } from "express";
import protect from "../../shared/middlewares/auth.middleware";
import { getRecent, getSummary } from "./dashboard.controller";

const router = Router();

router.use(protect);

router.get("/summary", getSummary);
router.get("/recent", getRecent);

export default router;
