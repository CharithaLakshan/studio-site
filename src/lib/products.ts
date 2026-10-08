import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { PRODUCT_TYPES, STATUSES } from '../content.config';
import { url } from './url';

export type Product = CollectionEntry<'products'>;
export type ProductType = (typeof PRODUCT_TYPES)[number];
export type Status = (typeof STATUSES)[number];

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

/** Display order and names of store buttons. */
export const STORES = [
  ['steam', 'Steam'],
  ['metaHorizon', 'Meta Horizon Store'],
  ['googlePlay', 'Google Play'],
  ['itch', 'itch.io'],
  ['github', 'GitHub'],
  ['website', 'Website'],
] as const;

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
