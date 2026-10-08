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

## 2026-10-08 — Session 2 (continued) — Final design: product showcase

- **Model / effort:** claude-opus-5-5, default effort.
- **Stage:** Final design applied to the whole site (between Stage 2 and Stage 3).
- **Decision from Charitha:**
  - Concept 3 "Converge" as the base, plus Concept 5's two-ink wordmark and hard print shadows, used sparingly.
  - The site is a product showcase; background and research go to the portfolio.
  - Remove the Lab, Kirana, the paper and the interest ranking.
- **Done:**
  - **Design:** new tokens and global CSS (paper, ink, cobalt; Swiss rail grid; spec tables; square buttons with print shadow; paper grain). Self-hosted Space Grotesk and Space Mono with OFL texts; removed Archivo, JetBrains Mono and the blue-noise dither.
  - **Path tracer component:** `src/scripts/path-tracer.ts` (renderer class), `path-tracer-hero.ts` (wiring) and `PathTracer.astro`.
    - Offline stills rendered by the same class (`scripts/render-hero-images.mjs`; 1680×720 and 864×1080 at 1024 spp, plus 1 and 16 spp).
    - Still frame for first paint, no WebGL2, no JS and reduced motion (with a "Render it live" opt-in).
    - Starts after first paint; pauses off-screen or when hidden; DPR capped at 2; 0.55 MP budget; idle at 1024 spp.
    - Strip tiles are never empty (this fixed the empty 1024 tile).
  - **Components:**
    - New: Section (numbered rail), PathTracer, SpecTable.
    - Rewritten: Wordmark (two-ink), Header (no JS toggle; Portfolio link when set), Footer (ink block, big links), SocialLinks, PageHeader, ProductCard, ProductGrid, FeaturedProduct, StoreButtons, StatusBadge (four-square gauge), FeatureList, Gallery, Trailer, SystemRequirements.
    - Deleted: SpecSheet.
  - **Pages:**
    - Home: hero, 01 Featured, 02 Products, 03 About.
    - Products: grouped by platform.
    - Product storefront: buy box with price, status, platforms and store buttons, then numbered sections for overview, trailer, screenshots, features, specs and system requirements.
    - About (short, portfolio), Privacy, product privacy and 404 restyled.
  - **Content model:**
    - New fields: `price`, `pricingModel`, `plannedStores`, `primaryStore`.
    - `storeLinks` takes URLs only.
    - Helpers: `priceLabel()`, `storeButtons()` (action verbs by status and pricing), `groupByPlatform()`.
    - JSON-LD `Offer` only when the price is known.
    - Rotunda migrated (`pricingModel: tba`, planned Steam and Meta) and its body rewritten in first person with the same facts; the sample template shows every field.
  - **Config:** `site.ts` gains `headline` and `portfolioUrl` (empty, TODO; links hidden) and loses `intro` and `owner.role`. Tagline: "Games, VR apps and tools, made by one person in Sri Lanka."
  - **Assets:**
    - Placeholder SVGs redrawn (ink and cobalt, centred labels).
    - New favicon and touch icon (two-ink brackets, no text).
    - `og-default.png` is replaced by `og-default.jpg`, a crop of the path-traced still.
    - `public/design-lab/` and the exploration screenshots deleted.
  - **Docs:**
    - Rewritten: DesignSystem.md, PageSpecs.md, ContentModel.md.
    - Updated: Architecture.md, AddProduct.md, RenameBrand.md, Roadmap.md, README, CLAUDE.md.
    - New: RenderHeroImages.md.
    - Amended in place: brief (positioning, pages, content model, design).
    - Marked: Concepts.md and DesignDirections.md as decided or superseded.
- **Verification:**
  - **Check and build:** `npm run check`: 0 errors, 0 warnings, 0 hints. `npm run build`: 6 pages, no warnings (8 with the sample temporarily published).
  - **Brand swap:** `name` set to "Halcyon Works" and built. "LKY" matched 0 files in `dist/`, `src/`, `public/`, `.github/` or `astro.config.ts`. The new name was on 8/8 pages. No owner, email or social values outside `site.ts`. Reverted.
  - **Hero (headless Chromium, SwiftShader):**
    - Live: the still hides, the canvas renders, Pause and Restart show.
    - 0 frames per second when scrolled away and when paused.
    - A click on the image or an arrow key moves the light and restarts (spp back to 0003).
    - Strip tiles take live captures at 1 and 16 spp.
    - Reduced motion: the 1024 spp still, 0 frames, a "Render it live" button that works.
    - `--disable-3d-apis`: the still plus a "can't run" note.
    - JavaScript off: the still, no buttons.
  - **Layout:** no console errors and no horizontal overflow at 1440 and 390 px on every page. Screenshots: `Docs/Design/Screenshots/`.
  - **Copy:** the built HTML has no words glued to links. This fixed three missing spaces from JSX line breaks (Privacy, About, product privacy).
  - **Contrast:** every text pair computed: ink 15.0, ink-2 7.1, cobalt 7.1 on paper; 16.7, 7.9, 8.0 on card; paper on ink 15.0, `#aab3ff` on ink 9.5.
  - **Hero stills:** rendered in SwiftShader in 18 min (wide) and 13 min (tall). Stored as JPEG q93 (about 310 KB in total); the social image is JPEG (32 KB).
