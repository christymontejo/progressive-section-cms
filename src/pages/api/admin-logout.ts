import type { APIRoute } from "astro";
import { ALL_SESSION_COOKIES } from "~/lib/adminSession";

export const prerender = false;

// Clears every cookie that can represent an active admin session, in
// either mode, so this works regardless of whether the caller is on local
// storage (admin_session) or GitHub storage (keystatic-gh-*), without
// needing to branch on isProductionCms() itself. Must stay reachable even
// when "authenticated" state is broken/expired - src/middleware.ts
// excludes this path from gating, or a broken session becomes
// unrecoverable without clearing cookies by hand.
export const GET: APIRoute = async ({ cookies, redirect }) => {
  for (const name of ALL_SESSION_COOKIES) {
    cookies.delete(name, { path: "/" });
  }
  return redirect("/admin/login");
};
