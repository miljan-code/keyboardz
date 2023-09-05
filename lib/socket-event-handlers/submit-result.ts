import { db } from "@/db";
import type { Socket } from "socket.io";

import { multiplayerScores } from "@/db/schema";

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

  await db
    .insert(multiplayerScores)
    .values({
      userId: user.id,
      roomId,
      wpm: wpmStats.wpm,
      accuracy: wpmStats.accuracy,
      rawWpm: wpmStats.rawWpm,
    });

  socket.to(`room-${roomId}`).emit("updateResults", {
    user,
    wpmStats,
  });
  socket.emit("updateResults", {
    user,
    wpmStats,
  });
};
