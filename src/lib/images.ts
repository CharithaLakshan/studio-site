import type { ImageMetadata } from 'astro';

/** srcset props for raster images; SVGs scale on their own, so they get none. */
export function responsive(img: ImageMetadata, widths: number[], sizes: string) {
  return img.format === 'svg' ? {} : { widths, sizes };
}
