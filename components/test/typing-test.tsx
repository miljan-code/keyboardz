"use client";

import { useEffect, useState } from "react";

import { generateRandomText } from "@/lib/generate-text/generate-text";
import { Loader } from "@/components/loader";
import { TypingBox } from "@/components/test/typing-box";
import { TypingModeDialog } from "@/components/test/typing-mode-dialog";

import type { TestMode } from "@/types/test";

const initialTestMode: TestMode = {
  mode: "timer",
  amount: 60,
};

export const TypingTest = () => {
  const [isClient, setIsClient] = useState(false);

  const [testMode, setTestMode] = useState<TestMode>(initialTestMode);

  useEffect(() => setIsClient(true), []);

  let text = "";

  if (testMode.mode === "words") {
    text = generateRandomText(testMode.amount);
  } else {
    text = generateRandomText(testMode.amount * 6);
  }

  return (
    <>
      <div className="flex justify-center">
        <TypingModeDialog
          testMode={testMode}
          handleModeChange={(mode: TestMode) => setTestMode(mode)}
        />
      </div>
      {isClient ? (
        <div className="-mt-12 flex h-full items-center justify-center">
          <TypingBox testMode={testMode} text={text} />
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};
