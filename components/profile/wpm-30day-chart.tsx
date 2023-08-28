"use client";

import type { ChartData } from "@/app/profile/page";
import { Grid, LineChart } from "@tremor/react";
import { useTheme } from "next-themes";

import { chartTheme } from "@/config/themes";

interface Wpm30dayChartProps {
  data: ChartData;
}

export const Wpm30dayChart = ({ data }: Wpm30dayChartProps) => {
  const { theme } = useTheme();

  if (!data) return null;

  const colors = chartTheme[theme ?? "dark-blue"];

  return (
    <Grid className="max-md:pb-12">
      <LineChart
        className="mt-6"
        data={data}
        index="date"
        categories={["Average Daily WPM"]}
        colors={colors}
        yAxisWidth={40}
      />
    </Grid>
  );
};
