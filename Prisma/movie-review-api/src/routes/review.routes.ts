import { Router } from "express";
import { reviewController } from "../controllers/review.controller";
import { validate } from "../middleware/validate";
import {
  createReviewSchema,
  criticIdParamSchema,
  idParamSchema,
  movieIdParamSchema,
  updateReviewSchema,
} from "../validation/schemas";

const router = Router();

router.get("/", reviewController.getAll);
router.post("/", validate({ body: createReviewSchema }), reviewController.create);
router.get(
  "/movie/:movieId",
  validate({ params: movieIdParamSchema }),
  reviewController.getByMovie,
);
router.get(
  "/critic/:criticId",
  validate({ params: criticIdParamSchema }),
  reviewController.getByCritic,
);
router.get("/:id", validate({ params: idParamSchema }), reviewController.getById);
router.patch(
  "/:id",
  validate({ params: idParamSchema, body: updateReviewSchema }),
  reviewController.update,
);
router.delete("/:id", validate({ params: idParamSchema }), reviewController.remove);

export default router;
