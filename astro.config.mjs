import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import robotsTxt from "astro-robots-txt";
import config from "./src/config/config.json";
import preact from "@astrojs/preact";
import webmanifest from "astro-webmanifest";
import { remarkReadingTime } from "./src/lib/remarkReadingTime";
import lazyLoadPlugin from "rehype-plugin-image-native-lazy-loading";
import purgecss from "astro-purgecss";
import serviceWorker from "astrojs-service-worker";
import vercel from "@astrojs/vercel/static";
import { writeFile } from "fs/promises";
import { resolve } from "path";

export const IS_PRODUCTION_BUILD = process.env.VERCEL_ENV === "production";

// writes a last update timestamp for the post web notification feature to
// be able to detect new posts
export const lastUpdateTime = () => {
  return {
    name: "lastUpdateTime",
    hooks: {
      "astro:build:generated": async (options) => {
        const postLockFile = resolve(
          `${options.dir.pathname}/lastupdatetime.lock`
        );
        await writeFile(postLockFile, new Date().toISOString(), { flag: "w" });
        console.log("Updated last update time lockfile", postLockFile);
      },
    },
  };
};

// https://astro.build/config
export default defineConfig({
  output: "static",
  adapter: vercel(),
  site: config.site.base_url,
  base: config.site.base_path,
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  integrations: [
    lastUpdateTime(),
    robotsTxt(),
    serviceWorker(),
    preact({ compat: true }),
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
    purgecss({
      blocklist: [],
      safelist: [],
      fontFace: true,
      keyframes: true,
      variables: true,
      rejected: false,
      rejectedCss: false,
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
