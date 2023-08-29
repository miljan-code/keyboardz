import type { RoomWithCreator } from "@/app/(multiplayer)/lobby/page";

import { generateFallback } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface TestRoomProps {
  room: RoomWithCreator;
}

export const TestRoom = ({ room }: TestRoomProps) => {
  return (
    <div className="flex cursor-pointer items-center justify-between border-b-2 border-background px-4 py-3 transition-colors hover:bg-foreground/10">
      <div className="flex-1">
        <span className="text-sm text-primary">{room.roomName}</span>
      </div>
      <div className="flex flex-1 items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={room.creator.image || ""} />
          <AvatarFallback>
            {generateFallback(room.creator.name || "")}
          </AvatarFallback>
        </Avatar>
        <span className="truncate text-sm text-foreground/80">
          {room.creator.name}
        </span>
      </div>
      <div className="flex flex-1 items-center gap-2 text-sm text-foreground/80">
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
      <div className="flex-1">
        <span className="text-sm text-foreground/80">
          {room.minWpm < 1 ? "No minimum WPM" : room.minWpm}
        </span>
      </div>
      <div className="flex flex-1 justify-end">
        <span className="text-sm text-foreground/80">
          {room.participantsIds.length}/{room.maxUsers}
        </span>
      </div>
    </div>
  );
};
