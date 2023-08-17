import type { ReturningDataType } from "@/app/leaderboard/page";
import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
          <TableHead>WPM</TableHead>
          <TableHead>Raw WPM</TableHead>
          <TableHead>Accuracy</TableHead>
          <TableHead className="text-right">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={row.test.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{row.user?.name}</TableCell>
            <TableCell>{row.test.wpm}</TableCell>
            <TableCell>{row.test.rawWpm}</TableCell>
            <TableCell>{row.test.accuracy}%</TableCell>
            <TableCell className="text-right">
              {format(row.test.created_at, "dd. MMM yyyy")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
