import { Request, Response } from "express";
import { reviewService } from "../services/review.service";

export const reviewController = {
  async getAll(_req: Request, res: Response) {
    try {
      res.json(await reviewService.getAllReviews());
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      res.json(await reviewService.getReviewById(req.params.id as string));
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  },

  async getByMovie(req: Request, res: Response) {
    try {
      res.json(
        await reviewService.getReviewsByMovie(req.params.movieId as string),
      );
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getByCritic(req: Request, res: Response) {
    try {
      res.json(
        await reviewService.getReviewsByCritic(req.params.criticId as string),
      );
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const review = await reviewService.createReview(req.body);
      res.status(201).json(review);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      res.json(
        await reviewService.updateReview(req.params.id as string, req.body),
      );
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      await reviewService.deleteReview(req.params.id as string);
      res.json({ message: "Review deleted" });
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  },
};
