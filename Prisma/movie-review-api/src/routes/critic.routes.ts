import { criticController } from "@/controllers/critic.controller";
import { Router } from "express";
import { validate } from "../middleware/validate";
import {
  createCriticSchema,
  idParamSchema,
  updateCriticSchema,
} from "../validation/schemas";

const router = Router();

router.get("/", criticController.getAll);
router.get(
  "/:id",
  validate({ params: idParamSchema }),
  criticController.getById,
);
router.post(
  "/",
  validate({ body: createCriticSchema }),
  criticController.create,
);
router.put(
  "/:id",
  validate({ params: idParamSchema, body: updateCriticSchema }),
  criticController.update,
);
router.delete(
  "/:id",
  validate({ params: idParamSchema }),
  criticController.remove,
);

export default router;
