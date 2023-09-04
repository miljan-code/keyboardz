import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";

import { generateTextByMode } from "@/lib/generate-text/generate-text";
import { testModeAtom } from "@/lib/store";

export const useGenerateText = () => {
  const [isLoading, setIsLoading] = useState(true);
  const testMode = useAtomValue(testModeAtom);

  useEffect(() => setIsLoading(false), []);

  const text = generateTextByMode(testMode);

  return { text, isLoading };
};
