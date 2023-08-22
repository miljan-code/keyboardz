import { getAllTimeLeaderboard, getWeeklyLeaderboard } from "@/lib/queries";
import { User, type Test } from "@/db/schema";
import {
  LeaderboardHeading,
  type LeaderboardType,
} from "@/components/leaderboard/leaderboard-heading";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";

export type TestWithUser = {
  test: Test;
  user: User | null;
};

const getLeaderboardData = async (type?: LeaderboardType) => {
  let dataTimer60,
    dataTimer15: TestWithUser[] = [];

  if (type === "Weekly") {
    dataTimer60 = await getWeeklyLeaderboard(60);
    dataTimer15 = await getWeeklyLeaderboard(15);
  } else {
    dataTimer60 = await getAllTimeLeaderboard(60);
    dataTimer15 = await getAllTimeLeaderboard(15);
  }

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
