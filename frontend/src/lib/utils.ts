import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const ToastStyles = {
  success: { style: { backgroundColor: "green", color: "white" } },
  error: { style: { backgroundColor: "red", color: "white" } }
} as const