import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercelStatic from "@astrojs/vercel";
import keystatic from "@keystatic/astro";

import fuse from "astro-fuse";

import svelte from "@astrojs/svelte";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

// remarkPlugins: [remarkToc],

// https://astro.build/config
export default defineConfig({
  site: "https://presuposicionalismo.com",

  integrations: [keystatic(), mdx({
    gfm: true,
  }), sitemap(), fuse(["content"]), svelte(), react()],

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