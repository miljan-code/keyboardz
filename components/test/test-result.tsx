"use client";

import { useEffect } from "react";
import { useTimer } from "@/hooks/use-timer";
import { useWpm } from "@/hooks/use-wpm";
import { useAtomValue } from "jotai";
import { useSession } from "next-auth/react";

import { testModeAtom } from "@/lib/store";
import { WpmChart } from "@/components/test/wpm-chart";
import { useToast } from "@/components/ui/use-toast";

interface TestResultProps {
  text: string;
}

export const TestResult = ({ text }: TestResultProps) => {
  const testMode = useAtomValue(testModeAtom);
  const { data: session } = useSession();
  const { wpmStats, wpmHistory } = useWpm({ text });
  const { elapsedTime } = useTimer();
  const { toast } = useToast();

  useEffect(() => {
    if (!session?.user.id) return;

    const testData = {
      wpm: wpmStats.wpm,
      rawWpm: wpmStats.rawWpm,
      accuracy: wpmStats.accuracy,
      mode: testMode.mode,
      amount: testMode.amount,
    };

    const saveResult = async () => {
      const result = await fetch("/api/result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      if (!result?.ok) {
        toast({
          title: "Profile not updated",
          description: "Something went wrong, please try again.",
        });
      }
    };

    saveResult();
  }, [
    session?.user.id,
    wpmStats.wpm,
    wpmStats.rawWpm,
    wpmStats.accuracy,
    testMode.mode,
    testMode.amount,
    toast,
  ]);

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
