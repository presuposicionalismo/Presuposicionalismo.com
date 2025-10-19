import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercelStatic from "@astrojs/vercel/static";

import fuse from "astro-fuse";

import svelte from "@astrojs/svelte";

import tailwindcss from "@tailwindcss/vite";

// remarkPlugins: [remarkToc],

// https://astro.build/config
export default defineConfig({
  site: "https://presuposicionalismo.com",

  integrations: [
    mdx({
      gfm: true,
    }),
    sitemap(),
    fuse(["content"]),
    svelte(),
  ],

  markdown: {
    remarkPlugins: [],
    gfm: true,
  },

  output: "static",
  adapter: vercelStatic(),

  webAnalytics: {
    enabled: true,
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
