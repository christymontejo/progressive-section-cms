import type { APIRoute } from "astro";
import { timingSafeEqual } from "node:crypto";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createSessionToken,
  sanitizeRedirect,
} from "~/lib/adminSession";
import { isProductionCms } from "~/lib/cms";

export const prerender = false;

// Dev-only password gate for local storage mode - never used in
// production (GitHub storage mode uses Keystatic's own OAuth flow instead,
// see /api/keystatic/github/login). Reachable when unauthenticated by
// design (it's the thing that authenticates you) - src/middleware.ts
// excludes this path from gating.
export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (isProductionCms()) {
    return new Response("Not Found", { status: 404 });
  }

  const sessionSecret = import.meta.env.ADMIN_SESSION_SECRET;
  const expectedPassword = import.meta.env.ADMIN_LOCAL_PASSWORD;
  if (!sessionSecret || !expectedPassword) {
    return new Response(
      "Local admin login is not configured: set ADMIN_LOCAL_PASSWORD and ADMIN_SESSION_SECRET.",
      { status: 500 }
    );
  }

  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  // Sanitize server-side too - never trust the hidden field's value as-is,
  // it only exists client-side to carry the already-sanitized target
  // through the POST.
  const redirectTarget = sanitizeRedirect(String(form.get("redirect") ?? ""));

  const providedBuf = Buffer.from(password);
  const expectedBuf = Buffer.from(expectedPassword);
  // Never render the password back or say which part was wrong - a single
  // generic error param covers both "no such user" and "wrong password"
  // (there's only one account here, but the principle still applies).
  const isValid =
    providedBuf.length === expectedBuf.length &&
    timingSafeEqual(providedBuf, expectedBuf);

  if (!isValid) {
    return redirect(
      `/admin/login?error=1&redirect=${encodeURIComponent(redirectTarget)}`
    );
  }

  cookies.set(ADMIN_SESSION_COOKIE, createSessionToken(sessionSecret), {
    path: "/",
    httpOnly: true,
    secure: isProductionCms(),
    sameSite: "lax",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });

  return redirect(redirectTarget);
};
