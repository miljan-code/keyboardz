import * as z from "zod";

import { testModeFormSchema } from "@/lib/validations/test-mode-schema";

export type TestMode = z.infer<typeof testModeFormSchema>;

export interface WpmStats {
  wpm: number;
  rawWpm: number;
  liveWpm: number;
  wpmHistory: {
    wpm: number;
    rawWpm: number;
  }[];
  accuracy: number;
  chars: {
    correct: number;
    incorrect: number;
  };
}
