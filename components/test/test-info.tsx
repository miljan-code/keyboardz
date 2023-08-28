"use client";

import { useCapslockStatus } from "@/hooks/use-capslock-status";
import { useTimer } from "@/hooks/use-timer";
import { useAtomValue } from "jotai";

import { settingsAtom, testModeAtom } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

import type { WpmStats } from "@/types/test";

interface TestInfoProps {
  testStarted: boolean;
  inputWords: string[];
  wpmStats: WpmStats;
}

export const TestInfo = ({
  testStarted,
  inputWords,
  wpmStats,
}: TestInfoProps) => {
  const settings = useAtomValue(settingsAtom);
  const testMode = useAtomValue(testModeAtom);
  const { elapsedTime } = useTimer();
  const { isCaps } = useCapslockStatus();

  return (
    <div className="flex items-center justify-between">
      <div
        className={cn(
          "mb-2 flex items-center gap-2 text-lg font-medium text-primary transition-opacity",
          {
            "opacity-0": !testStarted,
          },
        )}
      >
        {testMode.mode === "words" && (
          <span>
            {inputWords.length - 1}/{testMode.amount}
          </span>
        )}
        <span>{elapsedTime}</span>
      </div>
      <div
        className={cn(
          "flex -translate-y-10 items-center gap-2 rounded-md bg-primary px-4 py-2 transition-opacity",
          {
            "opacity-0": !isCaps,
          },
        )}
      >
        <span className="font-medium text-background">CapsLock</span>
        <Icons.lock size={16} className="text-background" />
      </div>
      {settings.liveWpm && (
        <div
          className={cn(
            "mb-2 flex items-center gap-2 text-lg font-medium text-primary transition-opacity",
            {
              "opacity-0": !testStarted,
            },
          )}
        >
          {wpmStats.liveWpm > 0 ? (
            <>
              <span className="text-foreground/60">Live WPM</span>
              <span>{wpmStats.liveWpm}</span>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};
