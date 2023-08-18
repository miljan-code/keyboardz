import Link from "next/link";
import type { ReturningDataType } from "@/app/leaderboard/page";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";

interface LeaderboardTableProps {
  data: ReturningDataType[];
}

export const LeaderboardTable = ({ data }: LeaderboardTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="text-xs">
          <TableHead>#</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="max-sm:text-right">WPM</TableHead>
          <TableHead className="hidden sm:table-cell">Raw WPM</TableHead>
          <TableHead className="hidden sm:table-cell">Accuracy</TableHead>
          <TableHead className="hidden text-right sm:table-cell">
            Date
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow
            key={row.test.id}
            className={cn({
              "bg-dark-tremor-background-muted": index % 2 === 0,
            })}
          >
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={row.user?.image || ""} />
              </Avatar>
              <Link href={`/profile/${row.user?.id}`}>{row.user?.name}</Link>
            </TableCell>
            <TableCell className="max-sm:text-right">{row.test.wpm}</TableCell>
            <TableCell className="hidden sm:table-cell">
              {row.test.rawWpm}
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              {row.test.accuracy}%
            </TableCell>
            <TableCell className="hidden text-right sm:table-cell">
              {format(row.test.created_at, "dd. MMM yyyy")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
