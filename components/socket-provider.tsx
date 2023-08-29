"use client";

import { useEffect } from "react";
import { io as ClientIO } from "socket.io-client";

import type { Room } from "@/db/schema";

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  useEffect(() => {
    const socket = new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    socket.on("created_room", (room: Room) => {
      console.log(room);
    });

    if (socket) return () => socket.disconnect();
  }, []);

  return <>{children}</>;
};
