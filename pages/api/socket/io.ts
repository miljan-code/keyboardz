import { NextApiRequest } from "next";
import { Server as ServerIO, type Socket } from "socket.io";

import { handleUserJoinRoom } from "@/lib/event-handlers";

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
      socket.on("userJoinRoom", async (payload) => {
        handleUserJoinRoom(socket, payload);
      });
    },
  );

  res.end();
};

export default io;
