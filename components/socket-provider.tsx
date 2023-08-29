"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SITE_URL, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    socket.on("createdRoom", () => {
      queryClient.refetchQueries({ queryKey: ["test-rooms"] });
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  return <>{children}</>;
};
