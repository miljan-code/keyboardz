import type { Test } from "@/db/schema";
import { Card } from "@/components/ui/card";

interface WpmStatsBoxProps {
  data: (Test | Pick<Test, "mode" | "amount">)[];
}

export const WpmStatsBox = ({ data }: WpmStatsBoxProps) => {
  return (
    <Card className="after:bg-card-gradient relative flex flex-1 items-center justify-evenly py-4 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full">
      {data.map((result) => (
        <div key={result.amount} className="flex flex-col items-center gap-1">
          <span className="text-xs text-muted-foreground">
            {result.amount} {result.mode === "timer" ? "seconds" : "words"}
          </span>
          <span className="text-3xl font-semibold">
            {"wpm" in result ? result.wpm : "—"}
          </span>
          <span className="text-sm text-foreground/60">
            {"accuracy" in result ? `${result.accuracy}%` : "—"}
          </span>
        </div>
      ))}
    </Card>
  );
};
