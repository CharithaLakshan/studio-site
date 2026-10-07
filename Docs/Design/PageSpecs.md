# Page Specs

Every page uses `BaseLayout`: skip link → Header → `<main id="main">` → Footer. Wireframes show content order. Desktop is ≥64rem unless noted; mobile is 390px.

## Home — `/`

```
DESKTOP                                         MOBILE
[wordmark]                  PRODUCTS  ABOUT     [wordmark]        [≡ MENU]
(light pool)                                    TAGLINE (display h1)
TAGLINE (display h1, ≤16ch)                     studio intro (lede)
studio intro (lede)                             ┌ featured 16:9 image ┐
┌──────────── featured, 21:9 ────────────┐      └─────────────────────┘
│ FEATURED · TYPE · PLATFORMS            │      label / title / tagline
│ Title / tagline                        │      [View →]  (status)
│ [View →]  (status)                     │      Products   ALL BY TYPE
└────────────────────────────────────────┘      [card]
Products                     ALL BY TYPE        [card] …
[card] [card] [card]                            The studio
The studio  │ one line + About link             text, About link
            │ YOUTUBE  GITHUB  (EMAIL)          links
footer                                          footer
```

Hierarchy: tagline → featured product → all products → studio. The featured product is the first with `featured: true` by `order`, or else the first product. The grid shows all published products, including the featured one.

## Products index — `/products/`

```
Products (h1) + lede
[Games n] [Apps n] …        ← jump links, only when 2+ types exist
Apps (h2)                n
[card] [card] [card]
Games (h2)               n
…
```

Grouped by type in a fixed order: games, apps, tools, experiences. Empty groups are hidden. No JS filtering.

## Product page — `/products/<slug>/`

```
DESKTOP                                            MOBILE
┌──────── hero image, 21:9, vignette ───────┐      hero 4:3
│ ← ALL PRODUCTS                            │      ← ALL PRODUCTS
│ Title (display h1)                        │      Title / tagline
│ tagline                                   │      ┌ spec sheet ┐
└───────────────────────────────────────────┘      │ status…    │
description (prose)          ┌ spec sheet ┐        │ store btns │
Key features 01…              │ status     │        └────────────┘
Trailer (if id)              │ type       │        description
Screenshots (01/03…)          │ platforms  │        features
System requirements (if any) │ release    │        trailer / screenshots
                             │ [stores]   │        sysreq
                             │ privacy    │
                             └── sticky ──┘
```

The spec sheet comes first in the DOM, so it sits directly under the hero on mobile and store buttons are reached without scrolling. A CSS grid moves it to the right column at ≥64rem. Each optional section is hidden when its data is empty. JSON-LD and a product social image are in the head.

## Product privacy — `/products/<slug>/privacy/`

Built only when `hasPrivacyPolicy: true`. PageHeader (label "Product · Studio", h1 "<Product> privacy policy", last updated) → Markdown body (prose) → "Who is responsible" (studio and owner from config, email or GitHub contact) → back link.

## About — `/about/`

PageHeader (label = studio name, lede = intro) → The studio → The person behind it (owner name, alias, role, study, tools, interests) → Find me (social links).

## Privacy — `/privacy/`

PageHeader (last updated) → short version (no analytics, no cookies, self-hosted assets, no forms) → hosting (GitHub Pages) → trailers (YouTube only after a click) → outbound links → contact.

## 404 — `/404.html`

A light-field section: label "404", display "Nothing is lit here.", lede, then [Go home] [See all products]. `noindex`, no canonical, excluded from the sitemap.
