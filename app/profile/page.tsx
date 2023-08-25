import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { getUserStats } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { CopyLinkButton } from "@/components/profile/copy-link-button";
import { EditProfile } from "@/components/profile/edit-profile";
import { Wpm30dayChart } from "@/components/profile/wpm-30day-chart";
import { WpmStatsBox } from "@/components/profile/wpm-stats-box";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Profile",
};

const getCurrentUserStats = async () => {
  const session = await getSession();

  if (!session) return null;

  return await getUserStats(session.user.id);
};

export default async function ProfilePage() {
  const data = await getCurrentUserStats();

  if (!data) return redirect("/");

  return (
    <section className="flex flex-col justify-center space-y-10 px-8 max-md:mt-10">
      <Card className="flex flex-col md:grid md:grid-cols-[1fr_auto]">
        <div className="flex flex-wrap items-center gap-4 border-r px-6 py-4 md:flex-nowrap">
          <Avatar className="h-16 w-16 sm:h-24 sm:w-24">
            <AvatarImage src={data.user.image || ""} />
          </Avatar>
          <div className="flex flex-col">
            <h3 className="truncate font-heading text-2xl sm:text-3xl">
              {data.user.name}
            </h3>
            <span className="text-sm text-muted-foreground">
              Joined {formatDate(data.user.createdAt)}
            </span>
          </div>
          <div className="flex gap-2 md:ml-auto md:flex-col">
            <EditProfile user={data.user} />
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
