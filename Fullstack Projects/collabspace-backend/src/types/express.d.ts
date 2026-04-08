import type { OrganizationMember, Project, Task, User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      currentUser?: Pick<User, "id" | "email" | "name">;
      currentMembership?: OrganizationMember;
      currentProject?: Project;
      currentTask?: Task;
    }
  }
}

export {};
