import type { CollectionEntry } from "astro:content";

const bookFilter = ({ data }: CollectionEntry<"libros">) => !data.draft || import.meta.env.DEV;

export default bookFilter;
