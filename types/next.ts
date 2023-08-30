import { Server as HttpServer } from "http";
import { Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: HttpServer & {
      io: SocketIOServer;
    };
  };
};
