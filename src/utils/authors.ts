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

/**
 * "Cornelius Van Til" -> "CT", "K. Scott Oliphint" -> "KO". Used as the
 * monogram fallback for authors without a `photo`: first letter of the
 * first word + first letter of the last word.
 */
export function getInitials(name: string): string {
  const words = name.replace(/\./g, "").trim().split(/\s+/);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  const first = words[0][0];
  const last = words[words.length - 1][0];
  return `${first}${last}`.toUpperCase();
}
