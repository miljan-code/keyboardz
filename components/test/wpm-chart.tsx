"use client";

import { AreaChart, Grid } from "@tremor/react";
import { useTheme } from "next-themes";

import { chartTheme } from "@/config/themes";

import type { WpmHistory } from "@/types/test";

interface WpmChartProps {
  data: WpmHistory[];
}

export const WpmChart = ({ data }: WpmChartProps) => {
  const { theme } = useTheme();

  const wpmHistory = data.map((item, i) => ({
    index: i + 1,
    wpm: item.wpm,
    raw: item.rawWpm,
  }));

  const colors = chartTheme[theme ?? "dark-blue"];

  return (
    <Grid>
      <AreaChart
        className="h-80"
        data={wpmHistory}
        categories={["wpm", "raw"]}
        index="index"
        colors={colors}
        yAxisWidth={60}
      />
    </Grid>
  );
};
