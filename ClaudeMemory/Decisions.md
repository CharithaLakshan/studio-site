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
