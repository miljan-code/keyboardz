"use client";

import { useEffect, useMemo, useState } from "react";
import { useWpm } from "@/hooks/use-wpm";
import type { User } from "next-auth";
import { useSession } from "next-auth/react";

import { generateFallback } from "@/lib/utils";
import type { Room } from "@/db/schema";
import { useSocket } from "@/components/socket-provider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import type { TestMode, WpmStats } from "@/types/test";

interface MultiplayerResultsProps {
  text: string;
  testMode: TestMode;
  roomId: Room["id"];
}

type Result = {
  user: User;
  wpmStats: WpmStats;
};

export const MultiplayerResults = ({
  text,
  testMode,
  roomId,
}: MultiplayerResultsProps) => {
  const [results, setResults] = useState<Result[]>([]);

  const { wpmStats } = useWpm({ text });
  const { data: session } = useSession();

  const socket = useSocket();

  useEffect(() => {
    if (!session) return;

    socket?.emit("submitResult", {
      roomId,
      testMode: {
        mode: testMode.mode,
        amount: testMode.amount,
      },
      text,
      user: session.user,
      wpmStats,
    });
  }, [socket, roomId, testMode.amount, testMode.mode, text]);

  // Catch results
  useEffect(() => {
    socket?.on("updateResults", (result) => {
      setResults((prev) => [...prev, result]);
    });
  }, [socket]);

  const sortedResults = useMemo(() => {
    const resultsArr = [...results];
    return resultsArr.sort((a, b) => a.wpmStats.wpm - b.wpmStats.wpm);
  }, [results]);

  return (
    <div className="flex w-full flex-col gap-8">
      {sortedResults.map((result) => (
        <div
          key={result.user.id}
          className="flex w-full items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={result.user.image || ""} />
              <AvatarFallback>
                {generateFallback(result.user.name || "NN")}
              </AvatarFallback>
            </Avatar>
            <span className="text-2xl font-medium">{result.user.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <span className="text-foreground/80">WPM</span>
              <h3 className="text-5xl font-semibold text-primary">
                {result.wpmStats.wpm}
              </h3>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-foreground/80">Raw</span>
              <h3 className="text-5xl font-semibold text-primary">
                {result.wpmStats.rawWpm}
              </h3>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-foreground/80">Accuracy</span>
              <h3 className="text-5xl font-semibold text-primary">
                {result.wpmStats.accuracy}%
              </h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
