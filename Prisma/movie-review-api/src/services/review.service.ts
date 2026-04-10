import { reviewRepository } from "../repositories/review.repository";

export const reviewService = {
  async getAllReviews() {
    return reviewRepository.findAll();
  },

  async getReviewById(id: string) {
    const review = await reviewRepository.findById(id);
    if (!review) throw new Error("Review not found");
    return review;
  },

  async getReviewsByMovie(movieId: string) {
    return reviewRepository.findByMovie(movieId);
  },

  async getReviewsByCritic(criticId: string) {
    return reviewRepository.findByCritic(criticId);
  },

  async createReview(data: {
    rating: number;
    content: string;
    criticId: string;
    movieId: string;
  }) {
    if (data.rating < 1 || data.rating > 10)
      throw new Error("Rating must be between 1 and 10");
    return reviewRepository.create({
      rating: data.rating,
      content: data.content,
      critic: { connect: { id: data.criticId } },
      movie: { connect: { id: data.movieId } },
    });
  },

  async updateReview(id: string, data: { rating?: number; content?: string }) {
    if (
      data.rating !== undefined &&
      (data.rating < 1 || data.rating > 10)
    )
      throw new Error("Rating must be between 1 and 10");
    await reviewService.getReviewById(id);
    return reviewRepository.update(id, data);
  },

  async deleteReview(id: string) {
    await reviewService.getReviewById(id);
    return reviewRepository.delete(id);
  },
};
