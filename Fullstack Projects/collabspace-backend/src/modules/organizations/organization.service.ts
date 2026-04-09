import { OrganizationRole } from "@prisma/client";
import { AppError } from "../../middlewares/error.middleware.js";
import { hashPassword } from "../../utils/bcrypt.util.js";
import { organizationRepository } from "./organization.repository.js";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const organizationService = {
  listOrganizations(userId: string) {
    return organizationRepository.findOrganizationsByUser(userId);
  },

  createOrganization(payload: {
    userId: string;
    name?: string;
    description?: string;
  }) {
    return organizationRepository.createOrganization(payload);
  },

  getOrganization(organizationId: string) {
    return organizationRepository.findOrganizationById(organizationId);
  },

  updateOrganization(organizationId: string, data: { name?: string; description?: string }) {
    return organizationRepository.updateOrganization(organizationId, data);
  },

  listMembers(organizationId: string) {
    return organizationRepository.findMembers(organizationId);
  },

  async addMember(payload: {
    organizationId: string;
    name?: string;
    email: string;
    password?: string;
    role?: OrganizationRole;
  }) {
    const normalizedEmail = normalizeEmail(payload.email);
    let user = await organizationRepository.findUserByEmail(normalizedEmail);

    if (!user) {
      if (!payload.password) {
        throw new AppError("Password is required when registering a new organization user", 400);
      }

      const passwordHash = await hashPassword(payload.password);
      user = await organizationRepository.createUser({
        email: normalizedEmail,
        name: payload.name,
        passwordHash,
      });
    }

    return organizationRepository.upsertMember({
      organizationId: payload.organizationId,
      userId: user.id,
      role: payload.role,
    });
  },

  async updateMemberRole(payload: {
    organizationId: string;
    memberId: string;
    role: OrganizationRole;
  }) {
    const existingMember = await organizationRepository.findMemberById(payload.memberId);

    if (!existingMember || existingMember.organizationId !== payload.organizationId) {
      throw new AppError("Member not found", 404);
    }

    return organizationRepository.updateMemberRole(payload.memberId, payload.role);
  },

  async removeMember(payload: { organizationId: string; memberId: string }) {
    const existingMember = await organizationRepository.findMemberById(payload.memberId);

    if (!existingMember || existingMember.organizationId !== payload.organizationId) {
      throw new AppError("Member not found", 404);
    }

    await organizationRepository.deleteMember(payload.memberId);
    return null;
  },
};
