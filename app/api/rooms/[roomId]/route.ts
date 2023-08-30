import { db } from "@/db";
import { eq } from "drizzle-orm";

import { getSession } from "@/lib/auth";
import { rooms } from "@/db/schema";

interface HandlerParams {
  params: {
    roomId: string;
  };
}

export async function GET(req: Request, { params }: HandlerParams) {
  try {
    const session = await getSession();

    if (!session) {
      return new Response("Not authorized", { status: 401 });
    }

    if (!params.roomId) {
      return new Response("Room ID is missing", { status: 422 });
    }

    const data = await db.query.rooms.findFirst({
      where: eq(rooms.id, params.roomId),
      with: {
        creator: true,
        participants: true,
      },
    });

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
}
