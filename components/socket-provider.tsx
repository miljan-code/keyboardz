"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { io, Socket } from "socket.io-client";

import { multiplayerTextAtom } from "@/lib/store/multiplayer-store";
import { useToast } from "@/components/ui/use-toast";

import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/types/socket";

interface SocketProviderProps {
  children: React.ReactNode;
}

const socketAtom = atom<Socket<
  ServerToClientEvents,
  ClientToServerEvents
> | null>(null);

export const useSocket = () => {
  return useAtomValue(socketAtom);
};

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const setSocket = useSetAtom(socketAtom);
  const setMultiplayerText = useSetAtom(multiplayerTextAtom);

  useEffect(() => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      process.env.NEXT_PUBLIC_SITE_URL,
      {
        path: "/api/socket/io",
        addTrailingSlash: false,
      },
    );

    setSocket(socket);

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

    socket.on("startGame", ({ text, roomId }) => {
      setMultiplayerText(text);
      router.push(`/test/${roomId}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient, toast, router, setSocket, setMultiplayerText]);

  return <>{children}</>;
};
