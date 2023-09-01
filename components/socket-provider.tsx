"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { socket } from "@/lib/socket";
import { useToast } from "@/components/ui/use-toast";

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    socket.on("updateRoomList", () => {
      queryClient.refetchQueries({ queryKey: ["test-rooms"] });
    });

    socket.on("notification", ({ title, description }) => {
      toast({
        title,
        description,
      });
    });

    socket.on("userEnteredRoom", ({ roomId }) => {
      router.push(`/lobby/${roomId}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient, toast, router]);

  return <>{children}</>;
};
