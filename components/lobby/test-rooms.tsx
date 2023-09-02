"use client";

import { useState } from "react";
import type { RoomWithParticipants } from "@/app/(multiplayer)/lobby/page";
import { useQuery } from "@tanstack/react-query";
import type { Session } from "next-auth";

import type { Room } from "@/db/schema";
import { CreateRoom } from "@/components/lobby/create-room";
import { TestRoom } from "@/components/lobby/test-room";
import { useSocket } from "@/components/socket-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TestRoomsProps {
  initialRooms: RoomWithParticipants[];
  session: Session;
}

export const TestRooms = ({ initialRooms, session }: TestRoomsProps) => {
  const [roomId, setRoomId] = useState<Room["id"]>("");

  const socket = useSocket();

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

  const handleJoinRoomById = () => {
    socket?.emit("userJoinRoom", {
      userId: session.user.id,
      roomId: roomId,
    });
  };

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
          rooms.map((room) => (
            <TestRoom key={room.id} room={room} session={session} />
          ))
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
          <Input
            type="text"
            placeholder="Enter private room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <Button onClick={handleJoinRoomById} variant="secondary">
            Join
          </Button>
        </div>
        <CreateRoom session={session} />
      </div>
    </div>
  );
};
