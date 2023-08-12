import { generateRandomText } from "@/lib/generate-text/generate-text";
import { TypingBox } from "@/components/test/typing-box";
import { TypingModeDialog } from "@/components/test/typing-mode-dialog";

export const TypingTest = () => {
  const text = generateRandomText(40);

  return (
    <>
      <div className="flex justify-center">
        <TypingModeDialog />
      </div>
      <div className="-mt-12 flex h-full items-center justify-center">
        <TypingBox text={text} />
      </div>
    </>
  );
};
