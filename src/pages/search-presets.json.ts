import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import knowledgeJson from "../data/knowledge.json";
import { knowledgeSchema } from "../data/knowledge.schema";
import postFilter from "@utils/postFilter";
import { slugifyStr } from "@utils/slugify";

export const prerender = true;

// Búsquedas precalculadas (src/data/knowledge.json) con las referencias ya
// resueltas a título + URL, para que el menú ⌘K las cargue al abrirse sin
// conocer el formato interno del índice. Un resultado que apunte a un post
// que no existe (o está en borrador) rompe el build a propósito.
export const GET: APIRoute = async () => {
  const knowledge = knowledgeSchema.parse(knowledgeJson);
  const posts = new Map(
    (await getCollection("blog", postFilter)).map((post) => [
      `blog:${post.id}`,
      { title: post.data.title, url: `/blog/${slugifyStr(post.data.title)}/` },
    ]),
  );

  const presets = knowledge.queries.map((query) => ({
    text: query.text,
    aliases: query.aliases,
    results: query.results.map((result) => {
      const post = posts.get(result.ref);
      if (!post) {
        throw new Error(
          `knowledge.json: "${query.id}" apunta a ${result.ref}, que no existe o no está publicado`,
        );
      }
      return {
        title: post.title,
        url: result.anchor ? `${post.url}#${result.anchor}` : post.url,
        snippet: result.snippet,
      };
    }),
  }));

  return new Response(JSON.stringify(presets), {
    headers: { "Content-Type": "application/json" },
  });
};
