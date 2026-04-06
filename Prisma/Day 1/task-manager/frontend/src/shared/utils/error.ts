import axios from "axios";

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data?.message;
    if (typeof responseMessage === "string") {
      return responseMessage;
    }

    const validationErrors = error.response?.data?.errors;
    if (validationErrors && typeof validationErrors === "object") {
      const messages = Object.values(validationErrors).flat();
      if (messages.length > 0) {
        return messages.join(", ");
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};
