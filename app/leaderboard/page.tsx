import { db } from "@/db";
import { and, desc, eq, gte, or } from "drizzle-orm";

import { daysAgo } from "@/lib/utils";
import { tests, User, users, type Test } from "@/db/schema";
import {
  LeaderboardHeading,
  type LeaderboardType,
} from "@/components/leaderboard/leaderboard-heading";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";

export type ReturningDataType = {
  test: Test;
  user: User | null;
};

const getLeaderboardData = async (type?: LeaderboardType) => {
  let data: ReturningDataType[] = [];

  if (type === "Daily") {
    data = await db
      .select()
      .from(tests)
      .where(
        and(
          eq(tests.mode, "timer"),
          or(eq(tests.amount, 60), eq(tests.amount, 15)),
          gte(tests.created_at, daysAgo(1)),
        ),
      )
      .orderBy(desc(tests.wpm))
      .leftJoin(users, eq(tests.userId, users.id))
      .limit(10);
  } else {
    data = await db
      .select()
      .from(tests)
      .where(
        and(
          eq(tests.mode, "timer"),
          or(eq(tests.amount, 60), eq(tests.amount, 15)),
        ),
      )
      .orderBy(desc(tests.wpm))
      .leftJoin(users, eq(tests.userId, users.id))
      .limit(10);
  }

  const dataTimer60 = data.filter((result) => result.test.amount === 60);
  const dataTimer15 = data.filter((result) => result.test.amount === 15);

  return { dataTimer60, dataTimer15 };
};

interface LeaderboardPageProps {
  searchParams: {
    type: LeaderboardType;
  };
}

export default async function LeaderboardPage({
  searchParams,
}: LeaderboardPageProps) {
  const data = await getLeaderboardData(searchParams.type);

  return (
    <section className="mt-4 space-y-6">
      <LeaderboardHeading />
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-heading text-lg font-medium">Time 60</h4>
          </div>
          <LeaderboardTable data={data.dataTimer60} />
        </div>
        <div className="h-[1px] w-full bg-border lg:hidden" />
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-heading text-lg font-medium">Time 15</h4>
          </div>
          <LeaderboardTable data={data.dataTimer15} />
        </div>
      </div>
    </section>
  );
}
