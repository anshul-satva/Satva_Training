import { OrganizationRole } from "@prisma/client";
import { z } from "zod";

export const organizationParamsSchema = z.object({
  organizationId: z.string().min(1),
});

export const memberParamsSchema = z.object({
  organizationId: z.string().min(1),
  memberId: z.string().min(1),
});

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().max(500).optional(),
});

export const updateOrganizationSchema = createOrganizationSchema;

export const addMemberSchema = z.object({
  email: z.string().trim().email(),
  role: z.nativeEnum(OrganizationRole).optional(),
});

export const updateMemberSchema = z.object({
  role: z.nativeEnum(OrganizationRole),
});
