import * as z from "zod";

import { testModeFormSchema } from "./test-mode-schema";

export const createRoomSchema = testModeFormSchema.extend({
  roomName: z
    .string()
    .min(1, {
      message: "Room name must contain at least 1 character",
    })
    .max(32),
  maxUsers: z.coerce.number().min(2).max(8),
  isPublic: z.boolean(),
  minWpm: z.coerce.number().optional(),
});
