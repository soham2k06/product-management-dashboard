import { User } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUserInitials = (user: User) => {
  return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
};
