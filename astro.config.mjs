import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import db from '@astrojs/db';
import node from '@astrojs/node';
import studioCMS from 'studiocms';
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/static";

import fuse from "astro-fuse";

import svelte from "@astrojs/svelte";

// remarkPlugins: [remarkToc],

// https://astro.build/config
export default defineConfig({
  site: "https://presuposicionalismo.com",
  integrations: [mdx({
    gfm: true,
  }), sitemap(), fuse(['content']), svelte(),
  db(),
  studioCMS({
      dbStartPage: true, // After the first time running the dev server and following the instructions at http://localhost:4321/start this will be set to false.
  })],
  markdown: {
    remarkPlugins: [],
    gfm: true,
  },
  output: "server",
  adapter: node({ mode: "standalone" }),
  webAnalytics: {
    enabled: true,
  },
});