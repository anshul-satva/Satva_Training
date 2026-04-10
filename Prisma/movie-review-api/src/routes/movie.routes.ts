import { Router } from "express";
import { movieController } from "../controllers/movie.controller";
import { validate } from "../middleware/validate";
import {
  addMovieGenresSchema,
  createMovieSchema,
  idParamSchema,
  movieGenreParamsSchema,
  updateMovieSchema,
} from "../validation/schemas";

const router = Router();

router.get("/", movieController.getAll);
router.post("/", validate({ body: createMovieSchema }), movieController.create);
router.get(
  "/:id",
  validate({ params: idParamSchema }),
  movieController.getById,
);
router.patch(
  "/:id",
  validate({ params: idParamSchema, body: updateMovieSchema }),
  movieController.update,
);
router.post(
  "/:id/genres",
  validate({ params: idParamSchema, body: addMovieGenresSchema }),
  movieController.addGenres,
);
router.delete(
  "/:id/genres/:genreId",
  validate({ params: movieGenreParamsSchema }),
  movieController.removeGenre,
);
router.delete(
  "/:id",
  validate({ params: idParamSchema }),
  movieController.remove,
);

export default router;
