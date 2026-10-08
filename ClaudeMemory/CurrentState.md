# Current State

_Rewritten at the end of every session. Last: 2026-10-08, Stage 3 review, hardening and polish._

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
- **Path-traced hero** (`PathTracer.astro`, `path-tracer.ts`, `path-tracer-hero.ts`):
  - **Still frame:** offline-rendered by the same code. It shows for first paint, without WebGL2, under reduced motion and **on software WebGL (no GPU)**. The last two offer a "Render it live" button.
  - **Running:** starts after first paint, pauses off-screen or when the tab is hidden, uses at most 0.55 MP and goes idle at 1024 spp. It re-fits after a resize.
  - **First screen:** on landscape screens ≥40rem the hero fits the first screen; `viewFor()` frames the spheres for any aspect, and the still matches the live render.
  - **Focus:** a visible focus frame between the crop marks; the arrow keys move the light.
- **Content model:** `price`, `pricingModel`, `plannedStores`, `primaryStore`. Store button verbs follow status and pricing. JSON-LD `Offer` appears only when the price is known.
- **SEO:**
  - unique titles and descriptions, canonicals, OG and X tags with image width and height;
  - a product with a raster hero gets its own 1200×630 social image (a hero smaller than that fails the build); SVG placeholder heroes use `og-default.jpg`.
- **Brand:** single brand file `src/config/site.ts` (now a plain object, no `as const`). The brand-swap test passed again.
- **Performance:**
  - CSS inlined, so nothing blocks rendering.
  - The only script is the hero (13 KB, home only).
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

- Path tracer frame times on real GPUs are unmeasured; only SwiftShader is available here. Testing the live render here needs a click on "Render it live" (software WebGL is held back on purpose).
- Hero stills come from `scripts/render-hero-images.mjs` (slow CPU render). Re-run it after any change to the scene or tone mapping.
- If `email` and `socials.github` were both empty, the privacy pages' contact link would be empty. Setting the email closes this.
- A draft's images are still copied into `dist/_astro/`, though no page links them. This is harmless.
- `robots.txt` has no effect under `github.io/<repo>/` until a custom domain is set.
- Product Markdown bodies: first person, short sentences.
- **Audit tools for next time:** install them in the scratchpad (`npm i axe-core lighthouse html-validate`), use `CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, and serve `dist/` under `/studio-site/` with a small Node server. They are not project dependencies.
- `Docs/Design/Screenshots/` re-shot in Stage 3 except the `template-*` files (they need the sample product published temporarily); their store buttons predate the full-width change.
