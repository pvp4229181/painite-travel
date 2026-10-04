import { NextResponse } from "next/server";
import { checkCredentials, createSessionCookie, isAdminConfigured } from "@/lib/auth/session";

export const runtime = "nodejs";

// Lock an IP out for 15 minutes after 5 failed attempts. In-memory, so on
// serverless hosts it is per instance: a speed bump, not a guarantee.
const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;
const attempts = new Map();

function clientIp(request) {
  return (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || request.headers.get("x-real-ip") || "local";
}

export async function POST(request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "The admin login is not set up. Add ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SESSION_SECRET to the environment." },
      { status: 503 },
    );
  }

  const ip = clientIp(request);
  const entry = attempts.get(ip);
  if (entry?.lockedUntil > Date.now()) {
    const minutes = Math.ceil((entry.lockedUntil - Date.now()) / 60000);
    return NextResponse.json({ error: `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.` }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!checkCredentials(body.email, body.password)) {
    const count = (entry?.lockedUntil > Date.now() ? 0 : entry?.count ?? 0) + 1;
    attempts.set(ip, count >= MAX_ATTEMPTS ? { count: 0, lockedUntil: Date.now() + LOCK_MS } : { count, lockedUntil: 0 });
    return NextResponse.json({ error: "That email and password don't match." }, { status: 401 });
  }

  attempts.delete(ip);
  await createSessionCookie(String(body.email).trim().toLowerCase());
  return NextResponse.json({ ok: true });
}
