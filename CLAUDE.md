# CLAUDE.md

**Start every session by reading `ClaudeMemory/CurrentState.md`.** Then read only what the task needs.

## Project

Official website of the one-person indie studio **[LKY]** (temporary name) run by M. Charitha Lakshan ("Lucky"), an Immersive Experience Engineer (real-time graphics and XR). It lists every product (games, VR apps, tools, experiences), each with a permanent page at `/products/<slug>/`. Store listings (Steam, Meta Horizon, Google Play) link to those pages, and each page links out to the stores. The first product is **Rotunda**, a PC VR video player.

Design direction: **Key Light**. Dark, cinematic, one warm key light (`#f2b66d`) on near-black. Spec: `Docs/Design/DesignSystem.md`.

## Stack

Astro 7 (static) · TypeScript 6 strict · npm · Node ≥22.12 (CI: 24) · plain CSS with custom-property tokens · `@astrojs/sitemap` · `@astrojs/check` · GitHub Pages through Actions.

## Commands

```sh
npm install
npm run dev       # http://localhost:4321/studio-site/
npm run check     # must be 0 errors / 0 warnings / 0 hints
npm run build     # dist/
npm run preview
```

## Folder map

```
src/config/site.ts         ALL brand/identity values + site URL + base path
src/content.config.ts      Zod schemas (products, productPrivacy)
src/content/products/      <slug>.md per product (sample-product.md = draft template)
src/content/product-privacy/  optional <slug>.md privacy policies
src/assets/                fonts, product images, blue-noise dither
src/styles/                tokens.css, global.css
src/layouts/BaseLayout.astro   SEO head + header/main/footer
src/components/            UI components
src/lib/                   url.ts, products.ts, seo.ts, images.ts
src/pages/                 index, products/, products/[slug]/, about, privacy, 404, robots.txt
public/                    favicon, apple-touch-icon, og-default.png (no text in any)
.github/workflows/deploy.yml
Docs/                      brief, design, architecture, how-tos, roadmap
ClaudeMemory/              session memory (see below)
```

## Hard rules

**Brand**
- Brand name, tagline, owner name, email and social links live **only** in `src/config/site.ts`. Never hard-code them anywhere else, including Markdown content.
- The wordmark is text from config, never an image.
- Renaming = edit `site.ts` (Docs/HowTo/RenameBrand.md).

**Tech**
- Static output, no backend, CMS, database, analytics or cookies.
- No CSS or UI framework. Zero client JS by default; small vanilla scripts only (nav, trailer).
- Self-hosted open-licence fonts. Images through `astro:assets`.
- Internal links via `url()` from `src/lib/url.ts` (base path). Absolute URLs via `absolute()`.
- Pages get products only through `src/lib/products.ts` (drafts are filtered there).
- SEO on every page: unique title and description, canonical, OG, Twitter. JSON-LD on product pages.
- WCAG 2.2 AA, keyboard access, visible focus, alt text, landmarks, reduced motion.
- Target: Lighthouse 95+ on mobile in every category.
- **Ask before adding any dependency.**
- Product slugs are **permanent** once published.

**Working rules**
- Never invent product facts (prices, dates, specs, reviews, awards, counts). Mark unknowns `TODO(charitha)`, in code comments or YAML comments, never in rendered text.
- Small conventional commits (`feat:`, `fix:`, `docs:`, `chore:`).
- End of every session: append to `ClaudeMemory/SessionLog.md`, add to `Decisions.md`, rewrite `CurrentState.md`, then commit, push and open or update a PR.
- Be cost-conscious: don't re-read large files, no extra agents unless needed, short chat replies. Details belong in docs.
- If a later instruction from Charitha conflicts with `Docs/00-ProjectBrief.md`, follow the instruction and log it in Decisions.md.

## Pointers

- `ClaudeMemory/CurrentState.md`: what works, what's next, known issues (read first)
- `ClaudeMemory/Decisions.md`, `SessionLog.md`, `DeveloperPreferences.md`
- `Docs/00-ProjectBrief.md`: master brief (source of truth)
- `Docs/Design/DesignSystem.md`, `PageSpecs.md`, `DesignDirections.md`
- `Docs/Architecture/Architecture.md`, `ContentModel.md`
- `Docs/HowTo/LocalDev.md`, `Deploy.md`, `AddProduct.md`, `RenameBrand.md`
- `Docs/Roadmap.md`
