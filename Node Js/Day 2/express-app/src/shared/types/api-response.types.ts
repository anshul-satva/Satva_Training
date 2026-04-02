export enum ResponseStatus {
  Error = 0,
  Success = 1,
}

export interface ApiResponse<T> {
  responseStatus: ResponseStatus;
  message: string;
  result: T | null;
}
