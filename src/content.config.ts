import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Display names double as the allowed values. Add a platform here first. */
export const PLATFORMS = ['Windows PC VR', 'Meta Quest', 'Android', 'Windows', 'Web'] as const;
export const PRODUCT_TYPES = ['game', 'app', 'tool', 'experience'] as const;
export const STATUSES = ['concept', 'in-development', 'early-access', 'released'] as const;

/** '' = planned store, shown as a disabled "Coming soon" button. Omit the key to hide it. */
const storeLink = z.union([z.url(), z.literal('')]).optional();

const requirementRows = z.record(z.string(), z.string());

const products = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/products' }),
  schema: ({ image }) => {
    const media = z.object({ src: image(), alt: z.string().min(1) });
    return z.object({
      title: z.string().min(1),
      slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'lowercase-kebab-case only'),
      type: z.enum(PRODUCT_TYPES),
      tagline: z.string().min(1).max(90),
      summary: z.string().min(1).max(200),
      status: z.enum(STATUSES),
      platforms: z.array(z.enum(PLATFORMS)).min(1),
      features: z.array(z.string().min(1)).default([]),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      releaseDate: z.coerce.date().optional(),
      heroImage: media,
      screenshots: z.array(media).default([]),
      trailerYouTubeId: z
        .string()
        .regex(/^[A-Za-z0-9_-]{11}$/, 'the 11-character YouTube video ID, not a URL')
        .optional(),
      storeLinks: z
        .object({
          steam: storeLink,
          metaHorizon: storeLink,
          googlePlay: storeLink,
          itch: storeLink,
          github: storeLink,
          website: storeLink,
        })
        .default({}),
      systemRequirements: z
        .object({ minimum: requirementRows, recommended: requirementRows.optional() })
        .optional(),
      hasPrivacyPolicy: z.boolean().default(false),
      order: z.number().int().default(100),
    });
  },
});

/** Per-product privacy policies. File name must equal the product slug. */
const productPrivacy = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/product-privacy' }),
  schema: z.object({
    lastUpdated: z.coerce.date(),
  }),
});

export const collections = { products, productPrivacy };
