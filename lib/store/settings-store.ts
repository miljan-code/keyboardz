import { atomWithStorage } from "jotai/utils";

import type { TestSettings } from "@/types/test";

export const settingsAtom = atomWithStorage<TestSettings>(
  "keyboardz__settings",
  {
    liveWpm: false,
  },
);
