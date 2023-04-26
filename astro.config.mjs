import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";
import { defineConfig } from "astro/config";
import config from "./src/config/config.json";
import cloudflare from "@astrojs/cloudflare";
import webmanifest from 'astro-webmanifest'
import { remarkReadingTime } from "./src/lib/remarkReadingTime";
import lazyLoadPlugin from "rehype-plugin-image-native-lazy-loading";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  site: config.site.base_url,
  base: config.site.base_path,
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  integrations: [
    preact({ compat: true }),
    sitemap(),
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    mdx(),
    webmanifest({
      name: 'astro-launchpad',
      icon: './public/favicon.svg',
      start_url: config.site.base_url,
      display: 'standalone',
    }),
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
