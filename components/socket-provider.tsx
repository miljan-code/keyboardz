"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";

import { socket } from "@/lib/socket";
import { multiplayerTextAtom } from "@/lib/store/multiplayer-store";
import { useToast } from "@/components/ui/use-toast";

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const setMultiplayerText = useSetAtom(multiplayerTextAtom);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

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

    socket.on("gameStarted", ({ text, roomId }) => {
      setMultiplayerText(text);
      router.push(`/test/${roomId}`);
    });

    return () => {
      socket.off("updateRoomList");
      socket.off("notification");
      socket.off("userEnteredRoom");
      socket.off("gameStarted");
    };
  }, [queryClient, toast, router, setMultiplayerText]);

  return <>{children}</>;
};
