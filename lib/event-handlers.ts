import { db } from "@/db";
import { eq } from "drizzle-orm";
import type { Socket } from "socket.io";

import { participants, rooms, users } from "@/db/schema";

import type {
  ClientToServerEvents,
  ServerToClientEvents,
  UserJoinRoomPayload,
} from "@/types/socket";

export const handleUserJoinRoom = async (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  payload: UserJoinRoomPayload,
) => {
  const { roomId, userId } = payload;

  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
    with: {
      participants: {
        with: {
          user: true,
        },
      },
    },
  });

  if (!room) {
    socket.emit("notification", {
      title: "Room is not found",
      description: "Make sure you enter correct ID.",
    });

    return;
  }

  if (room.participants.length === room.maxUsers) {
    socket.emit("notification", {
      title: "Room is full",
      description:
        "Room you want to enter is full. Please, try with another one.",
    });

    return;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      participant: true,
      tests: true,
    },
  });

  if (!user) return;

  const isAboveMinWpm = user.tests.some((test) => test.wpm >= room.minWpm);

  if (!isAboveMinWpm) {
    socket.emit("notification", {
      title: "You have never reached minimum WPM",
      description: `This room is only for users who have reached ${room.minWpm} wpm score.`,
    });

    return;
  }

  // const userIsParticipant = await db.query.participants.findFirst({
  //   where: eq(participants.userId, userId),
  // });

  if (user.participant) {
    socket.emit("notification", {
      title: "You are already in a room",
      description: "Please, leave the current room you are in first.",
    });

    return;
  }

  await db.insert(participants).values({ roomId, userId });

  socket.emit("updateRoomList");
  socket.join(`room-${roomId}`);
  socket.to(`room-${roomId}`).emit("updateRoom", {
    roomId,
  });
  socket.emit("userEnteredRoom", {
    roomId,
  });
};
