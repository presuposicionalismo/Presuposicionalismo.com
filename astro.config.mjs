import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/static";
import remarkBlockquoteAdmonitions  from 'remark-github-beta-blockquote-admonitions';

// remarkPlugins: [remarkToc],


// https://astro.build/config
export default defineConfig({
  site: "https://presuposicionalismo.com",
  integrations: [
    mdx({
    gfm: true,
    
  }),
  sitemap()
],
  markdown: {
    remarkPlugins: [remarkBlockquoteAdmonitions],
    gfm: true,
  },
  output: "static",
  adapter: vercel(),
      webAnalytics: {
      enabled: true,
    },
});