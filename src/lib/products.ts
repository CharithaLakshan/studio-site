import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { PLATFORMS, PRODUCT_TYPES, STATUSES, STORE_KEYS } from '../content.config';
import { url } from './url';

export type Product = CollectionEntry<'products'>;
export type ProductType = (typeof PRODUCT_TYPES)[number];
export type Status = (typeof STATUSES)[number];
export type Platform = (typeof PLATFORMS)[number];
export type StoreKey = (typeof STORE_KEYS)[number];

export const TYPE_LABELS: Record<ProductType, { one: string; many: string }> = {
  game: { one: 'Game', many: 'Games' },
  app: { one: 'App', many: 'Apps' },
  tool: { one: 'Tool', many: 'Tools' },
  experience: { one: 'Experience', many: 'Experiences' },
};

export const STATUS_LABELS: Record<Status, string> = {
  concept: 'Concept',
  'in-development': 'In development',
  'early-access': 'Early access',
  released: 'Released',
};

/** Short headings for the products index. */
export const PLATFORM_GROUP_LABELS: Record<Platform, string> = {
  'Windows PC VR': 'PC VR',
  'Meta Quest': 'Meta Quest',
  Android: 'Android',
  Windows: 'Windows',
  Web: 'Web',
};

export const STORE_NAMES: Record<StoreKey, string> = {
  steam: 'Steam',
  metaHorizon: 'Meta Horizon Store',
  googlePlay: 'Google Play',
  itch: 'itch.io',
  github: 'GitHub',
  website: 'Website',
};

/** Every published product, sorted. Drafts never leave this function. */
export async function getProducts(): Promise<Product[]> {
  const products = await getCollection('products', ({ data }) => !data.draft);
  for (const p of products) {
    if (p.id !== p.data.slug) {
      throw new Error(`Product "${p.id}": slug "${p.data.slug}" must match the entry id.`);
    }
  }
  return products.sort(
    (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
  );
}

export async function getFeaturedProduct(): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.data.featured) ?? products[0];
}

/** Products grouped by platform, in PLATFORMS order. A product on two platforms is in both groups. */
export function groupByPlatform(products: Product[]) {
  return PLATFORMS.map((platform) => ({
    platform,
    id: platform.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    label: PLATFORM_GROUP_LABELS[platform],
    items: products.filter((p) => p.data.platforms.includes(platform)),
  })).filter((g) => g.items.length > 0);
}

/** "Free", "$4.99", "Free · in-app purchases" or "Price TBA". Never invents a price. */
export function priceLabel(d: Product['data']): string {
  if (d.pricingModel === 'tba') return 'Price TBA';
  const price = d.price ?? (d.pricingModel === 'paid' ? undefined : 'Free');
  if (!price) return 'Price TBA';
  return d.pricingModel === 'free-with-in-app-purchases' ? `${price} · in-app purchases` : price;
}

const isReleased = (s: Status) => s === 'released' || s === 'early-access';

/** Button text for a live store, from the store, the status and the pricing model. */
function actionLabel(store: StoreKey, d: Product['data']): string {
  const name = STORE_NAMES[store];
  if (!isReleased(d.status)) {
    if (store === 'steam' || store === 'metaHorizon') return `Wishlist on ${name}`;
    if (store === 'website') return 'Visit the website';
    return `View on ${name}`;
  }
  if (store === 'website') return 'Get it from the website';
  if (store === 'github') return 'Download from GitHub';
  return d.pricingModel === 'paid' ? `Buy on ${name}` : `Get it on ${name}`;
}

export interface StoreButton {
  key: StoreKey;
  name: string;
  /** Visible text: an action for live stores, the store name for planned ones. */
  label: string;
  href?: string;
  primary: boolean;
}

/**
 * Store buttons in display order: the primary live store, the other live stores, then planned
 * stores ("Coming soon"). A store with a URL is live even if it is also listed as planned.
 */
export function storeButtons(d: Product['data']): StoreButton[] {
  const live = STORE_KEYS.filter((k) => d.storeLinks[k]);
  const primary = d.primaryStore ?? live[0];
  const ordered = primary ? [primary, ...live.filter((k) => k !== primary)] : live;
  const planned = STORE_KEYS.filter((k) => d.plannedStores.includes(k) && !d.storeLinks[k]);
  return [
    ...ordered.map((key) => ({
      key,
      name: STORE_NAMES[key],
      label: actionLabel(key, d),
      href: d.storeLinks[key],
      primary: key === primary,
    })),
    ...planned.map((key) => ({ key, name: STORE_NAMES[key], label: STORE_NAMES[key], primary: false })),
  ];
}

/** The privacy policy entry for a product. Fails the build if the flag and the file disagree. */
export async function getPrivacyPolicy(product: Product) {
  const entry = await getEntry('productPrivacy', product.data.slug);
  if (!entry) {
    throw new Error(
      `Product "${product.data.slug}" has hasPrivacyPolicy: true but src/content/product-privacy/${product.data.slug}.md is missing.`,
    );
  }
  return entry;
}

export const productUrl = (p: Product) => url(`products/${p.data.slug}/`);
export const privacyUrl = (p: Product) => url(`products/${p.data.slug}/privacy/`);

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** Two-digit section numbers for the rail: 1 -> "01". */
export const pad2 = (n: number) => String(n).padStart(2, '0');
