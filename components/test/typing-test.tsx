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
        <div className="before:shadow-bg-primary relative -mt-12 flex h-full items-center justify-center before:absolute before:left-1/2 before:top-1/2 before:w-full before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full">
          <TypingBox text={text} />
        </div>
      ) : (
        <Loader />
      )}
      <div className="flex items-end justify-center">
        <div className="flex cursor-default gap-1.5 text-foreground/80">
          <span className="rounded-md bg-foreground/80 px-1.5 font-medium text-background">
            tab
          </span>
          <span>&mdash;</span>
          <span className="font-medium">restart test</span>
        </div>
      </div>
    </>
  );
};
