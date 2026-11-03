import type { AxiosError } from "axios";
import type { ApiResponse } from "@/types/api";

export function extract_message(error: AxiosError<ApiResponse> | any): string {
  if (!error) return "An unexpected error occurred.";
  if (typeof error === "string") return error;

  const data = error?.response?.data;
  if (data?.message && typeof data.message === "string") {
    return data.message;
  }

  if (data?.error && typeof data.error === "string") {
    return data.error;
  }

  if (data?.errors) {
    if (typeof data.errors === "string") return data.errors;
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return String(data.errors[0]);
    }
    if (typeof data.errors === "object") {
      const firstVal = Object.values(data.errors)[0];
      if (Array.isArray(firstVal) && firstVal.length > 0) {
        return String(firstVal[0]);
      }
      if (firstVal && typeof firstVal === "string") {
        return firstVal;
      }
    }
  }

  if (error?.message && typeof error.message === "string") {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export function getLocalToken(key: string = "igbo_token"): string | null {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem(key);
  }
  return null;
}
