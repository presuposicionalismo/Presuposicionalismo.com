import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/static";


// remarkPlugins: [remarkToc],


// https://astro.build/config
export default defineConfig({
  site: "https://presuposicionalismo.com",
  experimental: {
    contentLayer: true,
  },
  integrations: [
    mdx({
    gfm: true,
    
  }),
  sitemap()
],
  markdown: {
    remarkPlugins: [],
    gfm: true,
  },
  output: "static",
  adapter: vercel(),
      webAnalytics: {
      enabled: true,
    },
});