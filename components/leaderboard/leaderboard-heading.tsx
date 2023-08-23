"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const leaderboards = ["All-Time", "Weekly"] as const;

export type LeaderboardType = (typeof leaderboards)[number];

export const LeaderboardHeading = () => {
  const [activeLeaderboard, setActiveLeaderboard] = useState<LeaderboardType>(
    leaderboards[0],
  );

  const router = useRouter();

  return (
    <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
      <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        {activeLeaderboard} Leaderboard
      </h2>
      <div className="flex w-fit items-center gap-1 rounded-md p-0.5">
        {leaderboards.map((current) => (
          <Button
            onClick={() => {
              setActiveLeaderboard(current);
              router.replace(`/leaderboard?type=${current}`);
            }}
            key={current}
            variant="outline"
            size="sm"
            className={cn(
              "transition-colors hover:border hover:border-primary",
              {
                "border border-primary": activeLeaderboard === current,
              },
            )}
          >
            {current}
          </Button>
        ))}
      </div>
    </div>
  );
};
