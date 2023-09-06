"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import type { Session } from "next-auth";

import { socket } from "@/lib/socket";
import type { Room } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type Message = {
  username: string;
  message: string;
};

interface RoomChatProps {
  session: Session;
  roomId: Room["id"];
}

export const RoomChat = ({ session, roomId }: RoomChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  const messagesDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesDivRef.current) {
      messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const updateMessages = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("newMessage", updateMessages);

    return () => {
      socket.off("newMessage", updateMessages);
    };
  }, []);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();

    if (!session.user.name || !inputValue.length) return;

    const message = {
      username: session.user.name,
      message: inputValue,
    };

    socket.emit("sendMessage", {
      ...message,
      roomId,
    });

    setMessages([...messages, message]);

    setInputValue("");
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div
        ref={messagesDivRef}
        className="scroll flex h-96 flex-col gap-0.5 overflow-y-auto px-4 py-2"
      >
        {messages.map((message, i) => (
          <div
            key={message.message + i}
            className="flex items-center gap-4 text-sm"
          >
            <span className="text-foreground/60">{message.username}</span>
            <p>{message.message}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="mt-auto flex">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="rounded-none border-none bg-foreground/10 focus-visible:ring-0"
          placeholder="Enter a message"
        />
        <Button
          type="submit"
          className="h-auto rounded-none"
          size="sm"
          variant="secondary"
        >
          Send
        </Button>
      </form>
    </div>
  );
};
