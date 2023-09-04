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

export type RoomIdPayload = {
  roomId: Room["id"];
};

export type RoomPayload = {
  room: Room;
};

export type MessagePayload = {
  username: string;
  message: string;
  roomId: Room["id"];
};

export type StartGamePayload = {
  text: string;
  roomId: string;
};

export interface ServerToClientEvents {
  updateRoomList: () => void;
  notification: (payload: NotificationPayload) => void;
  updateRoom: (payload: RoomIdPayload) => void;
  userEnteredRoom: (payload: RoomIdPayload) => void;
  newMessage: (payload: Message) => void;
  startGame: (payload: StartGamePayload) => void;
}

export interface ClientToServerEvents {
  userJoinRoom: (payload: UserJoinRoomPayload) => void;
  userLeaveRoom: (payload: UserJoinRoomPayload) => void;
  sendMessage: (payload: MessagePayload) => void;
  startGame: (payload: RoomPayload) => void;
}
