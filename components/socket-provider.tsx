"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { socket } from "@/lib/socket";

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.on("createdRoom", () => {
      queryClient.refetchQueries({ queryKey: ["test-rooms"] });
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  return <>{children}</>;
};
