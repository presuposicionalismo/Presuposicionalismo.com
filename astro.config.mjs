import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import cloudflare from "@astrojs/cloudflare";

// import fuse from "astro-fuse";

import tailwindcss from "@tailwindcss/vite";

// remarkPlugins: [remarkToc],

// https://astro.build/config
export default defineConfig({
  site: "https://presuposicionalismo.com",

  integrations: [
    mdx({
      gfm: true,
    }),
    svelte(),
    sitemap(),
    // fuse(["content"]),
  ],

  markdown: {
    remarkPlugins: [],
    gfm: true,
  },

  output: "server",
  adapter: cloudflare(),

  webAnalytics: {
    // enabled: true, // Requires configuration or separate plugin for Cloudflare
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: true,
    },
  },
});
