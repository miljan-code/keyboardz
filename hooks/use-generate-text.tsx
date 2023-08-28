import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";

import { generateRandomText } from "@/lib/generate-text/generate-text";
import { testModeAtom } from "@/lib/store";

export const useGenerateText = () => {
  const [isLoading, setIsLoading] = useState(true);
  const testMode = useAtomValue(testModeAtom);

  let text = "";

  useEffect(() => setIsLoading(false), []);

  if (testMode.mode === "words") {
    text = generateRandomText(testMode.amount);
  } else {
    text = generateRandomText(testMode.amount * 6);
  }

  return { text, isLoading };
};
