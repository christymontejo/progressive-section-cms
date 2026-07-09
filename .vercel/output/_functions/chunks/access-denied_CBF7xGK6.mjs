import { c as createComponent } from './astro-component_uMOhnfRR.mjs';
import 'piccolore';
import { b1 as renderHead, a3 as addAttribute, Q as renderTemplate } from './params-and-props_DQbjebCT.mjs';
import { r as renderComponent } from './entrypoint_BDQsTUKj.mjs';
import { $ as $$Font } from './_astro_assets_jvkC1lLx.mjs';
import { s as siteConfig, $ as $$Button } from './global_DNWUIl70.mjs';

const prerender = false;
const $$AccessDenied = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en" class="scroll-smooth"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow"><title>Access Denied | ${siteConfig.business.name}</title>${renderComponent($$result, "Font", $$Font, { "cssVariable": "--font-poppins", "preload": true })}${renderHead()}</head> <body class="antialiased text-gray-900 bg-primary-dark min-h-screen flex items-center justify-center px-4"> <div class="w-full max-w-md"> <div class="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 text-center space-y-6"> <img${addAttribute(siteConfig.logo.src, "src")}${addAttribute(siteConfig.logo.alt, "alt")} class="h-10 mx-auto"> <div class="space-y-2"> <h1 class="text-2xl font-bold text-primary-dark">Access Denied</h1> <p class="text-gray-600">
You signed in with GitHub successfully, but that account isn't a
            collaborator on ${siteConfig.business.name}'s content repository,
            so it can't be used to manage this site.
</p> </div> ${renderComponent($$result, "Button", $$Button, { "href": "/api/admin-logout", "variant": "primary", "size": "lg", "class": "w-full" }, { "default": ($$result2) => renderTemplate`
Try a Different GitHub Account
` })} ${renderComponent($$result, "Button", $$Button, { "href": "/", "variant": "outline", "size": "md", "class": "w-full" }, { "default": ($$result2) => renderTemplate`
Return to Site
` })} </div> </div> </body></html>`;
}, "C:/Users/montejo/Documents/progressive-section-template/src/pages/admin/access-denied.astro", void 0);

const $$file = "C:/Users/montejo/Documents/progressive-section-template/src/pages/admin/access-denied.astro";
const $$url = "/admin/access-denied";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AccessDenied,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
