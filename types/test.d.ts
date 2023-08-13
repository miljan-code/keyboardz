import * as z from "zod";

import { testModeFormSchema } from "@/lib/validations/test-mode-schema";

export type TestMode = z.infer<typeof testModeFormSchema>;
