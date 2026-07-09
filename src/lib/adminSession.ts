// Signed session cookie for gating the CMS in local/dev mode, where the
// "local" Keystatic storage kind has no built-in auth of its own - any
// request to /api/keystatic/* would otherwise read/write the filesystem
// for anyone who can reach the dev server. Not used in production
// (GitHub storage mode): there, Keystatic's own GitHub OAuth cookie is
// the auth signal - see src/middleware.ts.
import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours, in seconds

// Keystatic's own GitHub OAuth cookies (set by
// /api/keystatic/github/oauth/callback, cleared by /api/keystatic/github/logout).
// Named here so the logout route can clear them without duplicating the
// literal strings used in src/middleware.ts.
export const GITHUB_ACCESS_TOKEN_COOKIE = "keystatic-gh-access-token";
export const GITHUB_REFRESH_TOKEN_COOKIE = "keystatic-gh-refresh-token";

// Every cookie name that can represent an active admin session, in either
// mode - used by /api/admin-logout to clear "whichever is active" without
// needing to branch on isProductionCms() itself.
export const ALL_SESSION_COOKIES = [
  ADMIN_SESSION_COOKIE,
  GITHUB_ACCESS_TOKEN_COOKIE,
  GITHUB_REFRESH_TOKEN_COOKIE,
] as const;

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function createSessionToken(secret: string): string {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${sign(issuedAt, secret)}`;
}

export function verifySessionToken(
  token: string | undefined,
  secret: string
): boolean {
  if (!token) return false;
  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;

  const expected = sign(issuedAt, secret);
  const signatureBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (signatureBuf.length !== expectedBuf.length) return false;
  if (!timingSafeEqual(signatureBuf, expectedBuf)) return false;

  const age = Date.now() - Number(issuedAt);
  if (!Number.isFinite(age) || age < 0 || age > ADMIN_SESSION_MAX_AGE * 1000) {
    return false;
  }
  return true;
}

export const ADMIN_DASHBOARD_PATH = "/admin";

// Only accept same-site, path-relative redirect targets. A value starting
// with "//" is protocol-relative (e.g. "//evil.com") and browsers treat it
// as an absolute URL, so it's rejected too, not just "http://..." ones.
export function sanitizeRedirect(value: string | null | undefined): string {
  if (value && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return ADMIN_DASHBOARD_PATH;
}
