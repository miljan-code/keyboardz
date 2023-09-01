"use client";

import { useEffect } from "react";
import type { RoomWithParticipants } from "@/app/(multiplayer)/lobby/page";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "next-auth";

import { socket } from "@/lib/socket";
import { cn, generateFallback } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    socket.on("updateRoom", ({ roomId }) => {
      queryClient.refetchQueries({ queryKey: [`room-${roomId}`] });
    });

    return () => {
      socket.emit("userLeaveRoom", {
        userId: session.user.id,
        roomId: room.id,
      }); // 2nd aprch could be on pathname change
    };
  }, [room.id, session.user.id, initialRoomData.id, queryClient]);

  const roomIsFull = room.participants.length === room.maxUsers;

  return (
    <>
      <div className="flex flex-col max-md:gap-2 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1 md:gap-2">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
            {room.roomName}
          </h2>
          <span className="text-foreground/60">
            {roomIsFull ? (
              "Room is full and ready to start."
            ) : (
              <>
                <span>Waiting for other users to join</span>
                <span className="animate-pulse delay-100">.</span>
                <span className="animate-pulse delay-200">.</span>
                <span className="animate-pulse delay-300">.</span>
              </>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2 text-foreground/60 max-md:text-sm">
          <span className="text-foreground/60">Users in room:</span>
          <span className="text-foreground">
            {room.participants.length}/{room.maxUsers}
          </span>
          <span
            className={cn(
              "h-3 w-3 rounded-full",
              roomIsFull ? "bg-green-500" : "bg-yellow-400",
            )}
          />
        </div>
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-6 px-4 py-3 text-sm text-muted-foreground sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={room.creator.image || ""} />
              <AvatarFallback>
                {generateFallback(room.creator.name || "")}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm text-foreground/80 md:inline-block">
              {room.creator.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {room.mode === "timer" ? (
              <Icons.timer size={16} className="text-primary" />
            ) : (
              <Icons.words size={16} className="text-primary" />
            )}
            <span>
              {room.mode} &mdash; {room.amount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Icons.swords size={16} className="text-primary" />
            <span>WPM: {room.minWpm}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icons.key size={16} className="text-primary" />
            <span>{room.isPublicRoom ? "Public" : "Private"}</span>
          </div>
        </div>
        <div className="flex h-96 flex-col rounded-md bg-foreground/5 sm:h-80 sm:flex-row">
          <div className="flex w-full flex-row gap-2 border-background px-4 py-2 max-sm:overflow-x-auto max-sm:border-b-2 sm:w-48 sm:flex-col sm:overflow-y-auto sm:border-r-2">
            {room.participants?.map((participant) => (
              <div
                key={participant.user.id}
                className="flex items-center gap-2"
              >
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
      </div>
    </>
  );
};
