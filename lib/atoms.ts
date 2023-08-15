import { atom } from "jotai";

import type { TestMode } from "@/types/test";

export const testModeAtom = atom<TestMode>({
  mode: "timer",
  amount: 60,
});

export const currentTextAtom = atom("");
