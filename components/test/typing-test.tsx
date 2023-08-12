"use client";

import { useEffect, useState } from "react";

import { generateRandomText } from "@/lib/generate-text/generate-text";
import { TypingBox } from "@/components/test/typing-box";
import { TypingModeDialog } from "@/components/test/typing-mode-dialog";

import type { TestMode } from "@/types/test";

const initialTestMode: TestMode = {
  mode: "timer",
  amount: 60,
};

export const TypingTest = () => {
  const [isClient, setIsClient] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
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
      {isClient ? (
        <>
          <div className="flex justify-center">
            <TypingModeDialog
              isModalOpen={isModalOpen}
              testMode={testMode}
              handleModal={(bool: boolean) => setIsModalOpen(bool)}
              handleModeChange={(mode: TestMode) => setTestMode(mode)}
            />
          </div>
          <div className="-mt-12 flex h-full items-center justify-center">
            <TypingBox
              isModalOpen={isModalOpen}
              testMode={testMode}
              text={text}
            />
          </div>
        </>
      ) : (
        "Loading..."
      )}
    </>
  );
};
