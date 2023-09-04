import { getRoomById } from "@/lib/queries";
import { MutliplayerTest } from "@/components/lobby/multiplayer-test";

import type { TestMode } from "@/types/test";

interface MultiplayerTestPageProps {
  params: {
    roomId: string;
  };
}

export default async function MultiplayerTestPage({
  params: { roomId },
}: MultiplayerTestPageProps) {
  const room = await getRoomById(roomId);

  if (!room) return null;

  const testMode: TestMode = {
    mode: room.mode as TestMode["mode"],
    amount: room.amount,
  };

  return (
    <div className="grid h-full grid-flow-row grid-rows-[auto_1fr_auto]">
      <div className="">Other players stats</div>
      <div className="flex h-full items-center justify-center">
        <MutliplayerTest testMode={testMode} />
      </div>
      <div className="">Exit test</div>
    </div>
  );
}
