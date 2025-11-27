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
        updatedDate: fields.date({ label: "Updated Date", optional: true }),
        featured: fields.checkbox({
          label: "Featured",
          defaultValue: false,
          optional: true,
        }),
        draft: fields.checkbox({
          label: "Draft",
          defaultValue: false,
          optional: true,
        }),
        heroImage: fields.image({
          label: "Hero Image",
          directory: "src/assets/images/blog",
          publicPath: "/src/assets/images/blog/",
          optional: true,
        }),
        tags: fields
          .array(fields.text({ label: "Tag" }), {
            label: "Tags",
            itemLabel: (props) => props.value,
          })
          .optional(), // Tags is optional in config.ts
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
        updatedDate: fields.date({ label: "Updated Date", optional: true }),
        coverBook: fields.image({
          label: "Cover Book",
          directory: "src/assets/coverbook",
          publicPath: "/src/assets/coverbook/",
          optional: true,
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
