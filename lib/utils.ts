import { clsx, type ClassValue } from "clsx";
import { useRouter } from "next/dist/client/components/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
