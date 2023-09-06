import { db } from "@/db";
import { eq } from "drizzle-orm";
import type { Socket } from "socket.io";

import { rooms } from "@/db/schema";
import { generateTextByMode } from "../generate-text/generate-text";

import type {
  ClientToServerEvents,
  RoomPayload,
  ServerToClientEvents,
} from "@/types/socket";
import type { TestMode } from "@/types/test";

export const handleStartTest = async (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  payload: RoomPayload,
) => {
  const { room } = payload;

  // Lock room
  await db
    .update(rooms)
    .set({ isActiveRoom: false })
    .where(eq(rooms.id, room.id));

  // Generate text
  const testMode: TestMode = {
    mode: room.mode as TestMode["mode"],
    amount: room.amount,
  };

  const text = generateTextByMode(testMode);

  // start counter
  async function countdown(s: number = 5) {
    return await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (s === 1) {
          resolve();
          clearInterval(interval);
        }
        socket.to(`room-${room.id}`).emit("newMessage", {
          username: `Game starts in ${s}`,
          message: "",
        });
        socket.emit("newMessage", {
          username: `Game starts in ${s}`,
          message: "",
        });
        s--;
      }, 1000);
    });
  }
  await countdown();

  // Emit event
  socket.to(`room-${room.id}`).emit("gameStarted", { text, roomId: room.id });
  socket.emit("gameStarted", { text, roomId: room.id });
};
