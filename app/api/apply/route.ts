import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getApplicationWindowStatus } from "@/lib/config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { validateApplicationSubmission } from "@/lib/validation";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(request: Request) {
  const window = getApplicationWindowStatus();
  if (!window.isOpen) {
    return NextResponse.json({ error: window.reason === "not_opened" ? "Đơn chưa mở" : "Đơn đã đóng" }, { status: 403 });
  }

  try {
    const rawBody: unknown = await request.json();
    const bodyRecord = rawBody && typeof rawBody === "object" ? (rawBody as Record<string, unknown>) : {};

    // 1. Verify Cloudflare Turnstile token
    const turnstileToken =
      typeof bodyRecord.turnstile_token === "string"
        ? bodyRecord.turnstile_token
        : typeof bodyRecord["cf-turnstile-response"] === "string"
          ? (bodyRecord["cf-turnstile-response"] as string)
          : undefined;

    const remoteIp =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

    const turnstileCheck = await verifyTurnstileToken(turnstileToken, remoteIp);
    if (!turnstileCheck.success) {
      return NextResponse.json(
        { error: turnstileCheck.error || "Xác thực bảo mật không thành công" },
        { status: 400 },
      );
    }

    const application = validateApplicationSubmission(rawBody);
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("applications")
      .insert({
        full_name: application.full_name,
        email: application.email.toLowerCase(),
        phone: application.phone,
        facebook_url: application.facebook_url,
        student_year: application.student_year,
        student_id: application.student_id,
        date_of_birth: application.date_of_birth,
        university: application.university,
        department: application.department,
        gender: application.gender,
        major: application.major,
        answers: application.answers,
      })
      .select("id, submitted_at, status")
      .single();

    if (error) {
      console.error("Failed to insert application", error);
      return NextResponse.json({ error: "Không thể lưu đơn đăng ký" }, { status: 500 });
    }
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Dữ liệu không hợp lệ", details: error.issues }, { status: 422 });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "JSON không hợp lệ" }, { status: 400 });
    }
    console.error("Apply request failed", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi máy chủ" }, { status: 500 });
  }
}
