import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getApplicationWindowStatus } from "@/lib/config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { validateApplicationSubmission } from "@/lib/validation";

const RATE_LIMIT_WINDOW_MS = Number(process.env.APPLY_RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000);
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.APPLY_RATE_LIMIT_MAX_REQUESTS ?? 5);
const CAPTCHA_VERIFY_TIMEOUT_MS = Number(process.env.CAPTCHA_VERIFY_TIMEOUT_MS ?? 5000);

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function cleanIp(ip: string) {
  return ip.trim().replace(/^\[|\]$/g, "");
}

function getClientIp(request: NextRequest) {
  const candidates = [
    request.headers.get("cf-connecting-ip"),
    request.headers.get("true-client-ip"),
    request.headers.get("x-real-ip"),
    request.headers.get("x-forwarded-for")?.split(",")[0],
    "unknown",
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const ip = cleanIp(candidate);
    if (ip) return ip;
  }
  return "unknown";
}

function consumeRateLimit(ip: string) {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  if (!record || now >= record.resetAt) {
    const resetAt = now + RATE_LIMIT_WINDOW_MS;
    rateLimitStore.set(ip, { count: 1, resetAt });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, retryAfter: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000) };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0, retryAfter: Math.max(1, Math.ceil((record.resetAt - now) / 1000)) };
  }

  record.count += 1;
  rateLimitStore.set(ip, record);
  return {
    allowed: true,
    remaining: Math.max(0, RATE_LIMIT_MAX_REQUESTS - record.count),
    retryAfter: Math.max(1, Math.ceil((record.resetAt - now) / 1000)),
  };
}

async function verifyCaptchaToken(token: string, ip: string) {
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CAPTCHA_VERIFY_TIMEOUT_MS);

  try {
    if (turnstileSecret) {
      const form = new URLSearchParams({
        secret: turnstileSecret,
        response: token,
      });
      if (ip !== "unknown") form.set("remoteip", ip);
      const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: form,
        signal: controller.signal,
      });
      if (!res.ok) return { ok: false, reason: "captcha_provider_error" as const };
      const data = (await res.json()) as { success?: boolean };
      return { ok: data.success === true, reason: data.success === true ? null : ("captcha_invalid" as const) };
    }

    if (recaptchaSecret) {
      const form = new URLSearchParams({
        secret: recaptchaSecret,
        response: token,
      });
      if (ip !== "unknown") form.set("remoteip", ip);
      const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        body: form,
        signal: controller.signal,
      });
      if (!res.ok) return { ok: false, reason: "captcha_provider_error" as const };
      const data = (await res.json()) as { success?: boolean };
      return { ok: data.success === true, reason: data.success === true ? null : ("captcha_invalid" as const) };
    }

    return { ok: false, reason: "captcha_not_configured" as const };
  } catch {
    return { ok: false, reason: "captcha_provider_error" as const };
  } finally {
    clearTimeout(timeout);
  }
}

function sanitizeIdempotencyKey(raw: string | null) {
  if (!raw) return null;
  const normalized = raw.trim();
  if (!normalized) return null;
  return normalized.slice(0, 255);
}

function logApplyEvent(meta: Record<string, unknown>) {
  console.info("apply_submission_event", meta);
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const idempotencyKey = sanitizeIdempotencyKey(request.headers.get("idempotency-key"));

  if (!idempotencyKey) {
    logApplyEvent({ outcome: "blocked", reason: "missing_idempotency_key", ip, userAgent });
    return NextResponse.json({ error: "Thiếu Idempotency-Key" }, { status: 400 });
  }

  const rate = consumeRateLimit(ip);
  if (!rate.allowed) {
    logApplyEvent({ outcome: "blocked", reason: "rate_limited", ip, userAgent, idempotencyKey });
    return NextResponse.json(
      { error: "Bạn thao tác quá nhanh. Vui lòng thử lại sau." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
    );
  }

  const window = getApplicationWindowStatus();
  if (!window.isOpen) {
    logApplyEvent({
      outcome: "blocked",
      reason: window.reason === "not_opened" ? "window_not_opened" : "window_closed",
      ip,
      userAgent,
      idempotencyKey,
    });
    return NextResponse.json({ error: window.reason === "not_opened" ? "Đơn chưa mở" : "Đơn đã đóng" }, { status: 403 });
  }

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      logApplyEvent({ outcome: "blocked", reason: "invalid_payload_shape", ip, userAgent, idempotencyKey });
      return NextResponse.json({ error: "Payload không hợp lệ" }, { status: 400 });
    }

    const captchaToken =
      typeof (body as Record<string, unknown>).captcha_token === "string"
        ? (body as Record<string, unknown>).captcha_token.trim()
        : "";
    if (!captchaToken) {
      logApplyEvent({ outcome: "blocked", reason: "missing_captcha_token", ip, userAgent, idempotencyKey });
      return NextResponse.json({ error: "Thiếu mã xác thực captcha" }, { status: 422 });
    }

    const captcha = await verifyCaptchaToken(captchaToken, ip);
    if (!captcha.ok) {
      const status = captcha.reason === "captcha_not_configured" ? 503 : 403;
      logApplyEvent({ outcome: "blocked", reason: captcha.reason, ip, userAgent, idempotencyKey });
      return NextResponse.json({ error: "Xác thực captcha thất bại" }, { status });
    }

    const application = validateApplicationSubmission(body);
    const supabase = createSupabaseAdminClient();

    const { data: byIdempotency, error: byIdempotencyError } = await supabase
      .from("applications")
      .select("id, submitted_at, status")
      .eq("idempotency_key", idempotencyKey)
      .maybeSingle();
    if (byIdempotencyError) {
      console.error("Failed to lookup idempotency key", byIdempotencyError);
      return NextResponse.json({ error: "Không thể xử lý đơn đăng ký lúc này" }, { status: 500 });
    }
    if (byIdempotency) {
      logApplyEvent({ outcome: "accepted_existing", reason: "idempotent_replay", ip, userAgent, idempotencyKey });
      return NextResponse.json({ data: byIdempotency, idempotent: true }, { status: 200 });
    }

    const openAtIso = window.openAt.toISOString();
    const closeAtIso = window.closeAt.toISOString();
    const { data: existingInWindow, error: duplicateError } = await supabase
      .from("applications")
      .select("id")
      .eq("email", application.email.toLowerCase())
      .eq("student_id", application.student_id)
      .gte("submitted_at", openAtIso)
      .lte("submitted_at", closeAtIso)
      .limit(1);
    if (duplicateError) {
      console.error("Failed to check duplicate application", duplicateError);
      return NextResponse.json({ error: "Không thể kiểm tra đơn trùng lặp" }, { status: 500 });
    }
    if (existingInWindow && existingInWindow.length > 0) {
      logApplyEvent({ outcome: "blocked", reason: "duplicate_submission", ip, userAgent, idempotencyKey });
      return NextResponse.json({ error: "Bạn đã nộp đơn cho đợt tuyển này rồi" }, { status: 409 });
    }

    const { data, error } = await supabase
      .from("applications")
      .insert({
        idempotency_key: idempotencyKey,
        client_ip: ip,
        user_agent: userAgent,
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
      if (error.code === "23505") {
        const { data: existing } = await supabase
          .from("applications")
          .select("id, submitted_at, status")
          .eq("idempotency_key", idempotencyKey)
          .maybeSingle();
        if (existing) {
          logApplyEvent({ outcome: "accepted_existing", reason: "idempotency_conflict", ip, userAgent, idempotencyKey });
          return NextResponse.json({ data: existing, idempotent: true }, { status: 200 });
        }
      }
      console.error("Failed to insert application", error);
      return NextResponse.json({ error: "Không thể lưu đơn đăng ký" }, { status: 500 });
    }
    logApplyEvent({ outcome: "accepted_new", ip, userAgent, idempotencyKey, applicationId: data.id });
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      logApplyEvent({ outcome: "blocked", reason: "validation_failed", ip, userAgent, idempotencyKey });
      return NextResponse.json({ error: "Dữ liệu không hợp lệ", details: error.issues }, { status: 422 });
    }
    if (error instanceof SyntaxError) {
      logApplyEvent({ outcome: "blocked", reason: "invalid_json", ip, userAgent, idempotencyKey });
      return NextResponse.json({ error: "JSON không hợp lệ" }, { status: 400 });
    }
    console.error("Apply request failed", error);
    logApplyEvent({ outcome: "error", reason: "unexpected_error", ip, userAgent, idempotencyKey });
    return NextResponse.json({ error: "Đã xảy ra lỗi máy chủ" }, { status: 500 });
  }
}
