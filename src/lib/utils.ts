import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const MAX_INGREDIENTS = 4;

export const BASE_URL =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3000"
    : "https://drinkgenie.app";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
