"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";

import { testModeAtom } from "@/lib/atoms";
import { generateRandomText } from "@/lib/generate-text/generate-text";
import { Loader } from "@/components/loader";
import { TypingBox } from "@/components/test/typing-box";
import { TypingModeDialog } from "@/components/test/typing-mode-dialog";

export const TypingTest = () => {
  const [isClient, setIsClient] = useState(false);

  const [testMode] = useAtom(testModeAtom);

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
        <TypingModeDialog />
      </div>
      {isClient ? (
        <div className="-mt-12 flex h-full items-center justify-center">
          <TypingBox text={text} />
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};
