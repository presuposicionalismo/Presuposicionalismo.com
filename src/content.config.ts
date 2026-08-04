import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    // Resumen del post: se muestra en el sitio (carrusel, destacados) y
    // por defecto también alimenta la meta description/OG/JSON-LD. No
    // hay límite de longitud a propósito -- es un resumen de contenido,
    // no texto optimizado para el snippet de un buscador.
    description: z.string(),
    // Opcional: versión corta (~150-160 caracteres) pensada específicamente
    // para el snippet de Google/redes sociales. Si no se define, se usa
    // un recorte automático de `description` (ver src/utils/seo.ts) en vez
    // de dejar que el buscador la trunque donde quiera.
    seoDescription: z.string().optional(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    featured: z.boolean().optional(),
    draft: z.boolean().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
    // Slugs que referencian src/content/autores/*.mdx, para posts que son
    // traducciones o extractos atribuibles a un autor real específico (a
    // diferencia de un post genuinamente redactado por el equipo del
    // sitio, que no lleva este campo y usa la voz editorial genérica).
    authors: z.array(z.string()).optional(),
  }),
});

const libros = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/libros" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Ver nota equivalente en la colección blog: opcional, ~150-160
    // caracteres, para meta description/OG/JSON-LD. Sin esto, se recorta
    // `description` automáticamente (src/utils/seo.ts).
    seoDescription: z.string().optional(),
    // Slugs que referencian src/content/autores/*.mdx. Un libro puede
    // tener uno o varios autores/compiladores.
    authors: z.array(z.string()),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    coverBook: z.string().optional(),
    downloadBook: z.string(),
  }),
});

const autores = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/autores" }),
  schema: z.object({
    name: z.string(),
    // Frase corta: rol/aporte principal (ej. "Teólogo reformado, padre
    // del apologética presuposicional").
    role: z.string(),
    // Ej. "1895–1987". Texto libre porque a veces solo se conoce el año.
    dates: z.string().optional(),
    // Slug de un tag ya existente en src/content/blog (ver taxonomía de
    // etiquetas) para poder listar posts del blog relacionados con este
    // autor sin tener que anotar cada post individualmente.
    tag: z.string().optional(),
    photo: z.string().optional(),
  }),
});

const clases = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/clases" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
    order: z.number(),
  }),
});

export const collections = {
  blog: blog,
  libros: libros,
  clases: clases,
  autores: autores,
};
