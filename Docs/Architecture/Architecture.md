# Architecture

## Stack

- **Astro 7** (static output), **TypeScript 6** strict (`astro/tsconfigs/strict`), npm.
- Integrations: `@astrojs/sitemap`. Dev: `@astrojs/check`.
- Plain CSS with custom-property tokens. No CSS or UI framework.
- Client JS: two tiny inline module scripts (mobile nav, trailer click-to-load). Everything else is HTML and CSS.
- Images: `astro:assets` (`<Image>`, `getImage`, sharp). Raster images get WebP `srcset`s; SVGs pass through unchanged.
- Hosting: GitHub Pages through GitHub Actions. No backend, CMS, database, analytics or cookies.

## Folder structure

```
.github/workflows/deploy.yml   Build (check + build) and deploy to Pages on push to main
astro.config.ts                site + base read from src/config/site.ts; sitemap; trailingSlash 'always'
public/                        Copied as-is: favicon.svg, apple-touch-icon.png, og-default.png
src/
  config/site.ts               THE brand file: name, tagline, intro, owner, email, socials, url, base, default social image
  content.config.ts            Collections + Zod schemas (products, productPrivacy); PLATFORMS/TYPES/STATUSES enums
  content/
    products/<slug>.md         One file per product (sample-product.md = draft template)
    product-privacy/<slug>.md  Optional per-product privacy policy
  assets/
    fonts/                     Archivo + JetBrains Mono WOFF2 and OFL licences
    products/<slug>/           Hero, screenshots (placeholders are placeholder-*.svg)
    blue-noise.png             Dither tile, inlined into CSS
  styles/tokens.css            @font-face + design tokens
  styles/global.css            Reset, type, links, focus, prose, layout, buttons, light-field, helpers
  layouts/BaseLayout.astro     <head> SEO (title, description, canonical, OG, Twitter, JSON-LD), header, main, footer
  components/                  Header, Footer, Wordmark, SocialLinks, PageHeader, ProductCard, ProductGrid,
                               FeaturedProduct, StatusBadge, StoreButtons, SpecSheet, FeatureList, Gallery,
                               Trailer, SystemRequirements
  lib/
    url.ts                     url(path) adds the base path; absolute(path) adds the site origin
    products.ts                getProducts (drops drafts, checks slugs), getFeaturedProduct, getPrivacyPolicy, labels, STORES
    seo.ts                     default/product social image, product JSON-LD
    images.ts                  responsive(): srcset props for raster images only
  pages/
    index.astro                Home
    about.astro, privacy.astro, 404.astro
    robots.txt.ts              robots.txt with the sitemap URL
    products/index.astro       Products grouped by type
    products/[slug]/index.astro    Product page (getStaticPaths over getProducts)
    products/[slug]/privacy.astro  Product privacy (only products with hasPrivacyPolicy)
```

## How the pieces fit

1. **Config.** `src/config/site.ts` exports a single `site` object. Components and pages import it for every brand or identity value. `astro.config.ts` imports it for `site` (origin) and `base` (path).
2. **Content.** `content.config.ts` defines the `products` and `productPrivacy` collections with glob loaders and Zod schemas. Images go through `image()`, so paths are checked at build time and processed by `astro:assets`.
3. **Data access.** Pages never call `getCollection` directly. They use `src/lib/products.ts`, which removes drafts, validates slugs and sorts by `order` then title.
4. **Layout.** Every page renders inside `BaseLayout`, passing `title`, `description`, optional `image` (social), `jsonLd` and `noindex`. The title format is `Page — Studio`; the home page uses `Studio — Tagline`.
5. **Components** are pure Astro components with scoped styles that read tokens. Only `Header` and `Trailer` include a script.

## Build and deploy flow

```
push to main
  → Actions: checkout → withastro/action (Node 24, npm ci, npm run check && npm run build, upload dist/)
  → actions/deploy-pages → https://charithalakshan.github.io/studio-site/
```

Locally, `npm run build` writes `dist/` and `npm run preview` serves it at `http://localhost:4321/studio-site/`.

## Site URL and base path

- `site.url` (origin) and `site.base` (path prefix) live in `src/config/site.ts`.
- Internal links are always built with `url('products/')`. It reads `import.meta.env.BASE_URL`, so the same code works under `/studio-site/` or `/`.
- Absolute URLs (canonical, OG image, JSON-LD, sitemap, robots) are built with `absolute(...)` from `site.url`, or with Astro's `site`.
- CSS asset URLs (fonts, noise) are relative imports, so Vite rewrites them with the base.
- `trailingSlash: 'always'`: every page URL ends in `/`, which matches GitHub Pages' directory output.
- **Custom domain later:** set `url: 'https://yourdomain'` and `base: '/'`, then add the domain in the GitHub Pages settings. See Docs/HowTo/Deploy.md.

## Brand swap

Everything that names the studio or the owner reads from `site.ts`: the wordmark, titles, meta, OG `site_name`, JSON-LD author and publisher, About, the privacy pages, the footer and alt text for the default social image. The favicon and default social image contain no text. Markdown content must not mention the studio name. Tested in Stage 2 (see SessionLog): after renaming, the old name appears nowhere in `dist/` or in `src/`. Procedure: Docs/HowTo/RenameBrand.md.

## Guarantees and checks

- `npm run check` (astro check) and `npm run build` must pass with no errors or warnings. CI runs both.
- Drafts never reach `dist/`. Note: Astro still bundles a draft's images into `_astro/`, but no page links to them.
- The build fails if a product flags a privacy policy that doesn't exist, or if a slug doesn't match its entry id.
