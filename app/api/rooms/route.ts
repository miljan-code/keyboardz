import { getSession } from "@/lib/auth";
import { getOpenRooms } from "@/lib/queries";

export async function GET(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return new Response("Not authorized", { status: 401 });
    }

    const data = await getOpenRooms();

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
}
