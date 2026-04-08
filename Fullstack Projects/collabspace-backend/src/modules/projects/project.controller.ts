import type { Request, Response } from "express";
import { sendResponse } from "../../utils/response.util.js";
import { projectService } from "./project.service.js";

export const listProjects = async (request: Request, response: Response) => {
  const projects = await projectService.listProjects(request.params.organizationId);

  return sendResponse(response, 200, "Projects fetched successfully", projects);
};

export const createProject = async (request: Request, response: Response) => {
  const project = await projectService.createProject({
    organizationId: request.params.organizationId,
    ...request.body,
  });

  return sendResponse(response, 201, "Project created successfully", project);
};

export const getProject = async (request: Request, response: Response) =>
  sendResponse(
    response,
    200,
    "Project fetched successfully",
    projectService.getProject(request.currentProject),
  );

export const updateProject = async (request: Request, response: Response) => {
  const project = await projectService.updateProject(request.params.projectId, request.body);

  return sendResponse(response, 200, "Project updated successfully", project);
};

export const deleteProject = async (request: Request, response: Response) => {
  const project = await projectService.deleteProject(request.params.projectId);

  return sendResponse(response, 200, "Project deleted and tasks archived successfully", project);
};
