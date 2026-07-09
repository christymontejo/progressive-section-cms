import { c as createComponent } from './astro-component_uMOhnfRR.mjs';
import 'piccolore';
import { b1 as renderHead, a3 as addAttribute, Q as renderTemplate, b2 as defineScriptVars } from './params-and-props_DQbjebCT.mjs';
import { r as renderComponent } from './entrypoint_BDQsTUKj.mjs';
import { $ as $$Font } from './_astro_assets_jvkC1lLx.mjs';
import { s as siteConfig, $ as $$Button } from './global_DNWUIl70.mjs';
import { C as CMS_BRANCH, a as CMS_REPO_NAME, b as CMS_REPO_OWNER } from './cms_C3IUMbgc.mjs';
import { G as GITHUB_ACCESS_TOKEN_COOKIE } from './adminSession_CjGRXWxI.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en" class="scroll-smooth"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow"><title>Admin Dashboard | ${siteConfig.business.name}</title>${renderComponent($$result, "Font", $$Font, { "cssVariable": "--font-poppins", "preload": true })}${renderHead()}</head> <body class="antialiased text-gray-900 bg-primary-dark min-h-screen flex items-center justify-center px-4"> <div class="w-full max-w-md"> <div class="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 space-y-8"> <div class="text-center space-y-2"> <img${addAttribute(siteConfig.logo.src, "src")}${addAttribute(siteConfig.logo.alt, "alt")} class="h-10 mx-auto mb-2"> <p class="section-eyebrow text-primary-light">Admin</p> <h1 class="text-2xl font-bold text-primary-dark">Dashboard</h1> </div> <div class="space-y-4"> ${renderComponent($$result, "Button", $$Button, { "href": "/keystatic", "variant": "primary", "size": "lg", "class": "w-full" }, { "default": async ($$result2) => renderTemplate`
Open CMS Editor
` })} <div> <a id="view-live-site-link" href="/"${addAttribute("true" , "aria-disabled")}${addAttribute([
    "w-full inline-flex items-center justify-center gap-2 font-bold rounded-full transition-all duration-300 px-6 py-3 text-base",
    "bg-white text-primary-dark border-2 border-primary hover:border-primary-dark hover:bg-gray-50 shadow-md",
    "opacity-50 pointer-events-none"
  ], "class:list")}>
View Live Site
</a> ${renderTemplate`<p id="deploy-status" class="text-xs text-gray-500 text-center mt-2 flex items-center justify-center gap-2"> <span id="deploy-spinner" class="inline-block w-3 h-3 border-2 border-gray-300 border-t-primary-light rounded-full animate-spin"></span> <span id="deploy-status-text">Checking deploy status...</span> </p>`} </div> ${renderComponent($$result, "Button", $$Button, { "href": "/api/admin-logout", "variant": "outline", "size": "lg", "class": "w-full" }, { "default": async ($$result2) => renderTemplate`
Logout
` })} </div> </div> </div> ${renderTemplate(_a || (_a = __template(["<script>(function(){", `
          const MAX_ATTEMPTS = 20;
          const INTERVAL_MS = 6000;
          let attempts = 0;

          const linkEl = document.getElementById("view-live-site-link");
          const spinnerEl = document.getElementById("deploy-spinner");
          const statusTextEl = document.getElementById("deploy-status-text");

          function getCookie(name) {
            const escaped = name.replace(/([.$?*|{}()[\\]\\\\/+^])/g, "\\\\$1");
            const match = document.cookie.match(new RegExp("(?:^|; )" + escaped + "=([^;]*)"));
            return match ? decodeURIComponent(match[1]) : null;
          }

          function enableLink(message) {
            linkEl.removeAttribute("aria-disabled");
            linkEl.classList.remove("opacity-50", "pointer-events-none");
            if (spinnerEl) spinnerEl.style.display = "none";
            if (statusTextEl) statusTextEl.textContent = message;
          }

          function keepPolling(message) {
            if (statusTextEl) statusTextEl.textContent = message;
            if (attempts >= MAX_ATTEMPTS) {
              enableLink("Couldn't confirm automatically - check your deploy dashboard.");
              return;
            }
            setTimeout(checkDeployStatus, INTERVAL_MS);
          }

          async function checkDeployStatus() {
            const token = getCookie(tokenCookieName);
            if (!token) {
              enableLink("Couldn't verify deploy status (not signed in) - link enabled.");
              return;
            }

            attempts++;
            const headers = {
              Authorization: "Bearer " + token,
              Accept: "application/vnd.github+json",
            };
            const base = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/commits/" + branch;

            try {
              // Prefer the modern Checks API (GitHub Actions, most CI-based
              // deploys); fall back to the classic combined status API,
              // since some deploy integrations only post classic statuses.
              const checkRunsRes = await fetch(base + "/check-runs", { headers });
              if (checkRunsRes.ok) {
                const data = await checkRunsRes.json();
                const runs = data.check_runs || [];
                if (runs.length > 0) {
                  const run = runs.find((r) => /vercel/i.test(r.name)) || runs[0];
                  if (run.status !== "completed") {
                    keepPolling("Deploying...");
                    return;
                  }
                  if (run.conclusion === "success") {
                    enableLink("Deployed.");
                  } else {
                    enableLink('Deploy finished with status "' + run.conclusion + '" - check your deploy dashboard.');
                  }
                  return;
                }
              }

              const statusRes = await fetch(base + "/status", { headers });
              if (statusRes.ok) {
                const data = await statusRes.json();
                const statuses = data.statuses || [];
                if (statuses.length > 0) {
                  const s = statuses.find((s) => /vercel/i.test(s.context)) || statuses[0];
                  if (s.state === "pending") {
                    keepPolling("Deploying...");
                    return;
                  }
                  if (s.state === "success") {
                    enableLink("Deployed.");
                  } else {
                    enableLink('Deploy finished with status "' + s.state + '" - check your deploy dashboard.');
                  }
                  return;
                }
              }

              // Neither API has a check/status for this commit yet.
              keepPolling("Waiting for deployment to start...");
            } catch (e) {
              keepPolling("Waiting for deployment to start...");
            }
          }

          checkDeployStatus();
        })();<\/script>`], ["<script>(function(){", `
          const MAX_ATTEMPTS = 20;
          const INTERVAL_MS = 6000;
          let attempts = 0;

          const linkEl = document.getElementById("view-live-site-link");
          const spinnerEl = document.getElementById("deploy-spinner");
          const statusTextEl = document.getElementById("deploy-status-text");

          function getCookie(name) {
            const escaped = name.replace(/([.$?*|{}()[\\\\]\\\\\\\\/+^])/g, "\\\\\\\\$1");
            const match = document.cookie.match(new RegExp("(?:^|; )" + escaped + "=([^;]*)"));
            return match ? decodeURIComponent(match[1]) : null;
          }

          function enableLink(message) {
            linkEl.removeAttribute("aria-disabled");
            linkEl.classList.remove("opacity-50", "pointer-events-none");
            if (spinnerEl) spinnerEl.style.display = "none";
            if (statusTextEl) statusTextEl.textContent = message;
          }

          function keepPolling(message) {
            if (statusTextEl) statusTextEl.textContent = message;
            if (attempts >= MAX_ATTEMPTS) {
              enableLink("Couldn't confirm automatically - check your deploy dashboard.");
              return;
            }
            setTimeout(checkDeployStatus, INTERVAL_MS);
          }

          async function checkDeployStatus() {
            const token = getCookie(tokenCookieName);
            if (!token) {
              enableLink("Couldn't verify deploy status (not signed in) - link enabled.");
              return;
            }

            attempts++;
            const headers = {
              Authorization: "Bearer " + token,
              Accept: "application/vnd.github+json",
            };
            const base = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/commits/" + branch;

            try {
              // Prefer the modern Checks API (GitHub Actions, most CI-based
              // deploys); fall back to the classic combined status API,
              // since some deploy integrations only post classic statuses.
              const checkRunsRes = await fetch(base + "/check-runs", { headers });
              if (checkRunsRes.ok) {
                const data = await checkRunsRes.json();
                const runs = data.check_runs || [];
                if (runs.length > 0) {
                  const run = runs.find((r) => /vercel/i.test(r.name)) || runs[0];
                  if (run.status !== "completed") {
                    keepPolling("Deploying...");
                    return;
                  }
                  if (run.conclusion === "success") {
                    enableLink("Deployed.");
                  } else {
                    enableLink('Deploy finished with status "' + run.conclusion + '" - check your deploy dashboard.');
                  }
                  return;
                }
              }

              const statusRes = await fetch(base + "/status", { headers });
              if (statusRes.ok) {
                const data = await statusRes.json();
                const statuses = data.statuses || [];
                if (statuses.length > 0) {
                  const s = statuses.find((s) => /vercel/i.test(s.context)) || statuses[0];
                  if (s.state === "pending") {
                    keepPolling("Deploying...");
                    return;
                  }
                  if (s.state === "success") {
                    enableLink("Deployed.");
                  } else {
                    enableLink('Deploy finished with status "' + s.state + '" - check your deploy dashboard.');
                  }
                  return;
                }
              }

              // Neither API has a check/status for this commit yet.
              keepPolling("Waiting for deployment to start...");
            } catch (e) {
              keepPolling("Waiting for deployment to start...");
            }
          }

          checkDeployStatus();
        })();<\/script>`])), defineScriptVars({
    repoOwner: CMS_REPO_OWNER,
    repoName: CMS_REPO_NAME,
    branch: CMS_BRANCH,
    tokenCookieName: GITHUB_ACCESS_TOKEN_COOKIE
  }))} </body> </html>`;
}, "C:/Users/montejo/Documents/progressive-section-template/src/pages/admin/index.astro", void 0);

const $$file = "C:/Users/montejo/Documents/progressive-section-template/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
