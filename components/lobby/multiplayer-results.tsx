"use client";

import { useEffect, useMemo } from "react";
import { useWpm } from "@/hooks/use-wpm";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { generateFallback } from "@/lib/utils";
import type { MultiplayerScore, Room, User } from "@/db/schema";
import { useSocket } from "@/components/socket-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { TestMode } from "@/types/test";

interface MultiplayerResultsProps {
  text: string;
  testMode: TestMode;
  roomId: Room["id"];
}

interface ScoreWithUser extends MultiplayerScore {
  user: User;
}

export const MultiplayerResults = ({
  text,
  testMode,
  roomId,
}: MultiplayerResultsProps) => {
  const { data: results, refetch } = useQuery({
    queryKey: [`results-${roomId}`],
    queryFn: async () => {
      const res = await fetch(`/api/result/${roomId}`);
      return (await res.json()) as ScoreWithUser[];
    },
  });

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
    // eslint-disable-next-line
  }, [socket, roomId, testMode.amount, testMode.mode, text]);

  // Catch results
  useEffect(() => {
    socket?.on("updateResults", () => refetch());
  }, [socket, refetch]);

  const sortedResults = useMemo(() => {
    const resultsArr = [...(results || [])];
    return resultsArr.sort((a, b) => b.wpm - a.wpm);
  }, [results]);

  return (
    <div className="flex w-full flex-col gap-4">
      {sortedResults.map((result, index) => (
        <div
          key={result.user.id}
          className="flex h-24 w-full items-center justify-between rounded-md bg-foreground/5"
        >
          <div className="flex h-full items-center gap-4">
            <div className="flex h-full w-14 items-center justify-center border-r-2 border-background">
              <span className="text-3xl font-medium">{index + 1}.</span>
            </div>
            <Avatar className="h-16 w-16">
              <AvatarImage src={result.user.image || ""} />
              <AvatarFallback>
                {generateFallback(result.user.name || "NN")}
              </AvatarFallback>
            </Avatar>
            <span className="text-2xl font-medium">{result.user.name}</span>
          </div>
          <div className="flex h-full items-center [&>*]:flex [&>*]:h-full [&>*]:w-28 [&>*]:flex-col [&>*]:items-center [&>*]:justify-center [&>*]:gap-1 [&>*]:border-l-2 [&>*]:border-background">
            <div>
              <span className="text-foreground/80">WPM</span>
              <h3 className="text-5xl font-semibold text-primary">
                {result.wpm}
              </h3>
            </div>
            <div>
              <span className="text-foreground/80">Raw</span>
              <h3 className="text-5xl font-semibold text-primary">
                {result.rawWpm}
              </h3>
            </div>
            <div>
              <span className="text-foreground/80">Accuracy</span>
              <h3 className="text-5xl font-semibold text-primary">
                {result.accuracy}
              </h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
