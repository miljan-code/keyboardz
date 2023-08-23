import { NextRequest } from "next/server";

import { getLeaderboard } from "@/lib/queries";
import { LIMIT_PER_PAGE } from "@/config/leaderboard";
import { LeaderboardType } from "@/components/leaderboard/leaderboard-heading";

export async function GET(req: NextRequest) {
  const type =
    (req.nextUrl.searchParams.get("type") as LeaderboardType) || "All-Time";
  const time = Number(req.nextUrl.searchParams.get("time")) || 60;
  const page = Number(req.nextUrl.searchParams.get("page")) || 1;

  const limit = LIMIT_PER_PAGE;
  const offset = LIMIT_PER_PAGE * (page - 1);

  const data = await getLeaderboard(time, type, limit, offset);

  return new Response(JSON.stringify(data), { status: 200 });
}
