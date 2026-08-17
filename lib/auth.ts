export const DASHBOARD_COOKIE = "gdgoc_dashboard_session";
const SESSION_HOURS = Number(process.env.DASHBOARD_SESSION_HOURS ?? 8);

type SessionPayload = { exp: number };

function secret() {
  const value = process.env.DASHBOARD_SESSION_SECRET ?? process.env.DASHBOARD_PASSWORD;
  if (!value) throw new Error("Missing DASHBOARD_SESSION_SECRET or DASHBOARD_PASSWORD");
  return value;
}

function encode(value: string) {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decode(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return atob(padded);
}

async function signingKey() {
  return crypto.subtle.importKey("raw", new TextEncoder().encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

async function sign(payload: string) {
  const signature = await crypto.subtle.sign("HMAC", await signingKey(), new TextEncoder().encode(payload));
  return encode(String.fromCharCode(...new Uint8Array(signature)));
}

export async function createDashboardSession() {
  const payload = encode(JSON.stringify({ exp: Date.now() + SESSION_HOURS * 60 * 60 * 1000 } satisfies SessionPayload));
  return `${payload}.${await sign(payload)}`;
}

export async function verifyDashboardSession(token: string | undefined) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  try {
    const rawSignature = decode(signature);
    const valid = await crypto.subtle.verify("HMAC", await signingKey(), Uint8Array.from(rawSignature, (character) => character.charCodeAt(0)), new TextEncoder().encode(payload));
    if (!valid) return false;
    const session = JSON.parse(decode(payload)) as SessionPayload;
    return typeof session.exp === "number" && session.exp > Date.now();
  } catch {
    return false;
  }
}

export function dashboardCookieOptions() {
  return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: Math.max(1, SESSION_HOURS) * 60 * 60 };
}
