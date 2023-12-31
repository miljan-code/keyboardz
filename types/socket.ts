import type { Session } from "next-auth";

import type { Room } from "@/db/schema";
import type { Message } from "@/components/lobby/room-chat";

import type { TestMode, WpmStats } from "@/types/test";

export type UserJoinRoomPayload = {
  userId: Session["user"]["id"];
  roomId: Room["id"];
};

export type UserLeaveRoomPayload = UserJoinRoomPayload & {
  username: Session["user"]["name"];
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

export type GameStartedPayload = {
  text: string;
  roomId: string;
};

export type SubmitResultPayload = {
  text: string;
  testMode: TestMode;
  roomId: Room["id"];
  user: Session["user"];
  wpmStats: WpmStats;
};

export type UpdateResultsPayload = Pick<
  SubmitResultPayload,
  "user" | "wpmStats"
>;

export interface ServerToClientEvents {
  updateRoomList: () => void;
  notification: (payload: NotificationPayload) => void;
  updateRoom: (payload: RoomIdPayload) => void;
  userEnteredRoom: (payload: RoomIdPayload) => void;
  newMessage: (payload: Message) => void;
  gameStarted: (payload: GameStartedPayload) => void;
  updateResults: () => void;
}

export interface ClientToServerEvents {
  userJoinRoom: (payload: UserJoinRoomPayload) => void;
  userLeaveRoom: (payload: UserLeaveRoomPayload) => void;
  sendMessage: (payload: MessagePayload) => void;
  startGame: (payload: RoomPayload) => void;
  submitResult: (payload: SubmitResultPayload) => void;
  removeResult: (payload: UserJoinRoomPayload) => void;
}
