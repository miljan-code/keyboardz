"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

const leaderboards = ["All-Time", "Daily"] as const;

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
      <div className="flex items-center gap-2">
        {leaderboards.map((current) => (
          <Button
            onClick={() => {
              setActiveLeaderboard(current);
              router.replace(`/leaderboard?type=${current}`);
            }}
            key={current}
            variant={current === activeLeaderboard ? "default" : "outline"}
            size="sm"
          >
            {current}
          </Button>
        ))}
      </div>
    </div>
  );
};
