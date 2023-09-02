import type { Session } from "next-auth";

import type { Room } from "@/db/schema";
import type { Message } from "@/components/lobby/room-chat";

export type UserJoinRoomPayload = {
  userId: Session["user"]["id"];
  roomId: Room["id"];
};

export type NotificationPayload = {
  title: string;
  description: string;
};

export type UpdateRoomPayload = {
  roomId: Room["id"];
};

export type MessagePayload = {
  username: string;
  message: string;
  roomId: Room["id"];
};

export interface ServerToClientEvents {
  updateRoomList: () => void;
  notification: (payload: NotificationPayload) => void;
  updateRoom: (payload: UpdateRoomPayload) => void;
  userEnteredRoom: (payload: UpdateRoomPayload) => void;
  newMessage: (payload: Message) => void;
}

export interface ClientToServerEvents {
  userJoinRoom: (payload: UserJoinRoomPayload) => void;
  userLeaveRoom: (payload: UserJoinRoomPayload) => void;
  sendMessage: (payload: MessagePayload) => void;
}
