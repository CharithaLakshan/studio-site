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

## 2026-10-08 — Fix: hero cropped on desktop

- **Problem:** at 1920×950 the headline took three huge lines and the 21:9 plate started about 500–600 px down, so the spheres were cut off by the bottom of the window (every desktop size from 1280×720 to 2560×1440 overflowed).
- **Changes:**
  - `index.astro`: on landscape screens ≥40rem (with `subgrid`), `.hero` is a grid `auto / minmax(15rem, 1fr) / auto`; a `::before` spacer spanning rows 1–2 is `100svh − header` tall, so the stage row gets exactly what the text leaves. Headline `clamp(2.75rem, min(1rem + 7.4vw, 11svh), 8.5rem)`; text padding uses svh too.
  - `PathTracer.astro`: the figure takes rows 2–3 via subgrid (stage, then readout). The mask moves from the img to the `<picture>`; the wide still is sized with container units (`--still-kh/kw` from `STILL`) instead of `object-fit: cover`. Strip tiles use the new `strip-1024.jpg`.
  - `path-tracer.ts`: spheres in one TS array (shader generated from it); `cameraFor` replaced by `viewFor` (fixed eye, FOV + lens shift fitted to each padded sphere's exact projection; portrait keeps the old phone camera); `STILL` framing; `setView()`. Shader takes `uTarget`, `uHalf`, `uShift`.
  - `path-tracer-hero.ts`: live strip captures centred.
  - Render script: strip at 800×450 incl. 1024 spp, wide at 2400×733 with `STILL`, og crop from the new wide. Tall still unchanged.
- **Verification (headless Chromium):** 1280×720, 1366×768, 1440×900, 1536×864, 1920×950, 1920×1080, 2560×1440: stage bottom = viewport bottom, headline, tagline and all spheres visible: pass. 768×1024 and 390×844: nothing cut off (unchanged layout): pass. Live vs still cobalt-sphere centroid differs < 1 px at 1366, 1920, 2560 and 768. Canvas ≈ 0.55 MP at 1366, 1920 and 2560. `npm run check` 0/0/0, build without warnings.

## 2026-10-08 — Stage 3: review, harden and polish

- **Tools** (installed in a scratch folder, not project dependencies): Playwright + headless Chromium (SwiftShader), axe-core 4.14, Lighthouse 13.5 (mobile), html-validate 11.16, a link-check script, computed WCAG contrast. Full report: `Docs/Reviews/Stage3-Review.md`.
- **Before:**
  - Lighthouse mobile: Home performance 59 (TBT 84 s from the path tracer on a software GPU), other pages 100; render-blocking CSS on every page.
  - axe: 1 violation (duplicate "Elsewhere" nav on About).
  - Overflow: 19 px at 320 px (featured card).
- **Fixes:**
  - **Hero:**
    - software WebGL (SwiftShader/llvmpipe) keeps the still with a "Render it live" opt-in (`softwareWebGL()`);
    - a visible focus frame for the canvas (`.pt-focus`);
    - no `aria-pressed` on Pause/Resume;
    - `<figcaption>` → `<p>`;
    - the canvas re-fits on resize after the render finishes;
    - `fetchpriority="high"` on the still;
    - 480 px strip size.
  - **CSS:** inlined on every page (`build.inlineStylesheets: 'always'`).
  - **Store buttons:** full width; the row layout wraps at 15rem; "Coming soon" moves under the store name instead of breaking.
  - **Status badge:** text at `--step--1`, may wrap. The featured card column can shrink. The storefront rule is full-bleed.
  - **SEO:**
    - the product title drops the tagline's full stop;
    - no `og:url` on noindex pages;
    - product social image is a 1200×630 cover crop, with `og:image:width/height` everywhere;
    - a raster hero under 1200×630 fails the build.
  - **Code:**
    - `site.ts` loses `as const` (removes 6 `as string` casts) and the unused `Site` type;
    - duplicate wordmark rule removed;
    - `.page-body` moved to global.css;
    - the hero strip uses typed objects;
    - token `--shadow-featured`.
  - **About:** the social links are no longer a second "Elsewhere" nav.
- **Docs:**
  - New: `Docs/Reviews/Stage3-Review.md`, `Docs/LaunchChecklist.md`.
  - Updated: DesignSystem.md (focus, no-GPU hero, store buttons, shadow token), Architecture.md (inlined CSS), AddProduct.md (hero ≥1200×630), Roadmap.md (Stage 3 done; outdated "mobile menu" line fixed).
- **Verification (after):**
  - **Lighthouse mobile:** 100/100/100/100 on Home, Products, Rotunda, About and Privacy. Home: LCP 1.2 s, TBT 0 ms, CLS 0.
  - **axe:** 0 violations at 360 and 1280.
  - **Layout:** no horizontal scroll at 320/360/640/768/1280/1920.
  - **Links:** 138 internal refs OK under `/studio-site/`.
  - **HTML:** valid, except the deliberate `role="list"`.
  - **Hero:** keyboard focus frame visible; arrow keys restart; resize keeps the aspect (buffer 2.247 vs CSS 2.249); reduced motion and JS-off show the still.
  - **Brand swap** (Halcyon Works): 6/6 pages, 0 "LKY" hits, no identity values outside site.ts; reverted.
  - **check/build:** `npm run check` 0/0/0; build without warnings.
