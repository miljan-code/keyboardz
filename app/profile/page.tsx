import { redirect } from "next/navigation";
import { db } from "@/db";
import { and, desc, eq } from "drizzle-orm";

import { getSession } from "@/lib/auth";
import { formatDate, getMaxResults } from "@/lib/utils";
import { tests, users } from "@/db/schema";
import { CopyLinkButton } from "@/components/profile/copy-link-button";
import { EditProfile } from "@/components/profile/edit-profile";
import { Wpm30dayChart } from "@/components/profile/wpm-30day-chart";
import { WpmStatsBox } from "@/components/profile/wpm-stats-box";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

const getProfilePageData = async () => {
  const session = await getSession();

  if (!session) return null;

  const userDataAndTests = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
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
    (result) => result.userId === session.user.id,
  );

  const bestScore = leaderboardData[leaderboardRank].wpm;

  const [timerScores, wordScores] = getMaxResults(userDataAndTests.tests);

  return {
    user: userDataAndTests,
    rank: leaderboardRank + 1,
    bestScore,
    timerScores,
    wordScores,
  };
};

export default async function ProfilePage() {
  const data = await getProfilePageData();

  if (!data) return redirect("/");

  return (
    <section className="flex flex-col justify-center space-y-10 max-md:mt-10">
      <Card className="flex flex-col md:grid md:grid-cols-[1fr_auto]">
        <div className="flex items-center gap-4 border-r px-6 py-4">
          <Avatar className="h-15 w-15">
            <AvatarImage src={data.user.image || ""} />
          </Avatar>
          <div className="flex flex-col">
            <h3 className="font-heading text-3xl">{data.user.name}</h3>
            <span className="text-sm text-muted-foreground">
              Joined {formatDate(data.user.created_at)}
            </span>
          </div>
          <div className="ml-auto flex flex-col gap-2">
            <EditProfile />
            <CopyLinkButton userId={data.user.id} />
          </div>
        </div>
        <div className="flex w-full justify-between sm:max-md:px-4">
          <div className="flex flex-col items-center justify-center max-md:p-4 md:border-r md:max-lg:px-6 lg:w-40">
            <span className="text-sm sm:text-base">WPM</span>
            <span className="text-4xl font-bold text-primary sm:text-6xl">
              {data.bestScore}
            </span>
            <span className="text-xs text-muted-foreground">best score</span>
          </div>
          <div className="flex flex-col items-center justify-center max-md:p-4 md:border-r md:max-lg:px-6 lg:w-40">
            <span className="text-sm sm:text-base">Tests</span>
            <span className="text-4xl font-bold text-primary sm:text-6xl">
              {data.user.tests.length}
            </span>
            <span className="text-xs text-muted-foreground">completed</span>
          </div>
          <div className="flex flex-col items-center justify-center max-md:p-4 md:max-lg:px-6 lg:w-40">
            <span className="text-sm sm:text-base">Rank</span>
            <span className="text-4xl font-bold text-primary sm:text-6xl">
              {data.rank}
            </span>
            <span className="text-xs text-muted-foreground">
              on leaderboard
            </span>
          </div>
        </div>
      </Card>
      <div className="flex flex-col gap-10 md:flex-row md:gap-6">
        <WpmStatsBox data={data.timerScores} />
        <WpmStatsBox data={data.wordScores} />
      </div>
      <Wpm30dayChart />
    </section>
  );
}
