import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export const genreRepository = {
  findAll() {
    return prisma.genre.findMany({
      include: { movies: true },
      orderBy: { name: "asc" },
    });
  },

  findById(id: string) {
    return prisma.genre.findUnique({
      where: { id },
      include: { movies: true },
    });
  },

  findByName(name: string) {
    return prisma.genre.findUnique({
      where: { name },
    });
  },

  create(data: Prisma.GenreCreateInput) {
    return prisma.genre.create({
      data,
      include: { movies: true },
    });
  },

  update(id: string, data: Prisma.GenreUpdateInput) {
    return prisma.genre.update({
      where: { id },
      data,
      include: { movies: true },
    });
  },

  delete(id: string) {
    return prisma.genre.delete({
      where: { id },
    });
  },
};
