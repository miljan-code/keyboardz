import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return format(date, "dd MMM yyyy");
}

export function daysAgo(days: number) {
  if (days < 0) return new Date(0);
  else return new Date(new Date().getTime() - days * 86400000);
}
