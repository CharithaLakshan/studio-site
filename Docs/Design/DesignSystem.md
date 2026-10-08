# Design System — Converge

Final design (chosen 2026-10-08): Concept 3 "Converge" from `Docs/Design/Exploration/Concepts.md`, with two small touches from Concept 5. These are the two-ink wordmark and the hard offset print shadow on primary buttons and product cards.

Light only. Warm paper, black ink, one cobalt accent. Swiss: big confident headings, a numbered section rail, thin rules, spec tables. The home hero is a live path tracer.

Code source of truth: `src/styles/tokens.css` (tokens) and `src/styles/global.css` (base styles, rail, spec table, buttons, prose, helpers). If this doc and the code disagree, fix one of them in the same commit.

## Principles

- **Plain and printed.** It should look set in type and printed, not generated. No soft glows, gradient blobs, glassmorphism, sparkle icons or stock marketing words.
- **One accent.** Cobalt marks links, the primary action's shadow and focus. Everything else is ink on paper.
- **Square corners.** Rules and borders carry the structure. There are no radii anywhere.
- **Few tactile details:**
  - the wordmark's misregistered second ink;
  - the hard offset shadow on primary buttons, product cards and the featured card;
  - paper grain;
  - crop marks around the hero plate;
  - the dashed "Coming soon" buttons;
  - the four-square status gauge.

  Nothing else gets them.
- **Copy:** first person singular, short sentences, plain words.

## Tokens

### Colour

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--color-paper` | `#e7e5e0` | Page background. Also the path tracer's cove colour. | — |
| `--color-paper-2` | `#dcd9d2` | Image plates, placeholders, tiles | ink 13.4:1, ink-2 6.3:1, blue 6.4:1 |
| `--color-card` | `#f2f1ed` | Product cards, featured card | ink 16.7:1, ink-2 7.9:1, blue 8.0:1 |
| `--color-ink` | `#111111` | Text, rules, borders, footer background | 15.0:1 on paper |
| `--color-ink-2` | `#4a4a48` | Secondary text, disabled store buttons | 7.1:1 on paper |
| `--color-blue` | `#1d31c9` | Links, focus ring, print shadow, wordmark second ink | 7.1:1 on paper |
| `--color-on-blue` | `#ffffff` | Text on cobalt (rare) | 9.0:1 |
| `--color-blue-on-ink` | `#aab3ff` | Link hover and focus in the ink footer | 9.5:1 on ink |
| `--color-hairline` | ink at 28% | Decorative hairlines only | — |

Paper text on the ink footer: 15.0:1.

### Type

- Sans: **Space Grotesk** variable (300–700), self-hosted `src/assets/fonts/space-grotesk-variable-latin.woff2` (22 KB), preloaded.
- Mono: **Space Mono** 400 and 700, self-hosted (17 KB each). Used for labels, buttons, the rail numbers and the spp counter.
- Both OFL; licences sit next to the files. Total font weight is 55 KB.

| Token | Value | Use |
|---|---|---|
| `--step--1` | 0.8125rem | Labels, buttons, captions |
| `--step-0` | 1 → 1.125rem | Body |
| `--step-1` | 1.125 → 1.5rem | Lede, about text, feature rows |
| `--step-2` | 1.5 → 2.25rem | Card titles, price, prose h2 |
| `--step-3` | 2.25 → 5rem | Section h2 |
| `--step-4` | 2.75 → 8.5rem | `.display` (page h1) |
| `--step-num` | 3 → 6rem | Rail numbers |

- Headings: weight 700, line height 0.95 (display 0.88), tracking −0.035em (display −0.045em), `text-wrap: balance`.
- `.label`: Space Mono 700, `--step--1`, uppercase, tracking 0.04em.
- Body: 400, line height 1.55, measure 62ch.

### Space, layout, rules, shadows

- Space scale `--space-1` … `--space-9`: 4, 8, 12, 16, 24, 32, 48, 64, 96 px.
- `--gutter`: clamp(16px, 3.5vw, 48px). `--max-width`: 90rem.
- Breakpoints (in media queries): 40rem (hero 16:9), 56rem (rail grid, hero text split, readout row), 64rem (hero 21:9, storefront two-column, featured card two-column).
- `--rule`: 1px ink (table rows). `--rule-thick`: 3px ink (between page sections, under the header).
- `--shadow-print`: `4px 4px 0` cobalt (primary buttons). Hover: `6px 6px 0` plus a −2px nudge.
- `--shadow-card`: `6px 6px 0` ink (product cards; the featured card uses 8px). Hover: `8px 8px 0` cobalt plus a −2px nudge.

### Motion

Only the hover nudge (transform), shadows and colours animate, over `--dur-fast` (140 ms, `--ease-out`). `prefers-reduced-motion: reduce` sets the duration to 0. There is no scroll or entrance animation.

### Focus

`--focus-ring: 3px solid` cobalt, offset 3px, on `:focus-visible` everywhere. In the ink footer the ring is `--color-blue-on-ink`. A product card shows the ring around the whole card when its title link has focus.

## Signature elements

- **Path-traced hero** (`PathTracer.astro`): see below.
- **Numbered rail** (`Section.astro`): every content section is a 12-column grid. A 3-column rail on the left holds a big mono number (`01`, `02` …) and a mono label. The 9-column body holds the h2 and content. A 3px ink rule closes the section. Below 56rem the rail stacks above the body. Numbers count only the sections present on the page.
- **Two-ink wordmark** (`Wordmark.astro`): `site.name` as text in Space Grotesk 700, in ink. Each glyph has a cobalt `text-shadow` offset by about 0.06em, with a slightly different offset per glyph, like a hand-pulled print slightly out of register. In the footer the glyphs are paper-coloured. It works for any name.
- **Paper grain**: a 64px blue-noise tile of dark specks (`src/assets/paper-grain.png`, 3 KB, at most 4% opacity) on the body.

## Components

All components live in `src/components/`.

| Component | Spec |
|---|---|
| **Header** | Wordmark left (1.75rem). Nav right: Products, About, and Portfolio ↗ when `site.portfolioUrl` is set. Mono uppercase, 44px targets, no JavaScript and no menu toggle (three items fit at 360px). Current page: 3px cobalt underline. A 3px ink rule below. |
| **Footer** | Ink background. Big display links: Portfolio, YouTube, GitHub, Email; empty ones are hidden. Then a meta row: paper wordmark + tagline, Privacy, © year owner. |
| **SocialLinks** | `inline` (mono labels) or `big` (footer). External links get ↗ and `rel="me noopener"`. |
| **Section** | The numbered rail (see above). Props: `n`, `label`, `title`, `id`. |
| **PageHeader** | Mono kicker, display h1, optional lede and slot, with a 3px rule below. Used by Products, About, Privacy and product privacy pages. |
| **PathTracer** | The hero plate, readout and strip. See "Path-traced hero". |
| **FeaturedProduct** | Large card: 2px ink border, `--color-card`, 8px ink offset shadow. ≥64rem: media (7 of 12 columns, full height, cover) beside the body. Body: tagline, short spec table (Type, Platforms, Price, Status), store buttons in a row, and a primary "View <title> →" button. |
| **ProductCard** | 2px ink border, `--color-card`, 6px ink offset shadow. Hover or focus: −2px nudge and an 8px cobalt shadow. Contents: 16:9 media (decorative `alt=""`), mono type · platforms label, title (the link is stretched over the card), tagline, and a footer row with the price and status. |
| **ProductGrid** | `auto-fill, minmax(19rem, 1fr)`, 2rem gap, extra right and bottom padding for the shadows. |
| **StoreButtons** | Order: primary live store (`.button--primary`), other live stores (`.button`), planned stores (dashed, ink-2, "<Store> Coming soon" as plain text, not a link, not focusable). Live labels come from the store and status, e.g. "Wishlist on Steam" (pre-release), "Buy on Steam" (paid), "Get it on Google Play" (free). `stack` layout (buy box) adds a one-line note when any store is planned. |
| **StatusBadge** | Mono uppercase label after a four-square gauge filled to the stage: concept 1, in development 2, early access 3, released 4 (cobalt). |
| **SpecTable** | `.spec-table`: mono uppercase row headers, 1px ink rules. Rows: Type, Platforms, Price, Status, plus Release and Privacy in `full` mode. |
| **FeatureList** | `ol`; each row has a cobalt mono index (01, 02 …), `--step-1` text and a 1px rule. |
| **Gallery** | `auto-fill, minmax(16rem, 1fr)` grid of 16:9 thumbnails with 2px ink borders, each linking to the full image, with a `01 / 03` mono caption. |
| **Trailer** | 16:9 poster with 2px ink border and a primary "Play the … trailer" button. It is a real youtube.com link; with JS a click swaps in a youtube-nocookie iframe. Nothing loads from YouTube before the click. |
| **SystemRequirements** | `.spec-table` with Minimum and Recommended columns; scrolls sideways on narrow screens. |
| **Buttons** | `.button`: square, 2px ink border, mono uppercase `--step--1`, 44px tall. Hover inverts to an ink fill. `.button--primary`: ink fill, paper text, cobalt print shadow. |
| **Links** | Cobalt, 2px underline. Hover turns ink. |

## Path-traced hero

- **Renderer:**
  - Code: `src/scripts/path-tracer.ts` (WebGL2) and `src/scripts/path-tracer-hero.ts` (DOM wiring).
  - Scene: a white studio cove (floor, curved fillet, wall) with a matte cobalt, glass, chrome, black and white sphere under one spherical light.
  - Method: unidirectional path tracing with next-event estimation, up to 6 bounces and Russian roulette. A running average lives in a ping-pong RGBA32F (or RGBA16F) target, then ACES tone mapping.
  - Colour: the result is scaled so the cove equals `--color-paper`, and the plate's top and bottom fade into the page with a mask.
- **Plate:** 4:5 below 40rem, 16:9 to 64rem, 21:9 above. Crop marks sit in the four corners.
- **Readout:** a giant mono spp counter, a one-paragraph caption, Pause and Restart buttons, and a three-tile strip (1, 16 and 1024 spp).
- **Behaviour:**
  - **Before it runs,** and when it can't run (no WebGL2, no float targets, lost context), the plate shows a still frame rendered offline by the same code. The strip shows the matching 1, 16 and 1024 spp frames, so no tile is ever empty.
  - **Reduced motion:** the still frame stays. A "Render it live" button lets the visitor opt in.
  - **Start:** after first paint (`requestAnimationFrame`, then idle). The still hides, and the canvas renders one sample per pixel per frame.
  - **Budget:** device pixel ratio capped at 2, pixel budget 0.55 MP.
  - **Pausing:** pauses when the tab is hidden or the plate is off-screen.
  - **Stop:** at 1024 spp it stops completely; nothing runs until the light moves.
  - **Strip:** live frames are copied into the tiles at 1, 16 and 1024 spp. Moving the light resets them to the stills.
  - **Input:** click or drag (or arrow keys on the focused canvas) moves the light and restarts.
- **Fallback images:** `src/assets/hero/{wide-1024,tall-1024,strip-1,strip-16}.jpg`, served as responsive WebP. Regenerate them with `node scripts/render-hero-images.mjs` (Docs/HowTo/RenderHeroImages.md). The same script writes `public/og-default.jpg`.

## Placeholder art

Placeholders are SVG line drawings in ink with a cobalt line on `--color-paper-2`, labelled "PLACEHOLDER …" in a black box. Hero labels are centred so they survive the 16:9 and square crops. Alt text always says it is not a screenshot.
