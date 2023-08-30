import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIO } from "@/types/next";
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
    const io = new ServerIO<ClientToServerEvents, ServerToClientEvents>(
      httpServer,
      {
        path: path,
        addTrailingSlash: false,
      },
    );
    res.socket.server.io = io;
  }
  res.end();
};

export default io;
