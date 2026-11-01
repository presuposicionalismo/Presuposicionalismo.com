import type { APIRoute, GetStaticPaths } from "astro";
import { type CollectionEntry, getCollection } from "astro:content";
import { formatAuthorNames, resolveAuthors } from "@utils/authors";
import bookFilter from "@utils/bookFilter";
import { isRepository } from "@utils/download";
import { generateOgImage, typstAvailable } from "@utils/generateOg";

export const prerender = true;

export const getStaticPaths = (async () => {
  if (!(await typstAvailable())) return [];
  const books = await getCollection("libros", bookFilter);
  return books.map((book) => ({ params: { slug: book.id }, props: { book } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ book: CollectionEntry<"libros"> }> = async ({ props }) => {
  const { title, description, seoDescription, authors, coverBook, downloadBook } = props.book.data;
  return generateOgImage("book", {
    title,
    description: seoDescription ?? description,
    author: formatAuthorNames(await resolveAuthors(authors)),
    coverBook,
    label: isRepository(downloadBook) ? "En GitHub" : "PDF gratis",
  });
};
