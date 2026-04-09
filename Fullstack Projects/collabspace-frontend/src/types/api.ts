export type ApiResponse<T> = {
  ResponseStatus: number;
  Message: string;
  Result: T;
};

export type OrganizationRole = "ADMIN" | "MANAGER" | "MEMBER";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
