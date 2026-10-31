import type { APIRoute, GetStaticPaths } from "astro";
import { type CollectionEntry, getCollection } from "astro:content";
import { generateOgImage, typstAvailable } from "@utils/generateOg";
import postFilter from "@utils/postFilter";
import { getSeoDescription } from "@utils/seo";
import { slugifyStr } from "@utils/slugify";

export const prerender = true;

// Mismo slug que la página del artículo (src/pages/blog/[...slug].astro).
export const getStaticPaths = (async () => {
  if (!(await typstAvailable())) return [];
  const posts = await getCollection("blog", postFilter);
  return posts.map((post) => ({
    params: { slug: slugifyStr(post.data.title) },
    props: { post },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ post: CollectionEntry<"blog"> }> = ({ props }) =>
  generateOgImage("blog", {
    title: props.post.data.title,
    description: getSeoDescription(props.post.data.description, props.post.data.seoDescription),
  });
