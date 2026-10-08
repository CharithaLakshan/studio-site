# Session Log

Append one entry per session. Newest last.

---

## 2026-10-07 — Session 1 — Stage 1, Step A

- **Model / effort:** claude-opus-5-5, default effort.
- **Stage:** 1 (design and architecture), Step A only.
- **Done:** Saved the master brief verbatim. Wrote three design directions (Key Light, Viewport, Atrium) with WCAG-checked palettes, and recommended Key Light. Stopped to wait for a choice, as the brief instructs.
- **Files:** `Docs/00-ProjectBrief.md`, `Docs/Design/DesignDirections.md`.
- **Open issues:** No direction chosen. Step B docs not written.

## 2026-10-07 — Session 1 (continued) — Stage 2 build

- **Model / effort:** claude-opus-5-5, low effort.
- **Stage:** 2 (build). Also filled the missing Stage 1 Step B docs.
- **Done:**
  - Found that the Stage 1 Step B docs did not exist. Adopted Key Light as recommended and logged it (Decisions.md).
  - Scaffolded Astro 7.3 + TypeScript 6 strict, sitemap and check. Vendored the Archivo and JetBrains Mono WOFF2 files.
  - Single brand file `src/config/site.ts`. Tokens and global CSS. Blue-noise dither tile.
  - BaseLayout (SEO, OG, Twitter, canonical, JSON-LD slot), Header (progressive mobile menu), Footer.
  - Pages: home, products index (grouped by type), product page, product privacy (flag + file), about, privacy, 404, robots.txt. Sitemap via the integration.
  - Components: Wordmark, SocialLinks, PageHeader, ProductCard/Grid, FeaturedProduct, StatusBadge, StoreButtons (live / Coming soon / hidden), SpecSheet, FeatureList, Gallery, Trailer (youtube-nocookie, only on click), SystemRequirements.
  - Content: Rotunda (facts from the brief only, TODOs for unknowns) and `sample-product.md` (draft template plus a sample privacy policy).
  - Placeholder SVG art (labelled "PLACEHOLDER", alt text says it is not a screenshot), text-free favicon, touch icon, default OG image.
  - Deploy workflow: checkout@v7, withastro/action@v6 (Node 24, check + build), deploy-pages@v5.
  - Docs: DesignSystem, PageSpecs, Architecture, ContentModel, Roadmap, all four HowTos, CLAUDE.md, ClaudeMemory, README.
- **Verification:**
  - `npm run check`: 0 errors, 0 warnings, 0 hints. `npm run build`: no warnings, 6 pages.
  - Spot-checked the built HTML of every page: one h1 each, unique title, description and canonical (none on 404), 8 OG and 5 Twitter tags, all images have alt (cards use empty alt as decorative), header/main/footer/nav landmarks, no broken or un-based internal links.
  - Playwright at 1440px and 390px: no horizontal overflow (fixed one from the light pool). Mobile menu opens, closes on Escape and returns focus. Zero external requests before the trailer is clicked, then the iframe uses youtube-nocookie.
  - Temporarily un-drafted the sample: trailer, system requirements table, privacy page and VideoGame JSON-LD all rendered. Reverted. Draft is absent from the pages and sitemap.
  - Setting `hasPrivacyPolicy: true` on Rotunda without a file fails the build with a clear message. Reverted.
  - **Brand-swap test:** set `name` to "Halcyon Works" and built. `LKY` matched 0 times in `dist/`, `src/`, `public/`, `.github/`. "Halcyon Works" appeared on all 6 HTML pages. No owner name, email, social or site URLs outside `site.ts` (except `TODO(charitha)` comments). Reverted.
- **Files:** `package.json`, `package-lock.json`, `astro.config.ts`, `tsconfig.json`, `.gitignore`, `.nvmrc`, `.github/workflows/deploy.yml`, `public/*`, `src/**`, `CLAUDE.md`, `README.md`, `ClaudeMemory/*`, `Docs/Design/{DesignSystem,PageSpecs}.md`, `Docs/Architecture/*`, `Docs/HowTo/*`, `Docs/Roadmap.md`.
- **Open issues:** Lighthouse not run (no Lighthouse in this environment), deferred to Stage 3. HTML mockups skipped by decision. See CurrentState for the TODOs.

## 2026-10-08 — Session 2 — Design exploration: graphics-first concepts

- **Model / effort:** claude-opus-5-5, default effort.
- **Stage:** Exploration (between Stage 2 and 3). No existing page, component or style was changed.
- **Done:**
  - Five self-contained home page concepts in `public/design-lab/`, each with header and wordmark, hero with a real-time element, featured Rotunda, products grid, Lab (Kirana and the IJACSA paper), footer with YouTube and GitHub:
    1. **Key Light, Relit**: WebGL2 coffered-dome relief baked to a G-buffer once, relit every frame by a pointer-driven key light with soft shadows.
    2. **Viewport**: engine-editor shell; WebGL2 rasterizer (5.6k-tri procedural rotunda and tree), shadow map, 7 view modes (Lit, Albedo, Normals, Depth, Wireframe, Overdraw, Shadow map), object selection, console log.
    3. **Converge**: Swiss high-key; WebGL2 progressive path tracer (NEE, glass, chrome, cove), spp counter, 1/16/1024 spp strip, idles at 1024 spp.
    4. **Proceedings**: page typeset as a paper; Canvas 2D space-colonization tree as live Figure 1; MathML equations; references.
    5. **Stir**: riso zine; WebGL2 stable fluids printed as a two-ink rotated halftone with misregistration.
  - Gallery `public/design-lab/index.html` with thumbnails. All design-lab pages `noindex`.
  - `Docs/Design/Exploration/Concepts.md`: palette, type, real-time element and cost, Rotunda and Lab in each style, accessibility, risks, effort, ranking, recommendation (Converge), mixes.
  - Screenshots: `Docs/Design/Exploration/screenshots/concept-N-{desktop,mobile}.jpg`.
- **Verification (headless Chromium, SwiftShader WebGL2):**
  - No console errors and no horizontal overflow at 1440 px and 390 px on all five pages and the gallery.
  - rAF calls per second: running at the top of the page, **0** when scrolled away (all five).
  - Reduced motion: **0** rAF afterwards and a non-blank still frame (all five).
  - `--disable-3d-apis`: `html.no-gl` and the static fallback frame (1, 2, 3, 5; 4 needs no WebGL).
  - Concept 2: every view mode and selection screenshot-checked. Concept 4: regrow and slider work; growth stops when it stalls.
  - WCAG contrast of every text pair computed (all ≥ 4.5:1; riso blue `#0078bf` is decorative only).
  - `npm run check`: 0 errors, 0 warnings, 0 hints. `npm run build`: 6 pages; design-lab copied to `dist/`, absent from the sitemap.
- **Files:** `public/design-lab/**`, `Docs/Design/Exploration/**`, `ClaudeMemory/{SessionLog,Decisions,CurrentState}.md`.
- **Open issues:** Real-GPU frame times not measured (software GPU only); use the backtick overlay on a device. Waiting for Charitha's pick.
