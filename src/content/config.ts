import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blogCollection = defineCollection({
  loader: glob({
    pattern: "**/index.mdx",
    base: "./src/content/blog",
    // Generate slug from directory name, stripping the date prefix
    generateId: ({ entry }) => {
      // entry is like "2023-04-17-building-a-banner-ad-with-gpt-4/index"
      const dirName = entry.split("/")[0];
      // Remove date prefix (YYYY-MM-DD-) to get the slug
      const slug = dirName.replace(/^\d{4}-\d{2}-\d{2}-/, "");
      return slug;
    },
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.date(),
      updatedDate: z.date().optional(),
      heroImage: image().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      preview: image().optional(),
    }),
});

export const collections = {
  blog: blogCollection,
};
