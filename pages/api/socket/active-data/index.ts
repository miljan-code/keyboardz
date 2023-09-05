import { NextApiRequest } from "next";
import { db } from "@/db";
import { eq, sql } from "drizzle-orm";

import { rooms } from "@/db/schema";

import { NextApiResponseServerIO } from "@/types/next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const onlineUsers = res.socket.server.io.engine.clientsCount as number;

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(rooms)
      .where(eq(rooms.isActiveRoom, true));

    const onlineData = { onlineUsers, activeRooms: count };

    return res.status(201).json(onlineData);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong " });
  }
}
