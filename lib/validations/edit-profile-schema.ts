import * as z from "zod";

export const editProfileFormSchema = z.object({
  bio: z
    .string()
    .max(191, { message: "Bio can not be longer than 255 characters" })
    .optional(),
  keyboard: z
    .string()
    .max(100, {
      message: "Keyboard name can not be longer than 100 characters",
    })
    .optional(),
  github: z
    .string()
    .max(50, {
      message: "GitHub username can not be longer than 50 characters",
    })
    .optional(),
  x: z
    .string()
    .max(50, { message: "X username can not be longer than 50 characters" })
    .optional(),
  website: z.string().optional(),
});
