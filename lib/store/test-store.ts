import { atom } from "jotai";

import type { WpmHistory, WpmStats } from "@/types/test";

export const initialWpmStats = {
  wpm: 0,
  rawWpm: 0,
  liveWpm: 0,
  accuracy: 0,
  chars: {
    correct: 0,
    incorrect: 0,
  },
};

export const wpmStatsAtom = atom<WpmStats>(initialWpmStats);
export const wpmHistoryAtom = atom<WpmHistory[]>([]);

export const currentTextAtom = atom("");

export const timerAtom = atom(0);
