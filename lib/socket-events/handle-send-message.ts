import type { Socket } from "socket.io";

import type {
  ClientToServerEvents,
  MessagePayload,
  ServerToClientEvents,
} from "@/types/socket";

export const handleSendMessage = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  payload: MessagePayload,
) => {
  const { username, message, roomId } = payload;

  if (message.length) {
    socket.to(`room-${roomId}`).emit("newMessage", {
      username,
      message,
    });
  }
};
