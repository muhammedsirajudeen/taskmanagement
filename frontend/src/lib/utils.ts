import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const ToastStyles = {
  success: { style: { backgroundColor: "green", color: "white" } },
  error: { style: { backgroundColor: "red", color: "white" } }
} as const

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ""; // Ensure it's accessible in the frontend

export const fetcher = (endpoint: string, options: RequestInit = {}) =>
  fetch(`${BASE_URL}${endpoint}`, {
    credentials: "include",
    ...options,
  }).then(async (res) => {
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Unknown error" }));
      throw new Error(error.message || "Failed to fetch");
    }
    return res.json();
  });

