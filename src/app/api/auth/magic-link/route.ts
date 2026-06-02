import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, createMagicToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Only authenticated admins can generate magic links
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(sessionToken))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await createMagicToken();
  const origin = request.headers.get("origin") ?? "http://localhost:3000";
  const link = `${origin}/admin/login?token=${encodeURIComponent(token)}`;

  return NextResponse.json({ link, expiresIn: "15 minutes" });
}
