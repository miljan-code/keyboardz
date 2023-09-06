import { db } from "@/db";
import { and, eq } from "drizzle-orm";

import { multiplayerScores, rooms } from "@/db/schema";

import type { UserJoinRoomPayload } from "@/types/socket";

export const handleRemoveResult = async (payload: UserJoinRoomPayload) => {
  const { roomId, userId } = payload;

  await db
    .delete(multiplayerScores)
    .where(
      and(
        eq(multiplayerScores.roomId, roomId),
        eq(multiplayerScores.userId, userId),
      ),
    );

  const [score] = await db
    .select()
    .from(multiplayerScores)
    .where(eq(multiplayerScores.roomId, roomId));

  if (score) return;

  await db.delete(rooms).where(eq(rooms.id, roomId));
};
