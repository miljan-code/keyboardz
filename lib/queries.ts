import { db } from "@/db";
import { and, desc, eq, gte } from "drizzle-orm";

import { daysAgo } from "@/lib/utils";
import { tests, users } from "@/db/schema";

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
