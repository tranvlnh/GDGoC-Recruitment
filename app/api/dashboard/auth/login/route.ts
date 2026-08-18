import { NextResponse } from "next/server";
import { z } from "zod";
import { createDashboardSession, DASHBOARD_COOKIE, dashboardCookieOptions } from "@/lib/auth";

const schema = z.object({ password: z.string().min(1) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Mật khẩu là bắt buộc" }, { status: 400 });
  if (!process.env.DASHBOARD_PASSWORD) {
    console.error("DASHBOARD_PASSWORD is not configured");
    return NextResponse.json({ error: "Dashboard chưa được cấu hình" }, { status: 503 });
  }
  if (parsed.data.password !== process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: "Mật khẩu không đúng" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(DASHBOARD_COOKIE, await createDashboardSession(), dashboardCookieOptions());
  return response;
}
