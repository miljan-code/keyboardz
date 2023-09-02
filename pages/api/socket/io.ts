import { NextApiRequest } from "next";
import { Server as ServerIO, type Socket } from "socket.io";

import { handleSendMessage } from "@/lib/socket-events/handle-send-message";
import { handleUserJoinRoom } from "@/lib/socket-events/handle-user-join-room";
import { handleUserLeaveRoom } from "@/lib/socket-events/handle-user-leave-room";

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
    },
  );

  res.end();
};

export default io;
