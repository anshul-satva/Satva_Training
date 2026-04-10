import { Router } from "express";
import { genreController } from "../controllers/genre.controller";
import { validate } from "../middleware/validate";
import {
  createGenreSchema,
  idParamSchema,
  updateGenreSchema,
} from "../validation/schemas";

const router = Router();

router.get("/", genreController.getAll);
router.get(
  "/:id",
  validate({ params: idParamSchema }),
  genreController.getById,
);
router.post("/", validate({ body: createGenreSchema }), genreController.create);
router.patch(
  "/:id",
  validate({ params: idParamSchema, body: updateGenreSchema }),
  genreController.update,
);
router.delete(
  "/:id",
  validate({ params: idParamSchema }),
  genreController.remove,
);

export default router;
