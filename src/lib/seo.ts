import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { site } from '../config/site';
import { absolute, url } from './url';
import type { Product } from './products';

export interface SocialImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const defaultSocialImage: SocialImage = {
  src: url(site.defaultSocialImage),
  alt: site.defaultSocialImageAlt,
  width: 1200,
  height: 630,
};

/**
 * A 1200×630 (1.91:1) JPEG crop of a product hero, the size Open Graph and X large cards expect.
 * Images are never upscaled, so a smaller raster hero fails the build. Social platforms do not
 * render SVG, so SVG (placeholder) heroes fall back to the default image.
 */
export async function socialImageFor(img: ImageMetadata, alt: string): Promise<SocialImage> {
  if (img.format === 'svg') return defaultSocialImage;
  if (img.width < 1200 || img.height < 630) {
    throw new Error(`Hero image ${img.src} is ${img.width}×${img.height}; it must be at least 1200×630 px.`);
  }
  const out = await getImage({ src: img, width: 1200, height: 630, fit: 'cover', format: 'jpg' });
  return { src: out.src, alt, width: Number(out.attributes.width), height: Number(out.attributes.height) };
}

const JSON_LD_CATEGORY = {
  game: 'GameApplication',
  app: 'MultimediaApplication',
  tool: 'DeveloperApplication',
  experience: 'EntertainmentApplication',
} as const;

const CURRENCIES: Record<string, string> = { $: 'USD', '€': 'EUR', '£': 'GBP' };

/** schema.org Offer, only when the price is known: free, or a "$4.99"-style string. */
function offer(d: Product['data']) {
  if (d.pricingModel === 'free' || d.pricingModel === 'free-with-in-app-purchases') {
    return { '@type': 'Offer', price: '0', priceCurrency: 'USD' };
  }
  const m = d.pricingModel === 'paid' ? d.price?.match(/^([$€£])\s?(\d+(?:\.\d{1,2})?)$/) : null;
  return m ? { '@type': 'Offer', price: m[2], priceCurrency: CURRENCIES[m[1]!] } : undefined;
}

export function productJsonLd(p: Product, pageUrl: string, image: SocialImage) {
  const d = p.data;
  const sameAs = Object.values(d.storeLinks).filter((v): v is string => !!v);
  const offers = offer(d);
  return {
    '@context': 'https://schema.org',
    '@type': d.type === 'game' ? 'VideoGame' : 'SoftwareApplication',
    name: d.title,
    description: d.summary,
    url: pageUrl,
    image: absolute(image.src),
    applicationCategory: JSON_LD_CATEGORY[d.type],
    operatingSystem: d.platforms.join(', '),
    ...(d.type === 'game' ? { gamePlatform: d.platforms } : {}),
    ...(d.releaseDate ? { datePublished: d.releaseDate.toISOString().slice(0, 10) } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(offers ? { offers } : {}),
    author: { '@type': 'Organization', name: site.name, url: absolute(url()) },
    publisher: { '@type': 'Organization', name: site.name, url: absolute(url()) },
  };
}
