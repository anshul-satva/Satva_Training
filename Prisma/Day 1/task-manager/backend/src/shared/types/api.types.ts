export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
}
