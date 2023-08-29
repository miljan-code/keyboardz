"use client";

import { CreateRoom } from "@/components/lobby/create-room";

export const TestRooms = () => {
  const rooms = [];

  if (!rooms.length)
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-6 rounded-md bg-foreground/5 max-sm:px-4">
        <span className="text-muted-foreground max-sm:text-center">
          There are no open rooms to join a multiplayer test
        </span>
        <CreateRoom />
      </div>
    );

  return (
    <div className="h-48 overflow-y-auto rounded-md bg-foreground/5">
      Test rooms
    </div>
  );
};
