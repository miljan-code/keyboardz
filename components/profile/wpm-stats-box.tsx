import { Card } from "@/components/ui/card";

export const WpmStatsBox = () => {
  return (
    <Card className="after:bg-card-gradient relative flex flex-1 items-center justify-evenly py-4 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full">
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-muted-foreground">15 seconds</span>
        <span className="text-3xl font-semibold">142</span>
        <span className="text-sm text-foreground/60">98%</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-muted-foreground">15 seconds</span>
        <span className="text-3xl font-semibold">142</span>
        <span className="text-sm text-foreground/60">98%</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-muted-foreground">15 seconds</span>
        <span className="text-3xl font-semibold">142</span>
        <span className="text-sm text-foreground/60">98%</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-muted-foreground">15 seconds</span>
        <span className="text-3xl font-semibold">142</span>
        <span className="text-sm text-foreground/60">98%</span>
      </div>
    </Card>
  );
};
