import { projectRepository } from "./project.repository.js";

export const projectService = {
  listProjects(organizationId: string) {
    return projectRepository.findProjectsByOrganization(organizationId);
  },

  createProject(payload: {
    organizationId: string;
    name?: string;
    description?: string;
  }) {
    return projectRepository.createProject(payload);
  },

  getProject(project: unknown) {
    return project;
  },

  updateProject(projectId: string, data: { name?: string; description?: string }) {
    return projectRepository.updateProject(projectId, data);
  },

  deleteProject(projectId: string) {
    return projectRepository.archiveProjectAndTasks(projectId);
  },
};
