"use client";

import type { RoomWithParticipants } from "@/app/(multiplayer)/lobby/page";

import { generateFallback } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface RoomProps {
  room: RoomWithParticipants;
}

export const Room = ({ room }: RoomProps) => {
  return (
    <div className="flex h-96 flex-col rounded-md bg-foreground/5 sm:h-80 sm:flex-row">
      <div className="flex w-full flex-row gap-2 border-background px-4 py-2 max-sm:overflow-x-auto max-sm:border-b-2 sm:w-48 sm:flex-col sm:overflow-y-auto sm:border-r-2">
        {room.participants.map((user) => (
          <div key={user.id} className="flex items-center gap-2">
            <Avatar className="h-4 w-4">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback>
                {generateFallback(user.name || "")}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{user.name}</span>
          </div>
        ))}
      </div>
      <div className="overflow-y-auto">Right Side</div>
    </div>
  );
};
