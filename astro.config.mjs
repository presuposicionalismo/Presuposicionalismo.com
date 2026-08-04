import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import vercel from "@astrojs/vercel";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://presuposicionalismo.com",

  integrations: [mdx(), svelte(), sitemap()],

  markdown: {
    processor: unified({
      remarkRehype: {
        footnoteLabel: "Notas",
        footnoteBackLabel: "Volver a la referencia",
      },
    }),
  },

  output: "server",
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: true,
    },
  },
});
