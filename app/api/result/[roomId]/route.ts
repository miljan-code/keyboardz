import { db } from "@/db";
import { eq } from "drizzle-orm";

import { multiplayerScores } from "@/db/schema";

interface HandlerParams {
  params: {
    roomId: string;
  };
}

export async function GET(req: Request, { params }: HandlerParams) {
  try {
    if (!params.roomId) {
      return new Response("Room ID is missing", { status: 422 });
    }

    const scores = await db.query.multiplayerScores.findMany({
      where: eq(multiplayerScores.roomId, params.roomId),
      with: {
        user: true,
      },
    });

    return new Response(JSON.stringify(scores), { status: 200 });
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
}
