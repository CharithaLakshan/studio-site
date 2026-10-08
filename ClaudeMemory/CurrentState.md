# Current State

_Rewritten at the end of every session. Last: 2026-10-08, final design (product showcase)._

## What works

- **Final design "Converge"** is implemented on every page: Home, Products (grouped by platform), product storefront, product privacy, About, Privacy, 404, sitemap, robots.txt. `npm run check`: 0 errors, 0 warnings, 0 hints. `npm run build`: no warnings.
- **Positioning:** a product showcase. The Lab, Kirana, the paper and interest rankings are gone. The portfolio link is wired, but hidden until `site.portfolioUrl` is set.
- **Path-traced hero:** `src/components/PathTracer.astro` with `src/scripts/path-tracer.ts` and `path-tracer-hero.ts`.
  - Offline still frames (same renderer) for first paint, no WebGL2, no JS and reduced motion.
  - Starts after first paint and pauses off-screen or when the tab is hidden.
  - DPR is capped at 2, with a 0.55 MP pixel budget; it goes idle at 1024 spp.
  - The 1/16/1024 strip is never empty.
- **Content model:** `price`, `pricingModel`, `plannedStores`, `primaryStore`. `storeLinks` takes live URLs only. Store button verbs follow status and pricing. JSON-LD `Offer` appears only when the price is known.
- **Brand:** single brand file `src/config/site.ts` (name, headline, tagline, owner, email, portfolioUrl, socials). The brand-swap test passed again.
- **Assets:** self-hosted Space Grotesk and Space Mono (55 KB total). The design lab is deleted.
- **Screenshots** of every page (1440 and 390 px): `Docs/Design/Screenshots/` (the `template-*` files show the draft sample product published temporarily, to show live store buttons, a price, a trailer and a privacy page).

## What's next

1. **Charitha:**
   - Pick a tagline (three options in Decisions.md; option 1 is live).
   - Paste the portfolio URL into `site.ts`.
   - Merge the PR.
   - Enable Pages (Settings → Pages → Source: GitHub Actions) if not done.
2. **Stage 3:** Lighthouse (mobile) on every page, axe and a keyboard/screen-reader pass, HTML and structured-data validation, social previews, copy review, launch checklist (Docs/Roadmap.md). Measure the path tracer on a real phone and on an integrated GPU.

## Needs Charitha's input (`grep -rn "TODO(charitha)" src`)

- `site.ts`:
  - `portfolioUrl` (empty, so links are hidden);
  - public contact `email` (empty, so links are hidden);
  - confirm the tagline.
- Rotunda:
  - pricing model and price (shows "Price TBA");
  - real hero and screenshots (placeholders now);
  - trailer YouTube ID;
  - system requirements;
  - Steam and Meta store URLs (shown as "Coming soon");
  - release date when public.
- Rotunda **privacy policy**: Meta requires one. Write `src/content/product-privacy/rotunda.md` with true facts, then set `hasPrivacyPolicy: true`.
- Site privacy page: review the text and its date.

## Known issues / notes

- Path tracer frame times on real GPUs are unmeasured; only a software GPU is available here.
- The hero stills come from `scripts/render-hero-images.mjs` (CPU rendering, slow). Re-run it after any change to the scene or tone mapping (Docs/HowTo/RenderHeroImages.md).
- Product Markdown bodies should be first person ("I …"), short sentences.
- A draft's images are still copied into `dist/_astro/`, though no page links them. This is harmless.
- `robots.txt` has no effect under a `github.io/<repo>/` path. It will once a custom domain is set.
- Lighthouse has not been measured yet (Stage 3).
