import { NextApiRequest } from "next";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { Server as ServerIO, type Socket } from "socket.io";

import { participants, rooms, users } from "@/db/schema";

import type { NextApiResponseServerIO } from "@/types/next";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/types/socket";

export const config = {
  api: {
    bodyParser: false,
  },
};

const io = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    console.log(`New Socket.io server... to ${path}`);
    const httpServer = res.socket.server;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
  }

  res.socket.server.io.on(
    "connection",
    (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
      socket.on("userJoinRoom", async ({ roomId, userId }) => {
        console.log("Caught event", socket.id);
        const room = await db.query.rooms.findFirst({
          where: eq(rooms.id, roomId),
          with: {
            participants: true,
          },
        });

        console.log("err1");

        if (!room) {
          socket.emit("sendNotification", {
            title: "Room is not found",
            description: "Make sure you enter correct ID.",
          });

          return;
        }

        if (room.participants.length === room.maxUsers) {
          socket.emit("sendNotification", {
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
          },
        });

        console.log("err2");

        if (!user) return;

        const userIsParticipant = await db.query.participants.findFirst({
          where: eq(participants.userId, userId),
        });

        console.log("err3");

        if (!!userIsParticipant) {
          socket.emit("sendNotification", {
            title: "You are already in a room",
            description: "Please, leave the current room you are in first.",
          });

          return;
        }

        await db.insert(participants).values({ roomId, userId });

        socket.join(`room-${roomId}`);

        socket.to(`room-${roomId}`).emit("updateRoom", {
          roomId,
        });
      });
    },
  );

  res.end();
};

export default io;
