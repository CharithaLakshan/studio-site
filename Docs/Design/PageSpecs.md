# Page Specs

The site is a product showcase: it presents what I make and sends people to the right store. Background, projects and research live on the separate portfolio, which this site only links to.

Every page uses `BaseLayout`: skip link → Header → `<main id="main">` → Footer (ink). Desktop is ≥64rem unless noted; mobile is 390px. "Rail" means a numbered `Section` (big number + label on the left, h2 + content on the right; stacked on mobile).

## Home — `/`

```
DESKTOP                                             MOBILE
[LKY]                 PRODUCTS  ABOUT  (PORTFOLIO↗) [LKY]  PRODUCTS ABOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ━━━━━━━━━━━━━━━━━━━━━━
HEADLINE (display h1, 8 col)     tagline (4 col)    HEADLINE (display h1)
┌ crop marks ── plate: rest of the first screen ┐   tagline
│               (still → live canvas)            │   ┌ plate 4:5 ┐
└───────────────────────────────────────────────┘   └───────────┘
0384 spp   caption (one paragraph)   [PAUSE][RESTART] 0384 spp
[1 spp tile]   [16 spp tile]   [1024 spp tile]      caption, buttons
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   [1][16][1024] tiles
01           Rotunda (h2)                           01 FEATURED PRODUCT
FEATURED     ┌ featured card ─────────────────┐     Rotunda
PRODUCT      │ media 7/12 │ tagline           │     ┌ media 16:9 ┐
             │            │ spec table        │     │ tagline     │
             │            │ [store buttons]   │     │ spec table  │
             │            │ [VIEW ROTUNDA →]  │     │ buttons     │
             └────────────────────────────────┘■    └─────────────┘■
02           Products (h2)                          02 …
EVERYTHING   [card] [card] [card]                   [card]
I MAKE       [ALL PRODUCTS BY PLATFORM →]           [ALL PRODUCTS …]
03           About (h2)                             03 …
WHO MAKES    2–3 sentences, first person            text
THESE        PORTFOLIO↗ YOUTUBE↗ GITHUB↗            links
footer (ink): big links, wordmark + tagline, Privacy, ©
```

- **Hero:** `site.headline` as h1, with `site.tagline` beside it on desktop and below it on mobile, then the path tracer (DesignSystem.md, "Path-traced hero").
- **01 Featured:** the first product with `featured: true` by `order`, or else the first product. The rail h2 is the product title.
- **02 Products:** every published product (including the featured one), then a link to the index.
- **03 About:** owner name, alias and location from config, plus one sentence on what each product page offers. A portfolio sentence and link appear only when `site.portfolioUrl` is set.

## Products index — `/products/`

```
1 PRODUCT (label)
Products (display h1)
lede: grouped by platform, listed under each platform it runs on
[PC VR · 1] [META QUEST · 2] …          ← jump buttons, only when 2+ groups
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
01  1 PRODUCT   PC VR (h2)
                [card] [card] …
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
02  2 PRODUCTS  Meta Quest (h2) …
```

- **Grouping:** by platform, in `PLATFORMS` order (PC VR, Meta Quest, Android, Windows, Web). Headings use short names (`PLATFORM_GROUP_LABELS`; "Windows PC VR" → "PC VR").
- **Multi-platform products:** a product appears in every group it belongs to.
- **Empty groups:** hidden.
- **No JavaScript.**

## Product page (storefront) — `/products/<slug>/`

```
DESKTOP                                             MOBILE
← ALL PRODUCTS                                      ← ALL PRODUCTS
APP · WINDOWS PC VR                                 APP · WINDOWS PC VR
Title (display h1)                                  Title
tagline                                             tagline
┌ hero media 16:9 (8 col) ──┐  PRICE                ┌ hero 16:9 ┐
│                           │  Price TBA (big)      └───────────┘
│                           │  STATUS   ■■□□ IN DEV PRICE / Price TBA
│                           │  PLATFORMS …          status, platforms
└───────────────────────────┘  [Wishlist on Steam↗] [primary store]
                               [Other store ↗]      [other stores]
                               [Meta ┆ Coming soon] [coming soon]
                               note · Privacy policy note, privacy link
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ━━━━━━━━━━━━━━━━
01 OVERVIEW      What it is: Markdown body          rail sections, stacked
02 VIDEO         Trailer (click to load)            in the same order
03 N IMAGES      Screenshots 01/03 …
04 FEATURES      What it does: 01 … rows
05 DETAILS       Specs: Type, Platforms, Price,
                 Status, Release, Privacy
06 HARDWARE      System requirements table
```

- **Buy box:** sticky at ≥64rem. On mobile it follows the hero image, so store buttons are one short scroll away.
- **Section order and numbering:** Overview and Specs always appear. Trailer, Screenshots, Features and System requirements appear only when their data exists, and the numbers close up.
- **Price label:** `priceLabel()`:
  - `tba` or a missing paid price → "Price TBA";
  - free without a price → "Free";
  - free with in-app purchases → "Free · in-app purchases".
- **Store buttons:** primary live store first, then other live stores, then planned stores as "Coming soon".
- **Head:** JSON-LD (`VideoGame` or `SoftwareApplication`, with an `Offer` only when the price is known) and a product social image (raster heroes only).

## Product privacy — `/products/<slug>/privacy/`

Built only when `hasPrivacyPolicy: true`.

1. PageHeader: kicker "<Product> · <Studio>", h1 "Privacy policy", last updated.
2. Markdown body (prose).
3. "Who is responsible": studio and owner from config, plus email or GitHub contact.
4. Back button to the product.

## About — `/about/`

1. PageHeader: kicker is the studio name, h1 "About".
2. Three short first-person paragraphs: the studio is one person (name, alias, location); what I make, that some is free and some paid, and that each product links to its store; the site is only about products, with background, projects and research on the portfolio. Without a portfolio URL, that last sentence points to the links instead.
3. Primary "See the products →" button.
4. Social links.

## Privacy — `/privacy/`

1. PageHeader: last updated.
2. Short version: no analytics, no cookies, self-hosted assets, no forms.
3. The live image runs only on your device.
4. Hosting (GitHub Pages).
5. Trailers load from YouTube only after a click.
6. Outbound store links.
7. Contact.

## 404 — `/404.html`

A big mono "404" in the rail style, display h1 "No page here.", and a lede saying the products are still where they were. Then [See all products] (primary) and [Go home]. `noindex`, no canonical, excluded from the sitemap.
