import { rssSchema } from "@astrojs/rss";
import { z } from "astro/zod";
import { defineCollection, type SchemaContext } from "astro:content";
import { file, glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "*.{md,mdx}", base: "./src/content/blog" }),
  schema: rssSchema
    .extend({
      title: z.string(),
      description: z.string(),
      createdDate: z.coerce.date(),
      lastUpdated: z.coerce.date().optional(),
      metaImage: z.string().optional(),
      metaImageAlt: z.string().optional(),
    })
    .superRefine((data, context) => {
      if (data.metaImage && !data.metaImageAlt) {
        context.addIssue({
          code: "custom",
          path: ["metaImageAlt"],
          message: "metaImageAlt is required when metaImage is set.",
        });
      }
    }),
});

const entryLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const entrySchema = ({ image }: SchemaContext) =>
  z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().trim().min(1).optional(),
    image: z
      .object({
        // Image paths are relative to the collection's JSON file.
        src: image(),
        alt: z.string().trim().min(1),
        caption: z.string().trim().min(1).optional(),
        copyright: z.string().trim().min(1).optional(),
      })
      .optional(),
    type: z.string(),
    venue: z.string(),
    date: z.string(),
    language: z.string(),
    links: z.array(entryLinkSchema),
  });

const talks = defineCollection({
  loader: file("./src/content/talks.json"),
  schema: entrySchema,
});

const publications = defineCollection({
  loader: file("./src/content/publications.json"),
  schema: entrySchema,
});

export const collections = { blog, talks, publications };
