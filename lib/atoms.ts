import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type { TestMode, TestSettings } from "@/types/test";

export const testModeAtom = atomWithStorage<TestMode>("keyboardz__testMode", {
  mode: "timer",
  amount: 60,
});

export const currentTextAtom = atom("");

export const settingsAtom = atomWithStorage<TestSettings>(
  "keyboardz__settings",
  {
    liveWpm: false,
  },
);
