import { NextApiRequest } from "next";
import { Server as ServerIO, type Socket } from "socket.io";

import { handleRemoveResult } from "@/lib/socket-event-handlers/remove-result";
import { handleSendMessage } from "@/lib/socket-event-handlers/send-message";
import { handleStartTest } from "@/lib/socket-event-handlers/start-test";
import { handleSubmitResult } from "@/lib/socket-event-handlers/submit-result";
import { handleUserJoinRoom } from "@/lib/socket-event-handlers/user-join-room";
import { handleUserLeaveRoom } from "@/lib/socket-event-handlers/user-leave-room";

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
      socket.on("userJoinRoom", (payload) => {
        handleUserJoinRoom(socket, payload);
      });

      socket.on("userLeaveRoom", (payload) => {
        handleUserLeaveRoom(socket, payload);
      });

      socket.on("sendMessage", (payload) => {
        handleSendMessage(socket, payload);
      });

      socket.on("startGame", (payload) => {
        handleStartTest(socket, payload);
      });

      socket.on("submitResult", (payload) => {
        handleSubmitResult(socket, payload);
      });

      socket.on("removeResult", (payload) => {
        handleRemoveResult(payload);
      });
    },
  );

  res.end();
};

export default io;
