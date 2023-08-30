import type { NextApiRequest } from "next";
import { db } from "@/db";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import * as z from "zod";

import { authOptions } from "@/lib/auth";
import { createRoomSchema } from "@/lib/validations/create-room-schema";
import { participants, rooms } from "@/db/schema";

import type { NextApiResponseServerIO } from "@/types/next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO,
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

    // Create room & participant
    const room = await db.transaction(async (tx) => {
      const roomId = createId();

      await tx
        .insert(rooms)
        .values({ ...roomData, id: roomId, creatorId: session.user.id });
      await tx
        .insert(participants)
        .values({ id: createId(), roomId, userId: session.user.id });

      const [selectedRoom] = await tx
        .select()
        .from(rooms)
        .where(eq(rooms.id, roomId));

      return selectedRoom;
    });

    res.socket.server.io.emit("createdRoom");

    return res.status(201).json(room);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json(error.issues);
    }

    return res.status(500).json({ error: "Something went wrong " });
  }
}
