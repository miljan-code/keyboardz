import { db } from "@/db";
import * as z from "zod";

import { getSession } from "@/lib/auth";
import { saveResultSchema } from "@/lib/validations/save-result-schema";
import { tests } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return new Response("Not authorized", { status: 403 });
    }

    const test = saveResultSchema.parse(await req.json());

    await db.insert(tests).values({ userId: session.user.id, ...test });

    return new Response(JSON.stringify("Result saved to db"), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response("Something went wrong", { status: 500 });
  }
}
