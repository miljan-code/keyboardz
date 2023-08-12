import * as z from "zod";

export const testModeFormSchema = z.object({
  mode: z.union([z.literal("timer"), z.literal("words")]),
  amount: z
    .number({ required_error: "Please enter desired amount" })
    .min(10, { message: "Amount can't be less than 10" }),
});
