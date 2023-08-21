import { db } from "@/db";
import { Grid, LineChart } from "@tremor/react";
import { format } from "date-fns";
import { and, eq, gte } from "drizzle-orm";

import { getSession } from "@/lib/auth";
import { daysAgo } from "@/lib/utils";
import { tests } from "@/db/schema";

const get30DayWpmAverage = async () => {
  const session = await getSession();

  if (!session) return null;

  const results = await db.query.tests.findMany({
    columns: {
      wpm: true,
      created_at: true,
    },
    where: and(
      eq(tests.userId, session.user.id),
      gte(tests.created_at, daysAgo(30)),
    ),
  });

  const transformedResults = results.map((result) => ({
    date: format(result.created_at, "dd MMM"),
    wpm: result.wpm,
  }));

  const avgWpmByDate = transformedResults.reduce(
    (acc, cur) => {
      if (!acc[cur.date]) {
        acc[cur.date] = { wpm: 0, count: 0 };
      }

      acc[cur.date].wpm += cur.wpm;
      acc[cur.date].count += 1;

      return acc;
    },
    {} as Record<string, { wpm: number; count: number }>,
  );

  return Object.entries(avgWpmByDate).map(([date, { wpm, count }]) => ({
    date,
    "Average Daily WPM": Math.round(wpm / count),
  }));
};

export const Wpm30dayChart = async () => {
  const data = await get30DayWpmAverage();

  if (!data) return null;

  return (
    <Grid className="max-md:pb-12">
      <LineChart
        className="mt-6"
        data={data}
        index="date"
        categories={["Average Daily WPM"]}
        colors={["blue"]}
        yAxisWidth={40}
      />
    </Grid>
  );
};
