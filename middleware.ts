import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const restrictedPaths = ["/profile", "/lobby"];
  const requestedPath = req.nextUrl.pathname;
  const token = await getToken({ req });

  if (!token && restrictedPaths.includes(requestedPath)) {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
