"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useWpm } from "@/hooks/use-wpm";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useSession } from "next-auth/react";

import { socket } from "@/lib/socket";
import { currentTextAtom } from "@/lib/store";
import { cn, generateFallback } from "@/lib/utils";
import type { MultiplayerScore, Room, User } from "@/db/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const setCurrentText = useSetAtom(currentTextAtom);

  const { data: results, refetch } = useQuery({
    queryKey: [`results-${roomId}`],
    queryFn: async () => {
      const res = await fetch(`/api/result/${roomId}`);
      return (await res.json()) as ScoreWithUser[];
    },
  });

  const { wpmStats } = useWpm({ text });
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    socket.emit("submitResult", {
      roomId,
      testMode: {
        mode: testMode.mode,
        amount: testMode.amount,
      },
      text,
      user: session.user,
      wpmStats,
    });

    setCurrentText("");

    return () => {
      socket.emit("removeResult", {
        roomId,
        userId: session?.user.id || "",
      });
    };
    // eslint-disable-next-line
  }, [socket, roomId, testMode.amount, testMode.mode, text]);

  // Catch results
  useEffect(() => {
    const refetchResults = () => refetch();

    socket.on("updateResults", refetchResults);

    return () => {
      socket.off("updateResults", refetchResults);
    };
  }, [refetch]);

  const sortedResults = useMemo(() => {
    const resultsArr = [...(results || [])];
    return resultsArr.sort((a, b) => b.wpm - a.wpm);
  }, [results]);

  return (
    <div className="scrollbar-sm w-full">
      <Table>
        <TableHeader>
          <TableRow className="text-xs">
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-primary max-sm:text-right">
              WPM
            </TableHead>
            <TableHead className="hidden sm:table-cell">Raw WPM</TableHead>
            <TableHead className="hidden sm:table-cell">Accuracy</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedResults.map((result, index) => (
            <TableRow
              key={result.id}
              className={cn({
                "bg-primary/5": index % 2 === 0,
              })}
            >
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={result.user.image || ""} />
                  <AvatarFallback>
                    {generateFallback(result.user.name || "")}
                  </AvatarFallback>
                </Avatar>
                <Link href={`/profile/${result.user.id}`}>
                  {result.user?.name}
                </Link>
              </TableCell>
              <TableCell className="text-primary max-sm:text-right">
                {result.wpm}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {result.rawWpm}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {result.accuracy}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!sortedResults.length && (
        <div className="flex items-center justify-center py-4">
          <span className="text-sm text-muted-foreground">
            Waiting for results...
          </span>
        </div>
      )}
    </div>
  );
};
