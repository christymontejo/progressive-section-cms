import { defineMiddleware } from "astro:middleware";
import {
  ADMIN_SESSION_COOKIE,
  GITHUB_ACCESS_TOKEN_COOKIE,
  verifySessionToken,
} from "~/lib/adminSession";
import { isProductionCms } from "~/lib/cms";

const LOGIN_PATH = "/admin/login";
const ACCESS_DENIED_PATH = "/admin/access-denied";
const LOGOUT_PATH = "/api/admin-logout";
const LOGIN_API_PATH = "/api/admin-login";

// Keystatic's own "authenticated but no repo access" screen (see
// githubRepoNotFound in @keystatic/core, which redirects here). Its
// default copy is generic and invites installing the app - the wrong
// message for someone never meant to have access - so we intercept it and
// send them to our own branded page instead. Only reachable once already
// authenticated with GitHub.
const KEYSTATIC_REPO_NOT_FOUND_PATH = "/keystatic/repo-not-found";

// -----------------------------------------------------------------------
// Route reachability, reasoned about explicitly per route:
//
// Reachable when unauthenticated / when the session is broken (never
// gated, checked first and returned early):
//   - /admin/login        the login page itself
//   - /api/admin-login    its POST handler (that's what authenticates you)
//   - /api/admin-logout   must work even with an expired/corrupt session,
//                         or a broken session becomes unrecoverable
//   - /admin/access-denied  reached only after successful GitHub auth but
//                         failed repo access - must stay reachable so that
//                         state has somewhere to land
//   - /api/keystatic/github/*  the OAuth handshake itself; gating it would
//                         break login before it can set its own cookie
//
// Protected (require an active session):
//   - /admin, /admin/*    the dashboard (except the two public /admin/*
//                         paths above)
//   - /keystatic, /keystatic/*   the CMS editor UI
//   - /api/keystatic/*    ONLY in local/dev mode - local storage has no
//                         auth of its own. In production (GitHub storage)
//                         this is explicitly NOT gated here: reads/writes
//                         go straight from the browser to GitHub's API
//                         using Keystatic's own access-token cookie.
//
// Untouched (every other route - all public-facing site pages).
// -----------------------------------------------------------------------

function isPublicAuthPath(pathname: string): boolean {
  return (
    pathname === LOGIN_PATH ||
    pathname === LOGIN_API_PATH ||
    pathname === LOGOUT_PATH ||
    pathname === ACCESS_DENIED_PATH ||
    pathname.startsWith("/api/keystatic/github/")
  );
}

function isAdminUiPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isKeystaticUiPath(pathname: string): boolean {
  return pathname === "/keystatic" || pathname.startsWith("/keystatic/");
}

function isKeystaticApiPath(pathname: string): boolean {
  return pathname === "/api/keystatic" || pathname.startsWith("/api/keystatic/");
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (isPublicAuthPath(pathname)) {
    return next();
  }

  if (pathname === KEYSTATIC_REPO_NOT_FOUND_PATH) {
    return context.redirect(ACCESS_DENIED_PATH);
  }

  const isProd = isProductionCms();
  const uiPath = isAdminUiPath(pathname) || isKeystaticUiPath(pathname);
  const apiPath = isKeystaticApiPath(pathname);

  if (isProd) {
    // Production (GitHub storage mode): content reads/writes happen
    // directly from the browser to GitHub's API using Keystatic's own
    // access-token cookie. Do NOT gate /api/keystatic/* here - only the UI
    // shell needs a login redirect when that cookie is absent.
    if (!uiPath) return next();

    const hasGithubSession = Boolean(
      context.cookies.get(GITHUB_ACCESS_TOKEN_COOKIE)?.value
    );
    if (!hasGithubSession) {
      return context.redirect(
        `${LOGIN_PATH}?redirect=${encodeURIComponent(pathname)}`
      );
    }
    return next();
  }

  // Local/dev (local storage mode): local storage has no built-in auth -
  // any request to /api/keystatic/* reads/writes the filesystem directly
  // regardless of who's asking, so gate both the UI shell and the API here.
  if (!uiPath && !apiPath) return next();

  const sessionSecret = import.meta.env.ADMIN_SESSION_SECRET;
  const token = context.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const authenticated = sessionSecret
    ? verifySessionToken(token, sessionSecret)
    : false;

  if (!authenticated) {
    if (apiPath) {
      return new Response("Unauthorized", { status: 401 });
    }
    return context.redirect(
      `${LOGIN_PATH}?redirect=${encodeURIComponent(pathname)}`
    );
  }

  return next();
});
