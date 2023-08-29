"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";

import { cn, formatDate, generateFallback } from "@/lib/utils";
import type { Test, User } from "@/db/schema";
import { LIMIT_PER_PAGE } from "@/config/leaderboard";
import type { LeaderboardType } from "@/components/leaderboard/leaderboard-heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TestWithUser = {
  test: Omit<Test, "createdAt"> & {
    createdAt: string;
  };
  user:
    | (Omit<User, "createdAt" | "updatedAt"> & {
        createdAt: string;
        updatedAt: string;
      })
    | null;
};

interface LeaderboardTableProps {
  data: TestWithUser[];
  timer: number;
  type: LeaderboardType;
  maxResults: number;
}

export const LeaderboardTable = ({
  data: initialData,
  timer,
  type,
  maxResults,
}: LeaderboardTableProps) => {
  const searchParams = useSearchParams();
  const leaderboardType = searchParams?.get("type");

  const containerRef = useRef<HTMLDivElement>(null);

  const fetchResults = async ({ pageParam = 1 }) => {
    const res = await fetch(
      `/api/leaderboard?type=${type}&time=${timer}&page=${pageParam}`,
      { cache: "no-store" },
    );

    return (await res.json()) as TestWithUser[];
  };

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: [`${type}-${timer}`],
      queryFn: fetchResults,
      getNextPageParam: (_, pages) => {
        if (maxResults > LIMIT_PER_PAGE * pages.length) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
      initialData: { pages: [initialData], pageParams: [1] },
      refetchOnMount: false,
      refetchOnReconnect: false,
    });

  const results = data?.pages.flatMap((page) => page) ?? initialData;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const isScrolled =
      e.currentTarget.scrollHeight -
        e.currentTarget.clientHeight -
        e.currentTarget.scrollTop <=
      10;

    if (isScrolled && hasNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    const element = containerRef.current;

    if (!element) return;

    element.scrollTo(0, 0);
  }, [leaderboardType]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="scrollbar-sm max-h-80 w-full overflow-y-auto lg:max-h-[620px]"
    >
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
            <TableHead className="hidden text-right sm:table-cell">
              Date
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((row, index) => (
            <TableRow
              key={`${row.test.id}-${index}`}
              className={cn({
                "bg-primary/5": index % 2 === 0,
              })}
            >
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={row.user?.image || ""} />
                  <AvatarFallback>
                    {generateFallback(row.user?.name || "")}
                  </AvatarFallback>
                </Avatar>
                <Link href={`/profile/${row.user?.id}`}>{row.user?.name}</Link>
              </TableCell>
              <TableCell className="text-primary max-sm:text-right">
                {row.test.wpm}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {row.test.rawWpm}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {row.test.accuracy}%
              </TableCell>
              <TableCell className="hidden text-right text-foreground/80 sm:table-cell">
                {formatDate(new Date(row.test.createdAt))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-4">
          <span className="text-sm text-muted-foreground">Loading more...</span>
        </div>
      )}
      {!results.length && (
        <div className="flex items-center justify-center py-4">
          <span className="text-sm text-muted-foreground">
            Currently we don&apos;t have any data for this leaderboard
          </span>
        </div>
      )}
    </div>
  );
};
