import { getSession } from "@/lib/auth";
import { getRoomById } from "@/lib/queries";

interface HandlerParams {
  params: {
    roomId: string;
  };
}

export async function GET(req: Request, { params }: HandlerParams) {
  try {
    const session = await getSession();

    if (!session) {
      return new Response("Not authorized", { status: 401 });
    }

    if (!params.roomId) {
      return new Response("Room ID is missing", { status: 422 });
    }

    const data = await getRoomById(params.roomId);

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
}
