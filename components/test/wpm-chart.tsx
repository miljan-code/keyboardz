"use client";

import { AreaChart } from "@tremor/react";

import type { WpmStats } from "@/types/test";

interface WpmChartProps {
  data: WpmStats["wpmHistory"];
}

export default function WpmChart({ data }: WpmChartProps) {
  const wpmHistory = data.map((item, i) => ({
    index: i,
    wpm: item.wpm,
    raw: item.rawWpm,
  }));

  return (
    <AreaChart
      className="h-80"
      data={wpmHistory}
      categories={["wpm", "raw"]}
      index="index"
      colors={["blue", "cyan"]}
      yAxisWidth={60}
    />
  );
}
