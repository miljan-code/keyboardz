import { db } from "@/db";
import { eq } from "drizzle-orm";
import * as z from "zod";

import { getSession } from "@/lib/auth";
import { saveResultSchema } from "@/lib/validations/save-result-schema";
import { tests, users } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return new Response("Not authorized", { status: 403 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!user) {
      return new Response("Not authorized", { status: 403 });
    }

    const test = saveResultSchema.parse(await req.json());

    await db.insert(tests).values({ userId: session.user.id, ...test });

    if (test.wpm > user.bestScore) {
      await db
        .update(users)
        .set({ bestScore: test.wpm })
        .where(eq(users.id, user.id));
    }

    return new Response(JSON.stringify("Result saved to db"), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response("Something went wrong", { status: 500 });
  }
}
