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
        updatedDate: fields.date({ label: "Updated Date", validation: { isRequired: false } }),
        featured: fields.checkbox({
          label: "Featured",
          defaultValue: false,
        }),
        draft: fields.checkbox({
          label: "Draft",
          defaultValue: false,
        }),
        heroImage: fields.image({
          label: "Hero Image",
          directory: "src/assets/images/blog",
          publicPath: "/src/assets/images/blog/",
          validation: { isRequired: false },
        }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value,
        }), // Tags are optional by default
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
        updatedDate: fields.date({ label: "Updated Date", validation: { isRequired: false } }),
        coverBook: fields.image({
          label: "Cover Book",
          directory: "src/assets/coverbook",
          publicPath: "/src/assets/coverbook/",
          validation: { isRequired: false },
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
