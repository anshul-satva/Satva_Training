import { OrganizationRole } from "@prisma/client";
import { Router } from "express";
import {
  requireOrganizationAccess,
  requireOrganizationRole,
  requireProjectAccess,
  requireProjectRole,
} from "../../middlewares/access.middleware.js";

import { validateRequest } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.util.js";
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
} from "./project.controller.js";
import {
  createProjectSchema,
  organizationProjectParamsSchema,
  projectParamsSchema,
  updateProjectSchema,
} from "./project.schema.js";

const projectRoutes = Router();



projectRoutes.get(
  "/organizations/:organizationId/projects",
  validateRequest({ params: organizationProjectParamsSchema }),
  asyncHandler(requireOrganizationAccess()),
  asyncHandler(listProjects),
);

projectRoutes.post(
  "/organizations/:organizationId/projects",
  validateRequest({
    params: organizationProjectParamsSchema,
    body: createProjectSchema,
  }),
  asyncHandler(
    requireOrganizationRole([OrganizationRole.ADMIN, OrganizationRole.MANAGER]),
  ),
  asyncHandler(createProject),
);

projectRoutes.get(
  "/projects/:projectId",
  validateRequest({ params: projectParamsSchema }),
  asyncHandler(requireProjectAccess()),
  asyncHandler(getProject),
);

projectRoutes.patch(
  "/projects/:projectId",
  validateRequest({ params: projectParamsSchema, body: updateProjectSchema }),
  asyncHandler(
    requireProjectRole([OrganizationRole.ADMIN, OrganizationRole.MANAGER]),
  ),
  asyncHandler(updateProject),
);

projectRoutes.delete(
  "/projects/:projectId",
  validateRequest({ params: projectParamsSchema }),
  asyncHandler(
    requireProjectRole([OrganizationRole.ADMIN, OrganizationRole.MANAGER]),
  ),
  asyncHandler(deleteProject),
);

export default projectRoutes;
