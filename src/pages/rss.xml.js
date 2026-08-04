import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";
import postFilter from "../utils/postFilter";
import { slugifyStr } from "../utils/slugify";

export async function GET(context) {
  const posts = await getCollection("blog", postFilter);
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      // Debe coincidir con la URL real generada en blog/[...slug].astro
      // (slugifyStr del título), no con post.id -- que conserva tildes
      // vía el slugger por defecto de Astro y produce un link roto para
      // cualquier post con tilde en el título.
      link: `/blog/${slugifyStr(post.data.title)}/`,
    })),
  });
}
