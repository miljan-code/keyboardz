"use client";

import { useWpm, type UseWPMProps } from "@/hooks/use-wpm";

import WpmChart from "./wpm-chart";

interface TestResultProps {
  wpmInput: UseWPMProps;
}

export const TestResult = ({ wpmInput }: TestResultProps) => {
  const { wpmStats } = useWpm(wpmInput);

  return (
    <section className="w-full space-y-4">
      <div className="grid grid-cols-[auto_1fr] items-center gap-2">
        <div className="space-y-2">
          <div className="flex flex-col">
            <span className="text-3xl font-medium text-foreground/60">wpm</span>
            <span className="text-6xl font-semibold text-primary">
              {wpmStats.wpm}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-medium text-foreground/60">acc</span>
            <span className="text-6xl font-semibold text-primary">
              {wpmStats.accuracy}%
            </span>
          </div>
        </div>
        <WpmChart data={wpmStats.wpmHistory} />
      </div>
      <div className="grid grid-cols-4 gap-2">
        <div className="flex flex-col">
          <span className="text-foreground/60">test type</span>
          <span className="text-2xl font-medium text-primary">
            {wpmInput.testMode.mode} {wpmInput.testMode.amount}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-foreground/60">raw wpm</span>
          <span className="text-2xl font-medium text-primary">
            {wpmStats.rawWpm}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-foreground/60">characters</span>
          <span className="text-2xl font-medium text-primary">
            {wpmStats.chars.correct}/{wpmStats.chars.incorrect}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-foreground/60">time</span>
          <span className="text-2xl font-medium text-primary">
            {wpmInput.testMode.mode === "timer"
              ? wpmInput.testMode.amount
              : wpmInput.elapsedTime}
            s
          </span>
        </div>
      </div>
    </section>
  );
};
