import { NextRequest, NextResponse } from "next/server";
import {
  verifySessionToken,
  verifyMagicToken,
  createSessionToken,
  SESSION_COOKIE,
  cookieOptions,
} from "@/lib/auth";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page itself through
  if (pathname === "/admin/login") return NextResponse.next();

  // Auto-login via magic link token in query param
  const magicToken = request.nextUrl.searchParams.get("token");
  if (magicToken && (await verifyMagicToken(magicToken))) {
    const sessionToken = await createSessionToken();
    // Redirect to the same path but without the token in the URL
    const destination = new URL(pathname, request.url);
    const response = NextResponse.redirect(destination);
    response.cookies.set(SESSION_COOKIE, sessionToken, cookieOptions());
    return response;
  }

  // Check session cookie
  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(sessionToken))) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
