import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, sessionSecret, signSession, verifySession } from "./token";

/** True when the admin login is fully configured in the environment. */
export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && sessionSecret());
}

const digest = (s) => createHash("sha256").update(String(s ?? "")).digest();

/** Constant-time check of the submitted credentials against the environment. */
export function checkCredentials(email, password) {
  if (!isAdminConfigured()) return false;
  const emailOk = timingSafeEqual(digest(String(email).trim().toLowerCase()), digest(process.env.ADMIN_EMAIL.trim().toLowerCase()));
  const passOk = timingSafeEqual(digest(password), digest(process.env.ADMIN_PASSWORD));
  return emailOk && passOk;
}

export async function createSessionCookie(email) {
  const now = Math.floor(Date.now() / 1000);
  const token = await signSession({ sub: email, iat: now, exp: now + SESSION_TTL_SECONDS });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getAdminSession() {
  return verifySession((await cookies()).get(SESSION_COOKIE)?.value);
}

/** For admin pages: redirects to the login screen when not signed in. */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

/**
 * For admin API routes. Returns an error response to send, or null to continue.
 * Mutations must also come from this site (Origin check) as CSRF protection.
 */
export async function guardAdminApi(request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Your session has ended. Please sign in again." }, { status: 401 });
  }
  if (request.method !== "GET" && request.method !== "HEAD") {
    const origin = request.headers.get("origin");
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    let sameSite = false;
    try {
      sameSite = Boolean(origin) && new URL(origin).host === host;
    } catch {}
    if (!sameSite) return NextResponse.json({ error: "Request blocked." }, { status: 403 });
  }
  return null;
}
