import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "*.{md,mdx}", base: "./src/content/blog" }),
  schema: z
    .object({
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

export const collections = { blog };
