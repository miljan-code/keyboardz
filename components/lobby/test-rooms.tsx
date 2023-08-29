"use client";

import type { RoomWithCreator } from "@/app/(multiplayer)/lobby/page";
import { useQuery } from "@tanstack/react-query";

import { CreateRoom } from "@/components/lobby/create-room";
import { TestRoom } from "@/components/lobby/test-room";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface TestRoomsProps {
  initialRooms: RoomWithCreator[];
}

export const TestRooms = ({ initialRooms }: TestRoomsProps) => {
  const { data: rooms } = useQuery({
    queryKey: ["test-rooms"],
    queryFn: async () => {
      const res = await fetch("/api/rooms", { cache: "no-store" });
      return (await res.json()) as RoomWithCreator[];
    },
    initialData: initialRooms,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return (
    <div>
      <div className="flex justify-between px-4 py-2 text-sm text-muted-foreground">
        <div className="flex-1">Room name</div>
        <div className="flex-1">Host</div>
        <div className="flex-1">Test mode</div>
        <div className="flex-1">Minimum WPM</div>
        <div className="flex flex-1 justify-end">Users</div>
      </div>
      <div className="h-80 overflow-y-auto rounded-md bg-foreground/5">
        {rooms.length ? (
          rooms.map((room) => <TestRoom key={room.id} room={room} />)
        ) : (
          <>
            <span className="text-muted-foreground max-sm:text-center">
              There are no open rooms to join a multiplayer test
            </span>
            <CreateRoom />
          </>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <Input type="text" placeholder="Enter private room ID" />
          <Button variant="secondary">Join</Button>
        </div>
        <CreateRoom />
      </div>
    </div>
  );
};
