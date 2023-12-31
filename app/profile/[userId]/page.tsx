import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq } from "drizzle-orm";

import { getUserStats } from "@/lib/queries";
import { formatDate, generateFallback } from "@/lib/utils";
import { users, type User } from "@/db/schema";
import { Icons } from "@/components/icons";
import { WpmStatsBox } from "@/components/profile/wpm-stats-box";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface UserPageProps {
  params: { userId: User["id"] };
}

export async function generateMetadata({ params }: UserPageProps) {
  const { userId } = params;

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  return {
    title: user?.name || "Account",
  };
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
    <section className="flex flex-col justify-center space-y-10 px-8 max-md:mt-10">
      <Card className="flex flex-col md:grid md:grid-cols-[1fr_auto]">
        <div className="flex flex-wrap items-center gap-4 border-r px-6 py-4 sm:flex-nowrap">
          <Avatar className="h-16 w-16 sm:h-24 sm:w-24">
            <AvatarImage src={data.user.image || ""} />
            <AvatarFallback>
              {generateFallback(data.user.name || "")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="truncate font-heading text-xl sm:text-3xl">
              {data.user.name}
            </h3>
            <span className="text-xs text-muted-foreground sm:text-sm">
              Joined {formatDate(data.user.createdAt)}
            </span>
            <div className="mt-2 flex items-center gap-2">
              {data.user.github && (
                <a href={`https://github.com/${data.user.github}`}>
                  <Icons.github size={16} />
                </a>
              )}
              {data.user.x && (
                <a href={`https://twitter.com/${data.user.x}`}>
                  <Icons.twitter size={16} />
                </a>
              )}
              {data.user.website && (
                <a href={data.user.website}>
                  <Icons.link size={18} />
                </a>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {data.user.bio && (
              <div className="flex flex-col">
                <span className="text-xs text-foreground/60">Bio:</span>
                <p className="text-sm">{data.user.bio}</p>
              </div>
            )}
            {data.user.keyboard && (
              <div className="flex flex-col">
                <span className="text-xs text-foreground/60">Keyboard:</span>
                <p className="text-sm">{data.user.keyboard}</p>
              </div>
            )}
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
