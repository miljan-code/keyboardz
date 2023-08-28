import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type { TestMode } from "@/types/test";

export const testModeAtom = atomWithStorage<TestMode>("keyboardz__testMode", {
  mode: "timer",
  amount: 60,
});

export const testModeModalAtom = atom(false);
