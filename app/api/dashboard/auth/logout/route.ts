import { NextResponse } from "next/server";
import { DASHBOARD_COOKIE, dashboardCookieOptions } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(DASHBOARD_COOKIE, "", { ...dashboardCookieOptions(), maxAge: 0 });
  return response;
}
