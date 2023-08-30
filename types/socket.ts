import type { Session } from "next-auth";

import type { Room } from "@/db/schema";

export type UserJoinRoomPayload = {
  userId: Session["user"]["id"];
  roomId: Room["id"];
};

export type SendNotificationPayload = {
  title: string;
  description: string;
};

export type UpdateRoomPayload = {
  roomId: Room["id"];
};

export interface ServerToClientEvents {
  createdRoom: () => void;
  sendNotification: (payload: SendNotificationPayload) => void;
  updateRoom: (payload: UpdateRoomPayload) => void;
}

export interface ClientToServerEvents {
  userJoinRoom: (payload: UserJoinRoomPayload) => void;
}
