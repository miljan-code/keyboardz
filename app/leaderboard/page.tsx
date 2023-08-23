import { db } from "@/db";
import { sql } from "drizzle-orm";

import { getLeaderboard } from "@/lib/queries";
import { tests } from "@/db/schema";
import {
  LeaderboardHeading,
  type LeaderboardType,
} from "@/components/leaderboard/leaderboard-heading";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";

interface LeaderboardPageProps {
  searchParams: {
    type: LeaderboardType;
  };
}

const getTotalTests = async () => {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(tests);

  return result.count;
};

export default async function LeaderboardPage({
  searchParams,
}: LeaderboardPageProps) {
  const dataTimer60 = await getLeaderboard(60, searchParams.type);
  const dataTimer15 = await getLeaderboard(15, searchParams.type);
  const maxResults = await getTotalTests();

  return (
    <section className="mt-4 space-y-6 px-8">
      <LeaderboardHeading />
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-4">
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="border-b-2 border-foreground/80 font-heading text-lg font-medium text-foreground/80">
              Time 60
            </h4>
          </div>
          <LeaderboardTable
            data={dataTimer60}
            timer={60}
            type={searchParams.type}
            maxResults={maxResults}
          />
        </div>
        <div className="h-[1px] w-full bg-border lg:hidden" />
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="border-b-2 border-foreground/80 font-heading text-lg font-medium text-foreground/80">
              Time 15
            </h4>
          </div>
          <LeaderboardTable
            data={dataTimer15}
            timer={15}
            type={searchParams.type}
            maxResults={maxResults}
          />
        </div>
      </div>
    </section>
  );
}
