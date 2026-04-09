import { OrganizationRole } from "@prisma/client";
import { prisma } from "../../config/prisma.js";

export const authRepository = {
  findUserByEmail(email: string) {
    return prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
      include: {
        organizationMembers: {
          include: {
            organization: true,
          },
        },
      },
    });
  },

  findUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        organizationMembers: {
          include: {
            organization: true,
          },
        },
      },
    });
  },

  createUser(data: {
    email: string;
    name?: string;
    passwordHash: string;
    organizationName?: string;
  }) {
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash,
        organizationMembers: data.organizationName
          ? {
              create: {
                role: OrganizationRole.ADMIN,
                organization: {
                  create: {
                    name: data.organizationName,
                  },
                },
              },
            }
          : undefined,
      },
      include: {
        organizationMembers: {
          include: {
            organization: true,
          },
        },
      },
    });
  },
};
