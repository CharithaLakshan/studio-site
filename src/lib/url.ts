import { site } from '../config/site';

/** Site-relative link that respects the base path: url('products/') -> '/studio-site/products/'. */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

/** Absolute URL for a path that already includes the base (e.g. Astro.url.pathname, getImage().src). */
export function absolute(pathWithBase: string): string {
  return new URL(pathWithBase, site.url).href;
}
