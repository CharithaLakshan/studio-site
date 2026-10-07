import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { site } from '../config/site';
import { absolute, url } from './url';
import type { Product } from './products';

export interface SocialImage {
  src: string;
  alt: string;
}

export const defaultSocialImage: SocialImage = {
  src: url(site.defaultSocialImage),
  alt: site.defaultSocialImageAlt,
};

/** Social platforms do not render SVG, so SVG (placeholder) heroes fall back to the default image. */
export async function socialImageFor(img: ImageMetadata, alt: string): Promise<SocialImage> {
  if (img.format === 'svg') return defaultSocialImage;
  const out = await getImage({ src: img, width: 1200, format: 'jpg' });
  return { src: out.src, alt };
}

const JSON_LD_CATEGORY = {
  game: 'GameApplication',
  app: 'MultimediaApplication',
  tool: 'DeveloperApplication',
  experience: 'EntertainmentApplication',
} as const;

export function productJsonLd(p: Product, pageUrl: string, image: SocialImage) {
  const d = p.data;
  const sameAs = Object.values(d.storeLinks).filter((v): v is string => !!v);
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
    author: { '@type': 'Organization', name: site.name, url: absolute(url()) },
    publisher: { '@type': 'Organization', name: site.name, url: absolute(url()) },
  };
}
