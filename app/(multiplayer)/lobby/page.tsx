import { getSession } from "@/lib/auth";
import { getOpenRooms } from "@/lib/queries";
import { LobbyStats } from "@/components/lobby/lobby-stats";
import { TestRooms } from "@/components/lobby/test-rooms";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export type RoomWithParticipants = Awaited<
  ReturnType<typeof getOpenRooms>
>[number];

export default async function LobbyPage() {
  const session = await getSession();
  const rooms = await getOpenRooms();

  if (!session) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col max-md:gap-2 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1 md:gap-2">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
            Lobby
          </h2>
          <span className="text-foreground/60">
            Test your typing skills with other users.
          </span>
        </div>
        <LobbyStats />
      </div>
      <TestRooms initialRooms={rooms} session={session} />
    </div>
  );
}
