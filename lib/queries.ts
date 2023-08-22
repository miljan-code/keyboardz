import { db } from "@/db";
import { and, desc, eq, gte } from "drizzle-orm";

import { daysAgo } from "@/lib/utils";
import { tests, users, type Test, type User } from "@/db/schema";
import {
  LeaderbaordCategory,
  leaderboardCategories,
} from "@/config/leaderboard";

export async function getAllTimeLeaderboard(time: number, limit: number = 20) {
  return await db
    .select()
    .from(tests)
    .where(and(eq(tests.mode, "timer"), eq(tests.amount, time)))
    .orderBy(desc(tests.wpm))
    .leftJoin(users, eq(tests.userId, users.id))
    .limit(limit);
}

export async function getWeeklyLeaderboard(time: number, limit: number = 20) {
  return await db
    .select()
    .from(tests)
    .where(
      and(
        eq(tests.mode, "timer"),
        eq(tests.amount, time),
        gte(tests.created_at, daysAgo(7)),
      ),
    )
    .orderBy(desc(tests.wpm))
    .leftJoin(users, eq(tests.userId, users.id))
    .limit(limit);
}

export async function getUserStats(userId: User["id"]) {
  const userDataAndTests = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      tests: true,
    },
  });

  if (!userDataAndTests) return null;

  const leaderboardData = await db
    .select()
    .from(tests)
    .where(and(eq(tests.mode, "timer"), eq(tests.amount, 60)))
    .orderBy(desc(tests.wpm));

  const leaderboardRank = leaderboardData.findIndex(
    (result) => result.userId === userId,
  );

  const bestScore = leaderboardData[leaderboardRank].wpm;

  const [timerScores, wordScores] = getMaxResultsForCategories(
    userDataAndTests.tests,
    leaderboardCategories,
  );

  return {
    user: userDataAndTests,
    rank: leaderboardRank + 1,
    bestScore,
    timerScores,
    wordScores,
  };
}

function getMaxResultsForCategories(
  tests: Test[],
  categories: LeaderbaordCategory[],
) {
  return categories.map((category) => {
    return category.amounts.map((amount) => {
      const resultsForAmount = tests.filter(
        (result) => result.amount === amount && result.mode === category.mode,
      );

      if (resultsForAmount.length === 0) {
        return {
          amount: amount,
          mode: category.mode,
        };
      }

      return resultsForAmount.reduce((maxResult, currentResult) => {
        return currentResult.wpm > maxResult.wpm ? currentResult : maxResult;
      });
    });
  });
}
