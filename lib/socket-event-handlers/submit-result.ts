import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import type { Socket } from "socket.io";

import { multiplayerScores, rooms } from "@/db/schema";

import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SubmitResultPayload,
} from "@/types/socket";

export const handleSubmitResult = async (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  payload: SubmitResultPayload,
) => {
  const { roomId, testMode, text, user, wpmStats } = payload;

  const [room] = await db.select().from(rooms).where(eq(rooms.id, roomId));

  const isModeCorrect = testMode.mode === room.mode;
  const isAmountCorrect = testMode.amount === room.amount;

  if (!isModeCorrect || !isAmountCorrect) {
    socket.emit("notification", {
      title: "Did you try to cheat?",
      description: "Mode or words/time amount does not match.",
    });
    return null;
  }

  const [score] = await db
    .select()
    .from(multiplayerScores)
    .where(
      and(
        eq(multiplayerScores.userId, user.id),
        eq(multiplayerScores.roomId, roomId),
      ),
    );

  if (score) return null;

  await db.insert(multiplayerScores).values({
    userId: user.id,
    roomId,
    wpm: wpmStats.wpm,
    accuracy: wpmStats.accuracy,
    rawWpm: wpmStats.rawWpm,
  });

  socket.to(`room-${roomId}`).emit("updateResults");
  socket.emit("updateResults");
};
