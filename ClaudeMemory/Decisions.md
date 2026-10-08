# Decisions

Newest last. Format: date — decision. Options considered. Reason.

## 2026-10-07 — Stage 1 stopped after Step A

- **Decision:** Stage 1 ended after `Docs/Design/DesignDirections.md` (three directions, Key Light recommended). Step B docs were not written because no direction had been chosen.
- **Reason:** The brief said to stop and wait for a choice.

## 2026-10-07 — Adopt Key Light without an explicit choice

- **Decision:** Stage 2 started with no recorded direction choice, so the recommended direction, **Key Light**, was adopted as written in DesignDirections.md. No parts from Viewport or Atrium were mixed in.
- **Options:** (a) stop and ask; (b) adopt the recommendation; (c) mix directions.
- **Reason:** The Stage 2 instruction said that if the spec was wrong or conflicting, pick the simplest fix, log it and keep going. Adopting the recommendation is the simplest fix. Changing direction later means editing `src/styles/tokens.css` and a few component styles.

## 2026-10-07 — Write the missing Stage 1 spec docs during Stage 2

- **Decision:** DesignSystem.md, PageSpecs.md, Architecture.md, ContentModel.md, Roadmap.md, HowTo/*, CLAUDE.md and ClaudeMemory/* were written in Stage 2 to describe what was built. The HTML mockups (`Docs/Design/Mockups/*.html`) were **not** made.
- **Options:** write the mockups first, or skip them.
- **Reason:** The mockups were meant to help judge a design before building it. The real site now serves that purpose (`npm run dev`), and a second copy of the design would drift out of date.

## 2026-10-07 — Stack versions

- **Decision:** Astro 7.3 (current stable), TypeScript 6 (strict), `@astrojs/sitemap`, `@astrojs/check`. Node ≥ 22.12 locally; CI uses Node 24 (current LTS, `.nvmrc`).
- **Options:** TypeScript 7 (the latest).
- **Reason:** `@astrojs/check` 0.9 peers on TypeScript 5 or 6, not 7.

## 2026-10-07 — Fonts are vendored files, not npm packages

- **Decision:** The Archivo (variable weight and width) and JetBrains Mono (variable weight) Latin WOFF2 files were extracted once from the Fontsource tarballs and committed to `src/assets/fonts/` with their OFL licences. The `@font-face` rules are in `tokens.css`.
- **Options:** `@fontsource-variable/*` npm packages; the Astro Fonts API with a remote provider.
- **Reason:** No new dependency and no network access at build time. Vite fingerprints the files and applies the base path. Only Archivo is preloaded.

## 2026-10-07 — Dark only, no theme toggle

- **Decision:** One dark theme, with `color-scheme: dark`.
- **Reason:** Key Light is a dark direction. A toggle would add JavaScript and double the contrast testing for no clear gain.

## 2026-10-07 — Brand-free favicon and default social image

- **Decision:** The favicon (`public/favicon.svg`), the apple-touch icon and `public/og-default.png` are abstract key-light art with no text.
- **Reason:** Renaming the studio needs no image regeneration at all. The name still reaches social cards through `og:title`.

## 2026-10-07 — Content model refinements over the brief

- **Decision:**
  - Added a `features` field (string list), because the brief's product page needs key features.
  - `heroImage` and `screenshots` are `{ src, alt }` objects, so alt text is required by the schema.
  - `platforms` is a fixed enum of display names.
  - Store link semantics: URL = live button, `''` = "Coming soon", key omitted = hidden.
  - Product privacy policies live in a second collection, `src/content/product-privacy/<slug>.md`. The build fails if `hasPrivacyPolicy: true` and the file is missing.
  - The slug must equal the entry id; the build fails otherwise.
- **Reason:** Each change makes a store-facing mistake impossible or loud instead of silent.

## 2026-10-07 — Placeholder art is SVG; social image falls back for SVG heroes

- **Decision:** Placeholder art is hand-generated SVG with a visible "PLACEHOLDER" label and alt text that says it is not a screenshot. Social platforms do not render SVG, so products with an SVG hero use the default social image. Raster heroes produce a 1200px JPG via `getImage`.
- **Reason:** It is tiny, on-brand and obviously temporary.

## 2026-10-07 — JSON-LD category mapping

- **Decision:** `game` → `VideoGame` (GameApplication). `app` → `SoftwareApplication` (MultimediaApplication), `tool` → DeveloperApplication, `experience` → EntertainmentApplication. There is no `offers` block, because there are no prices.
- **Reason:** The brief requires VideoGame or SoftwareApplication, and inventing prices is forbidden.

## 2026-10-07 — Public email left empty

- **Decision:** `site.email` is `''` with `TODO(charitha)`. All email links hide when it is empty; privacy pages fall back to GitHub as the contact.
- **Reason:** The brief never gave a public studio email, and a personal address must not be published without being asked.

## 2026-10-07 — Rotunda has no privacy policy yet

- **Decision:** Rotunda ships with `hasPrivacyPolicy: false`. The pattern is shown and tested through the draft sample product.
- **Reason:** A policy must state true facts about data collection, and those facts are unknown. Meta requires one before submission (tracked in CurrentState).

## 2026-10-08 — Re-position: graphics and simulation first

- **Decision:** Charitha set new studio priorities: (1) computer graphics and simulation (rendering, real-time graphics, simulation, procedural generation), (2) game development, (3) XR experiences. The site should feel made by a graphics programmer. This changes the brief's XR-leaning positioning; per CLAUDE.md, the instruction wins.
- **Status:** Exploration only. The live site, `site.ts` tagline and Key Light tokens are unchanged until a concept is picked.

## 2026-10-08 — Five home page concepts; Converge recommended

- **Decision:** Five self-contained mockups in `public/design-lab/` (Key Light Relit, Viewport, Converge, Proceedings, Stir). Recommended: **Concept 3, Converge** (Swiss high-key layout around a progressive path tracer that sleeps when converged). Ranking and reasons: `Docs/Design/Exploration/Concepts.md`.
- **Options considered:** also G-buffer pass breakdown and boids/cloth sims; the G-buffer idea is folded into Concepts 1 and 2 instead of a separate concept.
- **Reason:** strongest graphics signal for the least UI, best idle cost (zero frames after convergence), M effort, product pages stay store-friendly.

## 2026-10-08 — Design-lab mockups are exempt from the brand and font rules

- **Decision:** The mockups hard-code the brand name, owner, socials and copy, and load Google Fonts, instead of using `site.ts` and self-hosted fonts.
- **Reason:** Charitha asked for self-contained HTML files with Google Fonts allowed. They are temporary, `noindex`, outside the Astro build graph and outside the sitemap, and get deleted after the pick. The real implementation will follow the normal rules.

## 2026-10-08 — Kirana and the IJACSA paper are mock content

- **Decision:** Kirana (renderer, working name) and the 2026 IJACSA paper appear only in the design-lab mockups. Whether they go on the real site is decided after the pick. Only the facts Charitha gave are used; illustrative diagrams are labelled as such.

## 2026-10-08 — Exploration screenshots stored as JPEG

- **Decision:** Desktop (1440 px) and mobile (390 px) full-page screenshots in `Docs/Design/Exploration/screenshots/` are JPEG q85 (3.8 MB total), not PNG (8.7 MB). The gallery uses 640×400 JPEG thumbnails in `public/design-lab/thumbs/` (about 220 KB).
- **Reason:** The halftone and noise-heavy renders compress poorly as PNG. These files are temporary too.

## 2026-10-08 — Final design: Converge, with two touches from Stir

- **Decision:** Concept 3 "Converge" is the final design: warm paper `#e7e5e0`, ink `#111111`, one cobalt accent `#1d31c9`, big headings, the numbered rail, thin rules, spec tables and the live path-traced hero with the spp counter and the 1/16/1024 strip. From Concept 5, only two things: the two-ink wordmark (ink glyphs over a slightly misregistered cobalt impression) and the hard offset print shadow on primary buttons, product cards and the featured card. Concepts 1, 2 and 4 rejected; no halftone fluid, no pink blocks, no condensed display face.
- **Reason:** Charitha's pick ("no more concept rounds").

## 2026-10-08 — Positioning: product showcase, not portfolio or research

- **Decision:** The site presents products people can get or buy and sends them to the right store. Background, projects and research live on a separate portfolio, linked from the header, the home About section, the About page and the footer (`site.portfolioUrl`). Removed: the Lab, Kirana, the IJACSA paper, the "Graphics first. Then games. Then XR." headline and the priorities strip. Interests are not ranked anywhere. Supersedes the 2026-10-08 "graphics and simulation first" entry. The brief is amended in place (marked [Amended 2026-10-08]).
- **Copy:** first person singular, short sentences, no stock marketing words.

## 2026-10-08 — Headline and tagline

- **Decision:** `headline`: "I make things to play, watch and use." `tagline`: "Games, VR apps and tools, made by one person in Sri Lanka." Both in `site.ts`. Alternatives offered to Charitha: "Small games and apps, built by hand in Sri Lanka." and "Independent games, VR apps and tools. One developer, every store linked."
- **Reason:** The headline is plain and human. The tagline says what and who, and still reads well as the home `<title>`, meta description and footer line.

## 2026-10-08 — portfolioUrl left empty

- **Decision:** `site.portfolioUrl` is `''` with `TODO(charitha)`, because the instruction contained the literal placeholder "<PASTE YOUR PORTFOLIO URL HERE>". Every portfolio link and sentence is hidden while it is empty (same pattern as `email`).

## 2026-10-08 — Price, pricing model and store model

- **Decision:**
  - `price` is an optional string shown as written. `pricingModel` is `free | paid | free-with-in-app-purchases | tba` (default `tba`).
  - Label: `tba` or a missing paid price → "Price TBA". Free models without a price → "Free" (showing "Price TBA" for a free product would be wrong). Free with IAP → "Free · in-app purchases".
  - `storeLinks` now holds live URLs only. New `plannedStores` lists stores shown as "Coming soon" (replaces the old `''` convention). New optional `primaryStore` chooses the first, filled button.
  - Button verbs come from status and pricing: "Wishlist on Steam/Meta Horizon Store" before release, "View on …" for other stores before release, "Buy on …" (paid) or "Get it on …" after release.
  - JSON-LD gets an `Offer` only when the price is known (free, or `$`/`€`/`£` + number). This replaces the 2026-10-07 "no offers block" decision for those cases.
- **Reason:** Charitha's content-model instructions. Prices are never invented: Rotunda is `tba`.

## 2026-10-08 — Products index grouped by platform

- **Decision:** Groups follow `PLATFORMS` order, with short headings ("Windows PC VR" → "PC VR"). A multi-platform product appears in each of its groups. Jump buttons appear only with 2+ groups. No JavaScript.

## 2026-10-08 — Path tracer as a component with offline stills

- **Decision:**
  - **Code:** `src/scripts/path-tracer.ts` (renderer class), `src/scripts/path-tracer-hero.ts` (wiring), `src/components/PathTracer.astro`.
  - **Stills:** rendered offline by the same class (`scripts/render-hero-images.mjs`, esbuild + headless Chromium), at 1024 spp (wide 21:9 and tall 4:5) plus 1 and 16 spp.
  - **Still frame:** shown before the live renderer starts, without WebGL2 or float targets, and under reduced motion. Reduced motion offers a "Render it live" button.
  - **Live start:** after first paint. While live, the still is hidden, so the page shows noise converging, not a clean image turning noisy.
  - **Strip:** starts with the matching stills and is overwritten by live captures at 1, 16 and 1024 spp. This fixes the empty 1024 tile: in the mockup the tile stayed empty until the live render reached 1024, which could take a long time or never happen once the plate scrolled off-screen and paused.
  - **Social image:** `public/og-default.jpg` (was .png) is now a crop of the 1024 spp render.
- **Reason:** Charitha's component requirements, plus a fallback that matches the live image exactly.

## 2026-10-08 — Fonts and assets

- **Decision:** Space Grotesk (variable 300–700, 22 KB) and Space Mono 400/700 (17 KB each), self-hosted latin WOFF2 with OFL licences. Archivo, JetBrains Mono and the blue-noise dither are removed. A dark "paper grain" tile replaces the dither. Favicon and touch icon are two drawn brackets in ink with a cobalt offset (no text). Placeholder art is redrawn in ink and cobalt on paper, with centred labels so crops keep them. `public/design-lab/` is deleted, and so are the exploration screenshots; Concepts.md stays as the record.
- **Header:** no JavaScript menu toggle any more (three items fit at 360px).

## 2026-10-08 — Hero fits the first screen; camera fits the scene

- **Decision:** on landscape screens the hero plate fills the height left under the header and headline (100svh based), with the headline capped at 11svh. The camera no longer has three fixed framings: it zooms and lens-shifts so all spheres fit any aspect, and the still is scaled to the same framing with container units. Phones keep their framing. The spp readout may start below the fold.
- **Reason:** Charitha: on desktop the render sat below the fold and the spheres were cropped.
