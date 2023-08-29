import type { NextApiRequest } from "next";
import { db } from "@/db";
import type { NextApiResponseWithSocket } from "@/pages/api/socket/io";
import { createId } from "@paralleldrive/cuid2";
import { getServerSession } from "next-auth";
import * as z from "zod";

import { authOptions } from "@/lib/auth";
import { createRoomSchema } from "@/lib/validations/create-room-schema";
import { rooms } from "@/db/schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed " });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    // Check if its user authed
    if (!session) {
      return res.status(401).json({ error: "Not authorized" });
    }

    // Parse data
    const roomData = createRoomSchema.parse(req.body);

    // Create room
    const [room] = await db
      .insert(rooms)
      .values({
        ...roomData,
        id: createId(),
        creatorId: session.user.id,
        participantsIds: [],
      })
      .returning();

    res.socket.server.io.emit("created_room", room);

    return res.status(201).json(room);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json(error.issues);
    }

    return res.status(500).json({ error: "Something went wrong " });
  }
}
