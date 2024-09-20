import type { CollectionEntry } from "astro:content";
import postFilter from "./postFilter";

const getSortedPosts = (posts: CollectionEntry<"blog">[]) => {
  return posts
    .filter(postFilter)
    .sort(
      (a, b) =>
        a.data.pubDate.valueOf() - b.data.pubDate.valueOf(),
    );
};

export default getSortedPosts;
