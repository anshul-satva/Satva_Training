import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export const movieRepository = {
  findAll() {
    return prisma.movie.findMany({
      include: { detail: true, genres: true },
    });
  },

  findById(id: string) {
    return prisma.movie.findUnique({
      where: { id },
      include: {
        detail: true,
        genres: true,
        reviews: { include: { critic: true } },
      },
    });
  },

  create(
    data: Prisma.MovieCreateInput & {
      detail?: { runtimeMinutes: number; language: string; plot: string };
      genreIds?: string[];
      genreNames?: string[];
    }
  ) {
    const { detail, genreIds, genreNames, ...movieData } = data as any;
    return prisma.movie.create({
      data: {
        ...movieData,
        ...(detail && { detail: { create: detail } }),
        ...((genreIds?.length || genreNames?.length) && {
          genres: {
            ...(genreIds?.length && {
              connect: genreIds.map((id: string) => ({ id })),
            }),
            ...(genreNames?.length && {
              connectOrCreate: genreNames.map((name: string) => ({
                where: { name },
                create: { name },
              })),
            }),
          },
        }),
      },
      include: { detail: true, genres: true },
    });
  },

  update(id: string, data: Prisma.MovieUpdateInput) {
    return prisma.movie.update({
      where: { id },
      data,
      include: { detail: true, genres: true },
    });
  },

  // Add genres to a movie (many-to-many connect)
  addGenres(
    movieId: string,
    data: { genreIds?: string[]; genreNames?: string[] },
  ) {
    return prisma.movie.update({
      where: { id: movieId },
      data: {
        genres: {
          ...(data.genreIds?.length && {
            connect: data.genreIds.map((id) => ({ id })),
          }),
          ...(data.genreNames?.length && {
            connectOrCreate: data.genreNames.map((name) => ({
              where: { name },
              create: { name },
            })),
          }),
        },
      },
      include: { genres: true },
    });
  },

  // Remove a genre from a movie (many-to-many disconnect)
  removeGenre(movieId: string, genreId: string) {
    return prisma.movie.update({
      where: { id: movieId },
      data: { genres: { disconnect: { id: genreId } } },
      include: { genres: true },
    });
  },

  delete(id: string) {
    return prisma.movie.delete({ where: { id } });
  },
};
