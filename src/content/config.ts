import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
  schema: z.object({
    id: z.string().optional(),
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    date: z.date().optional(),
    image: z.string().optional(),
    authors: z.array(z.string()).default(["admin"]),
    categories: z.array(z.string()).default(["others"]),
    tags: z.array(z.string()).default(["others"]),
    draft: z.boolean().optional(),
    vgwort_tracker: z.string().optional()
  }),
});

const authorsCollection = defineCollection({
  schema: ({ image }) => z.object({
    id: z.string().optional(),
    title: z.string(),
    meta_title: z.string().optional(),
    image: image().optional(),
    googlephoto: z.string().optional(),
    description: z.string().optional(),
    social: z
      .object({
        facebook: z.string().optional(),
        twitter: z.string().optional(),
        instagram: z.string().optional(),
        youtube: z.string().optional(),
        spotify: z.string().optional(),
      })
      .optional(),
    draft: z.boolean().optional(),
  }),
});

const pagesCollection = defineCollection({
  schema: ({ image }) => z.object({
    id: z.string().optional(),
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    image: image().optional(),
    layout: z.string().optional(),
    draft: z.boolean().optional(),
    what_i_do: z.object({
      title: z.string(),
      items: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
        })
      )
    }).optional(),
  }),
});

export const collections = {
  posts: postsCollection,
  pages: pagesCollection,
  authors: authorsCollection,
};
