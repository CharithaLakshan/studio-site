# Content Model

Source of truth: `src/content.config.ts`. The build fails on any invalid entry.

## Products — `src/content/products/<slug>.md`

One Markdown file per product. The frontmatter follows the schema below. The Markdown body is the long description shown on the product page.

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Product name. |
| `slug` | string, kebab-case | yes | **Permanent once published**: store listings link to `/products/<slug>/`. Becomes the entry id. |
| `type` | `game` \| `app` \| `tool` \| `experience` | yes | Groups the products index. Chooses the JSON-LD type. |
| `tagline` | string, ≤90 chars | yes | One line. Hero, cards, page title. |
| `summary` | string, ≤200 chars | yes | Meta description, social description, JSON-LD description. |
| `status` | `concept` \| `in-development` \| `early-access` \| `released` | yes | Status badge. |
| `platforms` | list of `Windows PC VR` \| `Meta Quest` \| `Android` \| `Windows` \| `Web` | yes, ≥1 | To add a platform, edit `PLATFORMS` in `content.config.ts`. |
| `features` | list of strings | no (default `[]`) | Key features, one sentence each. Hidden when empty. |
| `featured` | boolean | no (default `false`) | The first featured product by `order` is shown on Home. |
| `draft` | boolean | no (default `false`) | `true` = validated but never built (no page, no card, no sitemap entry). |
| `releaseDate` | date `YYYY-MM-DD` | no | Only when public. Shown in the spec sheet and JSON-LD. |
| `heroImage` | `{ src, alt }` | yes | `src` is a path relative to the Markdown file, inside `src/assets/products/<slug>/`. `alt` is required. Ideal size 2100×900 (21:9). Crops to 16:9 on cards and 4:3 on the mobile hero, so keep the subject central. |
| `screenshots` | list of `{ src, alt }` | no (default `[]`) | 16:9 recommended. |
| `trailerYouTubeId` | 11-character ID | no | The ID only, not a URL. Loaded only on click. |
| `storeLinks` | object | no (default `{}`) | Keys: `steam`, `metaHorizon`, `googlePlay`, `itch`, `github`, `website`. Each is a **URL** (live button), **`''`** (disabled "Coming soon" button) or **omitted** (not shown). |
| `systemRequirements` | `{ minimum: {label: value}, recommended?: {label: value} }` | no | Free-form rows, rendered as a table. |
| `hasPrivacyPolicy` | boolean | no (default `false`) | `true` requires `src/content/product-privacy/<slug>.md`, otherwise the build fails. |
| `order` | integer | no (default `100`) | Lower comes first. Ties sort by title. |

Rules enforced in code (`src/lib/products.ts`): drafts are filtered in one place (`getProducts`), the slug must equal the entry id, and a privacy flag without a file fails the build.

## Product privacy — `src/content/product-privacy/<slug>.md`

| Field | Type | Required | Notes |
|---|---|---|---|
| `lastUpdated` | date | yes | Shown under the title. |

The body is the policy in Markdown. The page adds a "Who is responsible" section from the site config. Do not write the studio name in the Markdown; the page template inserts it.

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
features:
  - Plays 360° video, surrounding you completely.
  - Plays 180° video in front of you.
  - Plays flat video on a screen in VR.
  - Supports mono and stereoscopic video.
  - Decodes video with its own FFmpeg-based decoders.
  - Built in Unity for Windows PC VR.
featured: true
draft: false
heroImage:
  src: ../../assets/products/rotunda/placeholder-hero.svg
  alt: Placeholder art for Rotunda, not a screenshot. …
screenshots:
  - src: ../../assets/products/rotunda/placeholder-360.svg
    alt: Placeholder art, not a screenshot. …
storeLinks:
  steam: ''
  metaHorizon: ''
hasPrivacyPolicy: false
order: 1
---
```

The full file, with its `TODO(charitha)` comments, is `src/content/products/rotunda.md`. The template for new products is `src/content/products/sample-product.md` (`draft: true`).
