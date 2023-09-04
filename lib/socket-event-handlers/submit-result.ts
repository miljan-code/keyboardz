import type { Socket } from "socket.io";

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

  socket.to(`room-${roomId}`).emit("updateResults", {
    user,
    wpmStats,
  });
  socket.emit("updateResults", {
    user,
    wpmStats,
  });
};
