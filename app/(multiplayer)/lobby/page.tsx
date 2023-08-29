import { getOpenRooms } from "@/lib/queries";
import { TestRooms } from "@/components/lobby/test-rooms";

export type RoomWithCreator = Awaited<ReturnType<typeof getOpenRooms>>[number];

export default async function LobbyPage() {
  const rooms = await getOpenRooms();

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
        <div className="flex gap-3 text-foreground/60 max-md:text-sm">
          <p>
            Users online: <span className="text-foreground">14</span>
          </p>
          <p>
            Active tests: <span className="text-foreground">2</span>
          </p>
        </div>
      </div>
      <TestRooms initialRooms={rooms} />
    </div>
  );
}
