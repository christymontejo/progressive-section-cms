import { c as createComponent } from './astro-component_uMOhnfRR.mjs';
import 'piccolore';
import { b1 as renderHead, a3 as addAttribute, Q as renderTemplate } from './params-and-props_DQbjebCT.mjs';
import { r as renderComponent } from './entrypoint_BDQsTUKj.mjs';
import { $ as $$Font } from './_astro_assets_jvkC1lLx.mjs';
import { s as siteConfig, $ as $$Button } from './global_DNWUIl70.mjs';
import { s as sanitizeRedirect } from './adminSession_CjGRXWxI.mjs';

const prerender = false;
const $$Login = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Login;
  const hasError = Astro2.url.searchParams.get("error") === "1";
  sanitizeRedirect(Astro2.url.searchParams.get("redirect"));
  return renderTemplate`<html lang="en" class="scroll-smooth"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow"><title>Admin Login | ${siteConfig.business.name}</title>${renderComponent($$result, "Font", $$Font, { "cssVariable": "--font-poppins", "preload": true })}${renderHead()}</head> <body class="antialiased text-gray-900 bg-primary-dark min-h-screen flex items-center justify-center px-4"> <div class="w-full max-w-md"> <div class="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 text-center space-y-6"> <img${addAttribute(siteConfig.logo.src, "src")}${addAttribute(siteConfig.logo.alt, "alt")} class="h-10 mx-auto"> <div class="space-y-2"> <p class="section-eyebrow text-primary-light">Admin</p> <h1 class="text-2xl font-bold text-primary-dark">Sign In</h1> <p class="text-gray-600">
Sign in to manage ${siteConfig.business.name}'s content.
</p> </div> ${hasError && renderTemplate`<p class="text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg py-2 px-3">
Incorrect password. Please try again.
</p>`} ${renderTemplate`${renderComponent($$result, "Button", $$Button, { "href": `/api/keystatic/github/login`, "variant": "primary", "size": "lg", "class": "w-full" }, { "default": ($$result2) => renderTemplate` <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor"> <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55 0-.27-.01-1.15-.02-2.09-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a10.9 10.9 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.07.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"></path> </svg>
Login with GitHub
` })}` } <p class="text-xs text-gray-400 pt-2"> ${"Access is managed via GitHub repository permissions." } </p> </div> </div> </body></html>`;
}, "C:/Users/montejo/Documents/progressive-section-template/src/pages/admin/login.astro", void 0);

const $$file = "C:/Users/montejo/Documents/progressive-section-template/src/pages/admin/login.astro";
const $$url = "/admin/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
