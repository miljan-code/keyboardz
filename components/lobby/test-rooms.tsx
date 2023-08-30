"use client";

import type { RoomWithParticipants } from "@/app/(multiplayer)/lobby/page";
import { useQuery } from "@tanstack/react-query";

import { CreateRoom } from "@/components/lobby/create-room";
import { TestRoom } from "@/components/lobby/test-room";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface TestRoomsProps {
  initialRooms: RoomWithParticipants[];
}

export const TestRooms = ({ initialRooms }: TestRoomsProps) => {
  const { data: rooms } = useQuery({
    queryKey: ["test-rooms"],
    queryFn: async () => {
      const res = await fetch("/api/rooms", { cache: "no-store" });
      return (await res.json()) as RoomWithParticipants[];
    },
    initialData: initialRooms,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return (
    <div>
      <div className="flex justify-between px-4 py-2 text-sm text-muted-foreground">
        <div className="hidden flex-1 lg:block">Room name</div>
        <div className="sm:max-md:mr-6 md:mr-0 md:flex-1">Host</div>
        <div className="sm:flex-1">Test mode</div>
        <div className="hidden flex-1 sm:block">Minimum WPM</div>
        <div className="flex justify-end sm:flex-1">Users</div>
      </div>
      <div className="h-80 overflow-y-auto rounded-md bg-foreground/5">
        {rooms.length ? (
          rooms.map((room) => <TestRoom key={room.id} room={room} />)
        ) : (
          <>
            <span className="flex h-full items-center justify-center px-6 text-center text-muted-foreground">
              There are no open public rooms to join a multiplayer test.
              <br className="hidden md:block" /> You can still join private ones
              or create a new room.
            </span>
          </>
        )}
      </div>
      <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-0">
        <div className="flex gap-2">
          <Input type="text" placeholder="Enter private room ID" />
          <Button variant="secondary">Join</Button>
        </div>
        <CreateRoom />
      </div>
    </div>
  );
};
