# Current State

_Rewritten at the end of every session. Last: 2026-10-08, hero redesign (full-bleed render with poster)._

## What works

- **Final design "Converge"** is on every page: Home, Products (grouped by platform), product storefront, product privacy, About, Privacy, 404, sitemap, robots.txt.
- **Stage 3 audit passed** (report: `Docs/Reviews/Stage3-Review.md`):
  - Lighthouse mobile 100/100/100/100 on every page;
  - axe 0 violations;
  - no horizontal scroll from 320 to 1920 px;
  - every internal link and asset resolves under `/studio-site/`;
  - WCAG AA contrast computed for every pair (lowest 6.3:1);
  - `npm run check` 0/0/0, build without warnings.
- **Positioning:** a product showcase. The portfolio link is wired but hidden until `site.portfolioUrl` is set.
- **Hero** (`PathTracer.astro`, `path-tracer.ts`, `path-tracer-hero.ts`), full-bleed since 2026-10-08:
  - **Opens on a poster:** a 1024 spp pre-render (LCP element). The tracer is a lazy chunk; no WebGL before the visitor clicks Render live or the picture.
  - **One framing:** poster, 1/16 spp stages and live canvas are all 12:5 (`FRAME`, `BAND`) with the same `object-fit: cover`, so they line up (0 px measured).
  - **Desktop/laptop** (≥47.5rem, landscape): render fills `100svh` minus the header; headline over the empty studio; bottom bar with counter + status, thumbnails, buttons over a paper fade. **Phones/portrait:** text, 4:3 render, bar.
  - **Controls:** Render live → Pause → Resume → Render again; Restart while running or paused; thumbnail buttons with `aria-pressed`; light by click/drag/arrows.
- **Content model:** `price`, `pricingModel`, `plannedStores`, `primaryStore`. Store button verbs follow status and pricing. JSON-LD `Offer` appears only when the price is known.
- **SEO:**
  - unique titles and descriptions, canonicals, OG and X tags with image width and height;
  - a product with a raster hero gets its own 1200×630 social image (a hero smaller than that fails the build); SVG placeholder heroes use `og-default.jpg`.
- **Brand:** single brand file `src/config/site.ts` (now a plain object, no `as const`). The brand-swap test passed again.
- **Performance:**
  - CSS inlined, so nothing blocks rendering.
  - The only script on load is the hero wiring (5 KB, home only); the 10 KB path tracer loads on demand.
  - Fonts 55 KB, self-hosted.

## What's next

1. **Charitha:** work through `Docs/LaunchChecklist.md`:
   - email and portfolio URL;
   - Rotunda facts, real art and store URLs;
   - Rotunda privacy policy before store submission;
   - enable Pages, check the live URL;
   - Search Console;
   - custom domain later.
2. **Needs a public URL or real hardware:**
   - PageSpeed Insights, the Rich Results Test and social previews;
   - a screen-reader pass;
   - path-tracer timing on a phone and an integrated GPU.
3. Roadmap "Later": official store badges, press kit, devlog, branded social cards.

## Needs Charitha's input (`grep -rn "TODO(charitha)" src`)

- `site.ts`: `email`, `portfolioUrl`; confirm the tagline.
- Rotunda:
  - pricing model and price;
  - release date;
  - real hero (≥1200×630) and screenshots;
  - trailer ID;
  - system requirements;
  - Steam and Meta store URLs.
- Rotunda privacy policy: `src/content/product-privacy/rotunda.md`, then `hasPrivacyPolicy: true`.
- Site privacy page: review the text and its date.

## Known issues / notes

- Path tracer frame times on real GPUs are unmeasured; only SwiftShader is available here.
- Hero pictures come from `scripts/render-hero-images.mjs` (the poster takes about 45 min on the CPU). Re-run it after any change to the scene, `BAND` or tone mapping.
- Screens wider than 12:5 get a hero taller than the screen (by design, so the crop never cuts the spheres). Under 36rem tall the hero also grows past the fold.
- `Docs/Design/Screenshots/home-desktop.jpg` and `home-mobile.jpg` predate the new hero; the new one is in `hero-*.jpg`.
- If `email` and `socials.github` were both empty, the privacy pages' contact link would be empty. Setting the email closes this.
- A draft's images are still copied into `dist/_astro/`, though no page links them. This is harmless.
- `robots.txt` has no effect under `github.io/<repo>/` until a custom domain is set.
- Product Markdown bodies: first person, short sentences.
- **Audit tools for next time:** install them in the scratchpad (`npm i axe-core lighthouse html-validate`), use `CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, and serve `dist/` under `/studio-site/` with a small Node server. They are not project dependencies.
- `Docs/Design/Screenshots/` re-shot in Stage 3 except the `template-*` files (they need the sample product published temporarily); their store buttons predate the full-width change.
