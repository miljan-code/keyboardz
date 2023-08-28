"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { io } from "socket.io-client";

import { socketAtom } from "@/lib/store/socket-store";

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const setSocket = useSetAtom(socketAtom);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SITE_URL, {
      path: "/api/socket/io",
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
      setSocket(null);
    };
  }, [setSocket]);

  return <>{children}</>;
};
