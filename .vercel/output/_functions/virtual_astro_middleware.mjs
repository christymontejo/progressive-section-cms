import { d as defineMiddleware, ae as sequence } from './chunks/params-and-props_DQbjebCT.mjs';
import 'piccolore';
import 'clsx';
import { G as GITHUB_ACCESS_TOKEN_COOKIE } from './chunks/adminSession_CjGRXWxI.mjs';

const LOGIN_PATH = "/admin/login";
const ACCESS_DENIED_PATH = "/admin/access-denied";
const LOGOUT_PATH = "/api/admin-logout";
const LOGIN_API_PATH = "/api/admin-login";
const KEYSTATIC_REPO_NOT_FOUND_PATH = "/keystatic/repo-not-found";
function isPublicAuthPath(pathname) {
  return pathname === LOGIN_PATH || pathname === LOGIN_API_PATH || pathname === LOGOUT_PATH || pathname === ACCESS_DENIED_PATH || pathname.startsWith("/api/keystatic/github/");
}
function isAdminUiPath(pathname) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}
function isKeystaticUiPath(pathname) {
  return pathname === "/keystatic" || pathname.startsWith("/keystatic/");
}
function isKeystaticApiPath(pathname) {
  return pathname === "/api/keystatic" || pathname.startsWith("/api/keystatic/");
}
const onRequest$1 = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  if (isPublicAuthPath(pathname)) {
    return next();
  }
  if (pathname === KEYSTATIC_REPO_NOT_FOUND_PATH) {
    return context.redirect(ACCESS_DENIED_PATH);
  }
  const uiPath = isAdminUiPath(pathname) || isKeystaticUiPath(pathname);
  isKeystaticApiPath(pathname);
  {
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
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
