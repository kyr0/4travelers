import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import config from "./src/config/config.json";
import cloudflare from "@astrojs/cloudflare";
import webmanifest from "astro-webmanifest";
import { remarkReadingTime } from "./src/lib/remarkReadingTime";
import lazyLoadPlugin from "rehype-plugin-image-native-lazy-loading";
import purgecss from 'astro-purgecss';
import serviceWorker from "astrojs-service-worker";

// https://astro.build/config
export default defineConfig({
  output: "static",
  //adapter: cloudflare({ mode:'directory' }),
  site: config.site.base_url,
  base: config.site.base_path,
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  integrations: [
    serviceWorker(),
    react(),
    sitemap(),
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    mdx(),
    webmanifest({
      name: config.site.title,
      icon: "./public/images/logo-quad.svg",
      start_url: config.site.base_url,
      display: "standalone",
    }),
    purgecss()
  ],
  markdown: {
    remarkPlugins: [remarkReadingTime],
    rehypePlugins: [lazyLoadPlugin],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
});
