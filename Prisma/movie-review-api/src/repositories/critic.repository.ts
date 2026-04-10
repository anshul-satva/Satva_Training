import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export const criticRepository = {
  findAll() {
    return prisma.critic.findMany({
      include: { reviews: true },
    });
  },

  findById(id: string) {
    return prisma.critic.findUnique({
      where: { id },
      include: { reviews: { include: { movie: true } } },
    });
  },

  findByEmail(email: string) {
    return prisma.critic.findUnique({ where: { email } });
  },

  create(data: Prisma.CriticCreateInput) {
    return prisma.critic.create({ data });
  },

  update(id: string, data: Prisma.CriticUpdateInput) {
    return prisma.critic.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.critic.delete({ where: { id } });
  },
};
