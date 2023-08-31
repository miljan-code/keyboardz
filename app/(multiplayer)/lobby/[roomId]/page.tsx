import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq } from "drizzle-orm";

import { getSession } from "@/lib/auth";
import { cn, generateFallback } from "@/lib/utils";
import { rooms } from "@/db/schema";
import { Icons } from "@/components/icons";
import { Room } from "@/components/lobby/room";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const getRoomById = async (roomId: string) => {
  return await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
    with: {
      creator: true,
      participants: {
        with: {
          user: true,
        },
      },
    },
  });
};

interface RoomPageProps {
  params: {
    roomId: string;
  };
}

export default async function RoomPage({ params: { roomId } }: RoomPageProps) {
  const session = await getSession();
  const room = await getRoomById(roomId);

  if (!room) redirect("/lobby");
  if (!session) redirect("/");

  const roomIsFull = room.participants.length === room.maxUsers;

  return (
    <div className="space-y-8">
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
        <Room initialRoomData={room} session={session} />
      </div>
    </div>
  );
}
