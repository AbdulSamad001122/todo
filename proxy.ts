import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decryptSession } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (
    path.startsWith("/_next") ||
    path.startsWith("/static") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get("session")?.value;
  const payload = sessionToken ? decryptSession(sessionToken) : null;
  const isAuth = payload && new Date(payload.expiresAt) > new Date();

  const isLoginPath = path === "/login";

  if (!isAuth) {
    if (path.startsWith("/api/")) {
      return NextResponse.next();
    }
    if (!isLoginPath) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  } else {
    if (isLoginPath) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
