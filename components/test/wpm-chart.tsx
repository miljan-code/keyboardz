"use client";

import { AreaChart, Grid } from "@tremor/react";

import type { WpmHistory } from "@/types/test";

interface WpmChartProps {
  data: WpmHistory[];
}

export const WpmChart = ({ data }: WpmChartProps) => {
  const wpmHistory = data.map((item, i) => ({
    index: i + 1,
    wpm: item.wpm,
    raw: item.rawWpm,
  }));

  return (
    <Grid>
      <AreaChart
        className="h-80"
        data={wpmHistory}
        categories={["wpm", "raw"]}
        index="index"
        colors={["blue", "cyan"]}
        yAxisWidth={60}
      />
    </Grid>
  );
};
