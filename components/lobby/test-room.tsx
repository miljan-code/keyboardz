"use client";

import type { RoomWithParticipants } from "@/app/(multiplayer)/lobby/page";
import type { Session } from "next-auth";

import { socket } from "@/lib/socket";
import { generateFallback } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface TestRoomProps {
  room: RoomWithParticipants;
  session: Session;
}

export const TestRoom = ({ room, session }: TestRoomProps) => {
  const handleJoinRoom = () => {
    socket.emit("userJoinRoom", {
      userId: session.user.id,
      roomId: room.id,
    });
  };

  return (
    <div
      onClick={handleJoinRoom}
      className="flex cursor-pointer items-center justify-between border-b-2 border-background px-4 py-3 transition-colors hover:bg-foreground/10"
    >
      <div className="hidden flex-1 lg:flex">
        <span className="truncate text-sm text-primary">{room.roomName}</span>
      </div>
      <div className="flex items-center gap-2 sm:max-md:mr-6 md:mr-0 md:flex-1">
        <Avatar className="h-8 w-8">
          <AvatarImage src={room.creator.image || ""} />
          <AvatarFallback>
            {generateFallback(room.creator.name || "")}
          </AvatarFallback>
        </Avatar>
        <span className="hidden text-sm text-foreground/80 md:inline-block">
          {room.creator.name}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm text-foreground/80 sm:flex-1">
        <div className="flex items-center gap-1">
          {room.mode === "timer" ? (
            <Icons.timer size={16} className="text-primary" />
          ) : (
            <Icons.words size={16} className="text-primary" />
          )}
          {room.mode}
        </div>
        <span>&mdash;</span>
        <span>{room.amount}</span>
      </div>
      <div className="hidden flex-1 sm:block">
        <span className="text-sm text-foreground/80">
          {room.minWpm < 1 ? "No minimum WPM" : room.minWpm}
        </span>
      </div>
      <div className="flex justify-end sm:flex-1">
        <span className="text-sm text-foreground/80">
          {room.participants.length}/{room.maxUsers}
        </span>
      </div>
    </div>
  );
};
