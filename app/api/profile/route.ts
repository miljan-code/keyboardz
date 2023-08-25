import { db } from "@/db";
import { eq } from "drizzle-orm";
import * as z from "zod";

import { getSession } from "@/lib/auth";
import { editProfileFormSchema } from "@/lib/validations/edit-profile-schema";
import { users } from "@/db/schema";

export async function PATCH(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return new Response("Not authorized", { status: 403 });
    }

    const data = editProfileFormSchema.parse(await req.json());

    const fields = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, value || null]),
    );

    await db.update(users).set(fields).where(eq(users.id, session.user.id));

    return new Response(JSON.stringify("Profile updated!"), { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response("Something went wrong", { status: 500 });
  }
}
