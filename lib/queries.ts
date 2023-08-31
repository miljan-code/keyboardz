import { db } from "@/db";
import { and, desc, eq, gte } from "drizzle-orm";

import { daysAgo } from "@/lib/utils";
import { rooms, tests, users, type Test, type User } from "@/db/schema";
import {
  leaderboardCategories,
  LIMIT_PER_PAGE,
  type LeaderboardCategory,
} from "@/config/leaderboard";
import { leaderboards } from "@/components/leaderboard/leaderboard-heading";

export async function getLeaderboard(
  time: number,
  type: (typeof leaderboards)[number] = "All-Time",
  limit: number = LIMIT_PER_PAGE,
  offset: number = 0,
) {
  const isWeekly = type === "Weekly";

  const data = await db
    .select()
    .from(tests)
    .where(
      and(
        eq(tests.mode, "timer"),
        eq(tests.amount, time),
        gte(tests.createdAt, daysAgo(isWeekly ? 7 : -1)),
      ),
    )
    .orderBy(desc(tests.wpm))
    .leftJoin(users, eq(tests.userId, users.id))
    .limit(limit)
    .offset(offset);

  return data.map((result) => ({
    user: result.user
      ? {
          ...result.user,
          createdAt: result.user.createdAt.toString(),
          updatedAt: result.user.updatedAt.toString(),
        }
      : null,
    test: {
      ...result.test,
      createdAt: result.test.createdAt.toString(),
    },
  }));
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

  const bestScore = leaderboardData[leaderboardRank]?.wpm || 0;

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

export async function getOpenRooms() {
  return await db.query.rooms.findMany({
    where: and(eq(rooms.isActiveRoom, true), eq(rooms.isPublicRoom, true)),
    with: {
      creator: true,
      participants: {
        with: {
          user: true,
        },
      },
    },
  });
}

export const getRoomById = async (roomId: string) => {
  return await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
    with: {
      creator: true,
      participants: {
        with: {
          user: true,
        },
      },
    },
  });
};

function getMaxResultsForCategories(
  tests: Test[],
  categories: LeaderboardCategory[],
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
