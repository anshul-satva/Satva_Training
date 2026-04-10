import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export const reviewRepository = {
  findAll() {
    return prisma.review.findMany({
      include: { critic: true, movie: true },
    });
  },

  findById(id: string) {
    return prisma.review.findUnique({
      where: { id },
      include: { critic: true, movie: true },
    });
  },

  findByMovie(movieId: string) {
    return prisma.review.findMany({
      where: { movieId },
      include: { critic: true },
    });
  },

  findByCritic(criticId: string) {
    return prisma.review.findMany({
      where: { criticId },
      include: { movie: true },
    });
  },

  create(data: Prisma.ReviewCreateInput) {
    return prisma.review.create({
      data,
      include: { critic: true, movie: true },
    });
  },

  update(id: string, data: Prisma.ReviewUpdateInput) {
    return prisma.review.update({
      where: { id },
      data,
      include: { critic: true, movie: true },
    });
  },

  delete(id: string) {
    return prisma.review.delete({ where: { id } });
  },
};
