import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  // Type-check frontmatter using a schema
  type: "content_layer",
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    featured: z.boolean().optional(),
    draft: z.boolean().optional(),
    heroImage: z.string().optional(),
  }),
});

const libros = defineCollection({
  // Type-check frontmatter using a schema
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    coverBook: z.string().optional(),
    downloadBook: z.string(),
  }),
});

export const collections = {
  blog: blog,
  libros: libros,
};
