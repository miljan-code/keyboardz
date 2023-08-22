import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

import type { Test } from "@/db/schema";
import { amounts } from "@/config/leaderboard";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return format(date, "dd MMM yyyy");
}

export function getMaxResults(tests: Test[]) {
  return amounts.map((innerAmounts) => {
    return innerAmounts.amounts.map((amount) => {
      const resultsForAmount = tests.filter(
        (result) =>
          result.amount === amount && result.mode === innerAmounts.mode,
      );

      if (resultsForAmount.length === 0) {
        return {
          amount: amount,
          mode: innerAmounts.mode,
        };
      }

      return resultsForAmount.reduce((maxResult, currentResult) => {
        return currentResult.wpm > maxResult.wpm ? currentResult : maxResult;
      });
    });
  });
}

export function daysAgo(days: number) {
  return new Date(new Date().getTime() - days * 86400000);
}
