export interface LeaderbaordCategory {
  mode: "timer" | "words";
  amounts: number[];
}

export const leaderboardCategories: LeaderbaordCategory[] = [
  {
    mode: "timer",
    amounts: [15, 30, 60, 120],
  },
  {
    mode: "words",
    amounts: [10, 25, 50, 100],
  },
];

export const LIMIT_PER_PAGE = 20;
