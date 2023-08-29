"use client";

import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";

import { socketAtom } from "@/lib/store/socket-store";
import type { Room } from "@/db/schema";
import { CreateRoom } from "@/components/lobby/create-room";

interface TestRoomsProps {
  initialRooms: Room[];
}

export const TestRooms = ({ initialRooms }: TestRoomsProps) => {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const socket = useAtomValue(socketAtom);

  useEffect(() => {
    if (!socket) return;

    socket.on("created_room", (room: Room) => {
      console.log("Catching created_room event");
      console.log(room);
      setRooms([...rooms, room]);
    });

    return () => {
      socket.off("created_room");
    };
  }, [socket, rooms]);

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
      {rooms.map((room) => (
        <div key={room.id}>{room.roomName}</div>
      ))}
    </div>
  );
};
