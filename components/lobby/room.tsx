"use client";

import { useEffect } from "react";
import type { RoomWithParticipants } from "@/app/(multiplayer)/lobby/page";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "next-auth";

import { socket } from "@/lib/socket";
import { generateFallback } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface RoomProps {
  session: Session;
  initialRoomData: RoomWithParticipants;
}

export const Room = ({ initialRoomData, session }: RoomProps) => {
  const queryClient = useQueryClient();

  const { data: room } = useQuery({
    queryKey: [`room-${initialRoomData.id}`],
    queryFn: async () => {
      const res = await fetch(`/api/rooms/${initialRoomData.id}`);
      return (await res.json()) as RoomWithParticipants;
    },
    initialData: initialRoomData,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    socket.emit("userJoinRoom", {
      userId: session.user.id,
      roomId: initialRoomData.id,
    });

    socket.on("updateRoom", ({ roomId }) => {
      console.log(roomId);
      queryClient.refetchQueries({ queryKey: [`room-${initialRoomData.id}`] });
    });

    // Leave Room Handle
  }, [room.id, session.user.id, initialRoomData.id, queryClient]);

  return (
    <div className="flex h-96 flex-col rounded-md bg-foreground/5 sm:h-80 sm:flex-row">
      <div className="flex w-full flex-row gap-2 border-background px-4 py-2 max-sm:overflow-x-auto max-sm:border-b-2 sm:w-48 sm:flex-col sm:overflow-y-auto sm:border-r-2">
        {room.participants?.map((participant) => (
          <div key={participant.user.id} className="flex items-center gap-2">
            <Avatar className="h-4 w-4">
              <AvatarImage src={participant.user.image || ""} />
              <AvatarFallback>
                {generateFallback(participant.user.name || "")}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{participant.user.name}</span>
          </div>
        ))}
      </div>
      <div className="overflow-y-auto">Right Side</div>
    </div>
  );
};
