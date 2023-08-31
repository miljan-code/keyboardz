import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { getRoomById } from "@/lib/queries";
import { Room } from "@/components/lobby/room";

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

  return (
    <div className="space-y-8">
      <Room initialRoomData={room} session={session} />
    </div>
  );
}
