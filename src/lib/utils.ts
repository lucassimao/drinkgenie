import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const MAX_INGREDIENTS = 4;
export const DEFAULT_PAGE_SIZE = 12;

const devUrl = process.env.REPLIT_DOMAINS
  ? "https://" + process.env.REPLIT_DOMAINS
  : "http://localhost:3000";

export const BASE_URL =
  process.env.NODE_ENV == "development" ? devUrl : "https://www.drinkgenie.app";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
