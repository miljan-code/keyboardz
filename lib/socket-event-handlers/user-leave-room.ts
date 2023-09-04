import { db } from "@/db";
import { eq } from "drizzle-orm";
import type { Socket } from "socket.io";

import { participants, rooms } from "@/db/schema";

import type {
  ClientToServerEvents,
  ServerToClientEvents,
  UserJoinRoomPayload,
} from "@/types/socket";

export const handleUserLeaveRoom = async (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  payload: UserJoinRoomPayload,
) => {
  const { roomId, userId } = payload;

  // Delete participant
  await db.delete(participants).where(eq(participants.userId, userId));

  // Check if has left an empty room
  const remainingParticipants = await db
    .select()
    .from(participants)
    .where(eq(participants.roomId, roomId));

  if (!remainingParticipants.length) {
    await db.delete(rooms).where(eq(rooms.id, roomId));
    socket.broadcast.emit("updateRoomList");
    return;
  }

  // Check if host has left the room
  const [room] = await db.select().from(rooms).where(eq(rooms.id, roomId));

  if (room.creatorId === userId) {
    await db.update(rooms).set({ creatorId: remainingParticipants[0].userId });
  }

  socket.to(`room-${roomId}`).emit("updateRoom", { roomId });
  socket.broadcast.emit("updateRoomList");
};
