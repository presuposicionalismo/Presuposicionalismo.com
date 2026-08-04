import { getEntry, type CollectionEntry } from "astro:content";

/**
 * Resolves an array of `autores` slugs (as stored in `libros.authors`)
 * into their actual collection entries. Slugs that don't match any
 * `autores` entry are silently dropped rather than throwing, so a typo
 * in the frontmatter degrades to "missing author" instead of a build
 * failure.
 */
export async function resolveAuthors(
  slugs: string[],
): Promise<CollectionEntry<"autores">[]> {
  const entries = await Promise.all(
    slugs.map((slug) => getEntry("autores", slug)),
  );
  return entries.filter((entry): entry is CollectionEntry<"autores"> =>
    Boolean(entry),
  );
}

/** "Fulano" | "Fulano y Mengano" | "Fulano, Mengano y Zutano" */
export function formatAuthorNames(
  authors: Pick<CollectionEntry<"autores">, "data">[],
): string {
  const names = authors.map((author) => author.data.name);
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} y ${names[names.length - 1]}`;
}
