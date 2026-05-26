// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { readingTimeRemarkPlugin } from "./src/lib/frontmatter";
import configIntegration from "./vendor/integration/index";
import icon from "astro-icon";
import { readFileSync } from "fs";
import { resolve } from "path";

const siteJsonAbsolute = resolve("./src/content/settings/site.json");
const siteData = JSON.parse(readFileSync(siteJsonAbsolute, "utf-8"));

// https://astro.build/config
export default defineConfig({
  site: siteData.seo?.siteUrl || "https://dealer-template-8.vercel.app",
  integrations: [mdx(), icon(), sitemap(), configIntegration()],
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "~": "/src",
      },
    },
    build: {
      cssMinify: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
  },
  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
  },
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
