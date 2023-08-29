import { Server as HttpServer } from "http";
import { Socket } from "net";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketServer } from "socket.io";

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: Socket & {
    server: HttpServer & {
      io: SocketServer;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    const io = new SocketServer(res.socket.server, {
      path: "/api/socket/io",
    });
    res.socket.server.io = io;
  }
  res.end();
};

export default SocketHandler;
