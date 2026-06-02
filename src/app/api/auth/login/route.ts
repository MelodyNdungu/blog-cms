import { NextRequest, NextResponse } from "next/server";
import {
  verifyPassword,
  verifyMagicToken,
  createSessionToken,
  SESSION_COOKIE,
  cookieOptions,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();

  let authenticated = false;

  if (typeof body.password === "string") {
    authenticated = await verifyPassword(body.password);
  } else if (typeof body.token === "string") {
    authenticated = await verifyMagicToken(body.token);
  }

  if (!authenticated) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const sessionToken = await createSessionToken();
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, sessionToken, cookieOptions());
  return response;
}
