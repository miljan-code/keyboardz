import { atom } from "jotai";
import type { Socket } from "socket.io-client";

export const socketAtom = atom<Socket | null>(null);
