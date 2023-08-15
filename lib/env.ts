import * as z from "zod";

const envVariables = z.object({
  DATABASE_URL: z.string(),
  NEXTAUTH_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
});

export type EnvSchema = z.infer<typeof envVariables>;
