"use client";

import { useGenerateText } from "@/hooks/use-generate-text";

import { Loader } from "@/components/loader";
import { TypingBox } from "@/components/test/typing-box";
import { TypingModeDialog } from "@/components/test/typing-mode-dialog";

export const TypingTest = () => {
  const { text, isLoading } = useGenerateText();

  return (
    <>
      <div className="flex justify-center">
        <TypingModeDialog />
      </div>
      {!isLoading ? (
        <div className="-mt-12 flex h-full items-center justify-center">
          <TypingBox text={text} />
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};
