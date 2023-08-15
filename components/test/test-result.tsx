"use client";

import { useTimer } from "@/hooks/use-timer";
import { useWpm, type UseWPMProps } from "@/hooks/use-wpm";
import { useAtom } from "jotai";

import WpmChart from "@/components/test/wpm-chart";
import { testModeAtom } from "./typing-mode-dialog";

interface TestResultProps {
  wpmInput: UseWPMProps;
}

export const TestResult = ({ wpmInput }: TestResultProps) => {
  const [testMode] = useAtom(testModeAtom);

  const { wpmStats, wpmHistory } = useWpm(wpmInput);
  const { elapsedTime } = useTimer();

  return (
    <section className="w-full space-y-4">
      <div className="grid items-center gap-2 md:grid-cols-[auto_1fr]">
        <div className="flex items-center justify-between gap-2 md:flex-col md:items-start">
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
        <WpmChart data={wpmHistory} />
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <div className="flex flex-col items-center md:items-start">
          <span className="text-foreground/60">test type</span>
          <span className="text-2xl font-medium text-primary">
            {testMode.mode} {testMode.amount}
          </span>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <span className="text-foreground/60">raw wpm</span>
          <span className="text-2xl font-medium text-primary">
            {wpmStats.rawWpm}
          </span>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <span className="text-foreground/60">characters</span>
          <span className="text-2xl font-medium text-primary">
            {wpmStats.chars.correct}/{wpmStats.chars.incorrect}
          </span>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <span className="text-foreground/60">time</span>
          <span className="text-2xl font-medium text-primary">
            {testMode.mode === "timer" ? testMode.amount : elapsedTime}s
          </span>
        </div>
      </div>
    </section>
  );
};
