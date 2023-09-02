"use client";

import { useQuery } from "@tanstack/react-query";

type OnlineData = {
  onlineUsers: number;
  activeRooms: number;
};

export const LobbyStats = () => {
  const { data } = useQuery({
    queryKey: ["updateActiveUsers"],
    queryFn: async () => {
      const res = await fetch("/api/socket/users");
      return (await res.json()) as OnlineData;
    },
  });

  if (!data) return null;

  return (
    <div className="flex gap-3 text-foreground/60 max-md:text-sm">
      <p>
        Users online:{" "}
        <span className="text-foreground">{data.onlineUsers}</span>
      </p>
      <p>
        Open rooms: <span className="text-foreground">{data.activeRooms}</span>
      </p>
    </div>
  );
};
