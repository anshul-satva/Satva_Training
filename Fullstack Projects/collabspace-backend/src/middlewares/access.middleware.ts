import type { OrganizationRole } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { ResponseStatus } from "../constants/app.constant.js";
import { ensureMemberHasRole, findOrganizationMembership } from "../utils/membership.util.js";
import { AppError } from "./error.middleware.js";

export const requireOrganizationAccess =
  (organizationParam = "organizationId") =>
  async (request: Request, _response: Response, next: NextFunction) => {
    const organizationId = request.params[organizationParam];
    const userId = request.currentUser?.id;

    if (!organizationId || !userId) {
      return next(new AppError("Organization access could not be verified", 400));
    }

    const membership = await findOrganizationMembership(organizationId, userId);

    if (!membership) {
      return next(new AppError("You do not have access to this organization", 403, ResponseStatus.Forbidden));
    }

    request.currentMembership = membership;
    next();
  };

export const requireOrganizationRole =
  (roles: OrganizationRole[], organizationParam = "organizationId") =>
  async (request: Request, response: Response, next: NextFunction) => {
    await requireOrganizationAccess(organizationParam)(request, response, async (error?: unknown) => {
      if (error) {
        return next(error);
      }

      const currentRole = request.currentMembership?.role;

      if (!currentRole || !ensureMemberHasRole(currentRole, roles)) {
        return next(
          new AppError(
            "You do not have permission to perform this action",
            403,
            ResponseStatus.Forbidden,
          ),
        );
      }

      next();
    });
  };

export const requireProjectAccess =
  (projectParam = "projectId") =>
  async (request: Request, _response: Response, next: NextFunction) => {
    const projectId = request.params[projectParam];
    const userId = request.currentUser?.id;

    if (!projectId || !userId) {
      return next(new AppError("Project access could not be verified", 400));
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.deletedAt) {
      return next(new AppError("Project not found", 404, ResponseStatus.NotFound));
    }

    const membership = await findOrganizationMembership(project.organizationId, userId);

    if (!membership) {
      return next(new AppError("You do not have access to this project", 403, ResponseStatus.Forbidden));
    }

    request.currentProject = project;
    request.currentMembership = membership;
    next();
  };

export const requireProjectRole =
  (roles: OrganizationRole[], projectParam = "projectId") =>
  async (request: Request, response: Response, next: NextFunction) => {
    await requireProjectAccess(projectParam)(request, response, async (error?: unknown) => {
      if (error) {
        return next(error);
      }

      const currentRole = request.currentMembership?.role;

      if (!currentRole || !ensureMemberHasRole(currentRole, roles)) {
        return next(
          new AppError(
            "You do not have permission to perform this action",
            403,
            ResponseStatus.Forbidden,
          ),
        );
      }

      next();
    });
  };

export const requireTaskAccess =
  (taskParam = "taskId") =>
  async (request: Request, _response: Response, next: NextFunction) => {
    const taskId = request.params[taskParam];
    const userId = request.currentUser?.id;

    if (!taskId || !userId) {
      return next(new AppError("Task access could not be verified", 400));
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: true,
      },
    });

    if (!task || task.archivedAt || task.project.deletedAt) {
      return next(new AppError("Task not found", 404, ResponseStatus.NotFound));
    }

    const membership = await findOrganizationMembership(task.organizationId, userId);

    if (!membership) {
      return next(new AppError("You do not have access to this task", 403, ResponseStatus.Forbidden));
    }

    request.currentTask = task;
    request.currentProject = task.project;
    request.currentMembership = membership;
    next();
  };

export const requireTagRole =
  (roles: OrganizationRole[], tagParam = "tagId") =>
  async (request: Request, _response: Response, next: NextFunction) => {
    const tagId = request.params[tagParam];
    const userId = request.currentUser?.id;

    if (!tagId || !userId) {
      return next(new AppError("Tag access could not be verified", 400));
    }

    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
    });

    if (!tag) {
      return next(new AppError("Tag not found", 404, ResponseStatus.NotFound));
    }

    const membership = await findOrganizationMembership(tag.organizationId, userId);

    if (!membership) {
      return next(new AppError("You do not have access to this tag", 403, ResponseStatus.Forbidden));
    }

    if (!ensureMemberHasRole(membership.role, roles)) {
      return next(
        new AppError(
          "You do not have permission to perform this action",
          403,
          ResponseStatus.Forbidden,
        ),
      );
    }

    request.currentMembership = membership;
    next();
  };
