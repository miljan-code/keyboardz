import * as z from "zod";

import { testModeFormSchema } from "@/lib/validations/test-mode-schema";

export const saveResultSchema = testModeFormSchema.extend({
  wpm: z.number().positive(),
  rawWpm: z.number().positive(),
  accuracy: z.number().positive(),
});
