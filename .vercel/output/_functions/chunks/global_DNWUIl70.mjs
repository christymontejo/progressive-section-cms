import { c as createComponent } from './astro-component_uMOhnfRR.mjs';
import 'piccolore';
import { B as maybeRenderHead, a3 as addAttribute, b3 as renderSlot, Q as renderTemplate } from './params-and-props_DQbjebCT.mjs';
import 'clsx';

const business = {"name":"Acme Marketing"};
const logo = {"src":"/logo/progressive-section.svg","alt":"Progressive Section Template Logo"};
const seo = {"siteUrl":"https://progressive-section-template.vercel.app"};
const siteData = {
  business,
  logo,
  seo};

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://progressive-section-template.vercel.app", "SSR": true};
const defaults = {
  seo: {
    siteUrl: "https://progressive-section-template.vercel.app"}};
function normalizeUrl(u) {
  if (!u) return null;
  const t = String(u).trim();
  if (!t) return null;
  const withProto = /^https?:\/\//i.test(t) ? t : `https://${t}`;
  return withProto.replace(/\/+$/, "");
}
const env = Object.assign(__vite_import_meta_env__, { PUBLIC: "C:\\Users\\Public", _: "C:/Program Files/nodejs/node.exe" });
const SETTINGS_URL = normalizeUrl(siteData.seo?.siteUrl) ?? normalizeUrl(defaults.seo.siteUrl);
const PLACEHOLDER = !SETTINGS_URL || /example\.com$/.test(SETTINGS_URL) || /\.vercel\.app$/.test(SETTINGS_URL);
normalizeUrl(env.PUBLIC_SITE_URL) || normalizeUrl(env.SITE_URL) || (PLACEHOLDER ? normalizeUrl(env.VERCEL_PROJECT_PRODUCTION_URL) || normalizeUrl(env.VERCEL_URL) || SETTINGS_URL : SETTINGS_URL) || "https://example.com";
const siteConfig = {
  business: {
    name: siteData.business?.name},
  logo: {
    src: siteData.logo?.src,
    alt: siteData.logo?.alt
  }};

const $$Button = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Button;
  const {
    href,
    variant = "primary",
    size = "md",
    class: className = "",
    type = "button"
  } = Astro2.props;
  const baseStyles = "inline-flex items-center justify-center gap-2 font-bold rounded-full transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-100 active:translate-y-0";
  const variants = {
    primary: "bg-primary-dark text-white hover:bg-primary-darker shadow-lg hover:shadow-2xl",
    secondary: "bg-primary text-white hover:bg-primary-dark shadow-lg hover:shadow-2xl",
    outline: "bg-white text-primary-dark border-2 border-primary hover:border-primary-dark hover:bg-gray-50 shadow-md hover:shadow-lg"
  };
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
  return renderTemplate`${href ? renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")}${addAttribute(classes, "class")}>${renderSlot($$result, $$slots["default"])}</a>` : renderTemplate`<button${addAttribute(type, "type")}${addAttribute(classes, "class")}>${renderSlot($$result, $$slots["default"])}</button>`}`;
}, "C:/Users/montejo/Documents/progressive-section-template/src/components/ui/Button.astro", void 0);

export { $$Button as $, siteConfig as s };
