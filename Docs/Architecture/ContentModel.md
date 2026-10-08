# Content Model

Source of truth: `src/content.config.ts`. The build fails on any invalid entry.

## Products — `src/content/products/<slug>.md`

One Markdown file per product. The frontmatter follows the schema below. The Markdown body is the long description ("What it is" on the product page); write it in first person.

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Product name. |
| `slug` | string, kebab-case | yes | **Permanent once published**: store listings link to `/products/<slug>/`. Must equal the file name. |
| `type` | `game` \| `app` \| `tool` \| `experience` | yes | Shown on cards and the product page. Chooses the JSON-LD type. |
| `tagline` | string, ≤90 chars | yes | One line. Product header, cards, page title. |
| `summary` | string, ≤200 chars | yes | Meta description, social description, JSON-LD description. |
| `status` | `concept` \| `in-development` \| `early-access` \| `released` | yes | Status gauge. Also picks store button verbs (see below). |
| `platforms` | list of `Windows PC VR` \| `Meta Quest` \| `Android` \| `Windows` \| `Web` | yes, ≥1 | Groups the products index (a product appears under each of its platforms). To add one, edit `PLATFORMS` in `content.config.ts` and `PLATFORM_GROUP_LABELS` in `src/lib/products.ts`. |
| `price` | string, ≤24 chars | no | Shown exactly as written, e.g. `"Free"`, `"$4.99"`. Never guess it. |
| `pricingModel` | `free` \| `paid` \| `free-with-in-app-purchases` \| `tba` | no (default `tba`) | See "Price label". |
| `features` | list of strings | no (default `[]`) | Key features, one sentence each. Section hidden when empty. |
| `featured` | boolean | no (default `false`) | The first featured product by `order` is shown on Home. |
| `draft` | boolean | no (default `false`) | `true` = validated but never built (no page, no card, no sitemap entry). |
| `releaseDate` | date `YYYY-MM-DD` | no | Only when public. Specs table and JSON-LD. |
| `heroImage` | `{ src, alt }` | yes | `src` is relative to the Markdown file, inside `src/assets/products/<slug>/`. `alt` is required. Ideal 2100×900 (21:9). It is cropped to 16:9 (cards, product page) and to about square (featured card on desktop), so keep the subject central. |
| `screenshots` | list of `{ src, alt }` | no (default `[]`) | 16:9 recommended. |
| `trailerYouTubeId` | 11-character ID | no | The ID only, not a URL. Loaded only on click. |
| `storeLinks` | map of store key → URL | no (default `{}`) | **Live** store pages. Keys: `steam`, `metaHorizon`, `googlePlay`, `itch`, `github`, `website`. Every value must be a full URL. |
| `plannedStores` | list of store keys | no (default `[]`) | Stores without a page yet. Each shows as a disabled "Coming soon" button until a URL is added to `storeLinks` (then it is live, even if still listed here). |
| `primaryStore` | store key | no | The live store that gets the big first button. Must have a URL. Default: the first live store in key order (Steam, Meta Horizon Store, Google Play, itch.io, GitHub, website). |
| `systemRequirements` | `{ minimum: {label: value}, recommended?: {label: value} }` | no | Free-form rows, rendered as a table. |
| `hasPrivacyPolicy` | boolean | no (default `false`) | `true` requires `src/content/product-privacy/<slug>.md`, otherwise the build fails. |
| `order` | integer | no (default `100`) | Lower comes first. Ties sort by title. |

### Price label (`priceLabel()` in `src/lib/products.ts`)

| `pricingModel` | `price` set | `price` missing |
|---|---|---|
| `tba` | "Price TBA" (price ignored) | "Price TBA" |
| `paid` | the price, e.g. "$4.99" | "Price TBA" |
| `free` | the price, e.g. "Free" | "Free" |
| `free-with-in-app-purchases` | "<price> · in-app purchases" | "Free · in-app purchases" |

JSON-LD gets an `Offer` only when the price is known: free models (price 0), or a paid price written as `$`, `€` or `£` followed by a number.

### Store buttons (`storeButtons()` in `src/lib/products.ts`)

Order: the primary live store (filled button with the print shadow), the other live stores, then the planned stores ("Coming soon", dashed, not a link).

| Status | Steam, Meta Horizon Store | Google Play, itch.io | GitHub | Website |
|---|---|---|---|---|
| `concept`, `in-development` | Wishlist on … | View on … | View on GitHub | Visit the website |
| `early-access`, `released` | Buy on … (paid) / Get it on … | Buy on … (paid) / Get it on … | Download from GitHub | Get it from the website |

Rules enforced in code (`src/lib/products.ts` and the schema):

- Drafts are filtered in one place (`getProducts`).
- The slug must equal the entry id.
- A privacy flag without a file fails the build.
- `primaryStore` must have a URL.
- Store links must be URLs.

## Product privacy — `src/content/product-privacy/<slug>.md`

| Field | Type | Required | Notes |
|---|---|---|---|
| `lastUpdated` | date | yes | Shown under the title. |

The body is the policy in Markdown. The page adds a "Who is responsible" section from the site config. Do not write the studio name in the Markdown; the page template inserts it.

## Site config — `src/config/site.ts`

| Field | Notes |
|---|---|
| `name` | Studio name; the text wordmark. |
| `headline` | Home h1. |
| `tagline` | One line under the headline. Also the default meta description, the home title and the footer line. |
| `owner` | `name`, `alias`, `location`. |
| `email` | Public contact; empty hides every email link. |
| `portfolioUrl` | Personal portfolio; empty hides every portfolio link and sentence. |
| `socials` | `youtube`, `github`; empty hides the link. |
| `url`, `base` | Deployment (see Architecture.md). |
| `defaultSocialImage`, `defaultSocialImageAlt` | `public/og-default.jpg` and its alt text. |
| `lang`, `locale` | `<html lang>` and Open Graph locale. |

## Example — Rotunda

```yaml
---
title: Rotunda
slug: rotunda
type: app
tagline: A VR video player for 360°, 180° and flat video.
summary: Rotunda is a Windows PC VR video player for 360°, 180° and flat video, in mono or stereo, built on its own FFmpeg-based decoders.
status: in-development
platforms:
  - Windows PC VR
pricingModel: tba
features:
  - Plays 360° video, surrounding you completely.
  - …
featured: true
draft: false
heroImage:
  src: ../../assets/products/rotunda/placeholder-hero.svg
  alt: Placeholder art for Rotunda, not a screenshot. …
screenshots:
  - src: ../../assets/products/rotunda/placeholder-360.svg
    alt: Placeholder art, not a screenshot. …
storeLinks: {}
plannedStores:
  - steam
  - metaHorizon
hasPrivacyPolicy: false
order: 1
---
```

The full file, with its `TODO(charitha)` comments, is `src/content/products/rotunda.md`. The template for new products is `src/content/products/sample-product.md` (`draft: true`); it shows every field, including live links, a primary store and a price.
