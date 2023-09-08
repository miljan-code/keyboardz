import { db } from "@/db";
import { eq } from "drizzle-orm";
import type { Socket } from "socket.io";

import { participants, rooms } from "@/db/schema";

import type {
  ClientToServerEvents,
  ServerToClientEvents,
  UserLeaveRoomPayload,
} from "@/types/socket";

export const handleUserLeaveRoom = async (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  payload: UserLeaveRoomPayload,
) => {
  const { roomId, userId, username } = payload;

  // Delete participant
  await db.delete(participants).where(eq(participants.userId, userId));

  // Check if has left an empty room
  const remainingParticipants = await db
    .select()
    .from(participants)
    .where(eq(participants.roomId, roomId));

  const [room] = await db.select().from(rooms).where(eq(rooms.id, roomId));

  // Check if room is empty and inactive
  let isDeleted = false;
  if (!remainingParticipants.length && room.isActiveRoom) {
    await db.delete(rooms).where(eq(rooms.id, roomId));
    isDeleted = true;
  }

  // Check if host has left the room
  if (room.creatorId === userId && !isDeleted) {
    await db.update(rooms).set({ creatorId: remainingParticipants[0].userId });
  }

  socket.to(`room-${roomId}`).emit("updateRoom", { roomId });
  socket.broadcast.emit("updateRoomList");
  socket.emit("updateRoomList");
  socket.to(`room-${roomId}`).emit("newMessage", {
    username: username || "Unknown",
    message: "has left the room",
  });
};
