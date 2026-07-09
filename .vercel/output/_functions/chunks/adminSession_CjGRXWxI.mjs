const ADMIN_SESSION_COOKIE = "admin_session";
const GITHUB_ACCESS_TOKEN_COOKIE = "keystatic-gh-access-token";
const GITHUB_REFRESH_TOKEN_COOKIE = "keystatic-gh-refresh-token";
const ALL_SESSION_COOKIES = [
  ADMIN_SESSION_COOKIE,
  GITHUB_ACCESS_TOKEN_COOKIE,
  GITHUB_REFRESH_TOKEN_COOKIE
];
const ADMIN_DASHBOARD_PATH = "/admin";
function sanitizeRedirect(value) {
  if (value && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return ADMIN_DASHBOARD_PATH;
}

export { ALL_SESSION_COOKIES as A, GITHUB_ACCESS_TOKEN_COOKIE as G, sanitizeRedirect as s };
