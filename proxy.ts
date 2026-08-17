import { NextRequest, NextResponse } from "next/server";
import { DASHBOARD_COOKIE, verifyDashboardSession } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/dashboard/login" || pathname.startsWith("/api/dashboard/auth/")) {
    return NextResponse.next();
  }

  const valid = await verifyDashboardSession(request.cookies.get(DASHBOARD_COOKIE)?.value);
  if (valid) return NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/api/dashboard/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/dashboard/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/dashboard/:path*"],
};
