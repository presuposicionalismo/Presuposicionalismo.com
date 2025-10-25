import { config, fields, collection } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },

  collections: {
    posts: collection({
      label: "Blog Posts",
      slugField: "title",
      path: "src/content/blog/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.text({ label: "Description", multiline: true }),
        pubDate: fields.date({ label: "Publish Date" }),
        updatedDate: fields.date({ label: "Updated Date" }),
        featured: fields.checkbox({ label: "Featured", defaultValue: false }),
        draft: fields.checkbox({ label: "Draft", defaultValue: false }),
        heroImage: fields.image({
          label: "Hero Image",
          directory: "src/assets/images/blog",
          publicPath: "../../assets/images/blog/",
        }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value,
        }),
        content: fields.mdx({
          label: "Content",
        }),
      },
    }),
    libros: collection({
      label: "Libros",
      slugField: "title",
      path: "src/content/libros/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.text({ label: "Description", multiline: true }),
        author: fields.text({ label: "Author" }),
        pubDate: fields.date({ label: "Publish Date" }),
        updatedDate: fields.date({ label: "Updated Date" }),
        coverBook: fields.image({
          label: "Cover Book",
          directory: "src/assets/images/books",
          publicPath: "../../assets/images/books/",
        }),
        downloadBook: fields.url({
          label: "Download Book URL",
          description: "The external URL for downloading the book.",
        }),
        content: fields.mdx({
          label: "Content",
        }),
      },
    }),
  },
});
