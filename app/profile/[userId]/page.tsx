import { redirect } from "next/navigation";
import { db } from "@/db";

import { getUserStats } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { users, type User } from "@/db/schema";
import { WpmStatsBox } from "@/components/profile/wpm-stats-box";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface UserPageProps {
  params: { userId: User["id"] };
}

export const generateStaticParams = async () => {
  const usersArr = await db.select().from(users).limit(100);

  return usersArr.map((user) => ({
    userId: user.id,
  }));
};

export default async function UserPage({ params }: UserPageProps) {
  const { userId } = params;

  const data = await getUserStats(userId);

  if (!data) redirect("/");

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
    </section>
  );
}
