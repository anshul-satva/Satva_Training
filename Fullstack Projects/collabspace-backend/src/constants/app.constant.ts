export enum ResponseStatus {
  Error = 0,
  Success = 1,
  NoContent = 204,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  ValidationError = 422,
}

export const TASK_STATUS_ORDER = [
  "TODO",
  "IN_PROGRESS",
  "DONE",
] as const;
