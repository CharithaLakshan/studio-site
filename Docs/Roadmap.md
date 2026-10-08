# Roadmap

## Stage 1 — Design and architecture ✅ (partial)

- Brief, three design directions. Key Light was adopted in Stage 2 (see Decisions.md). The HTML mockups were skipped because the real site replaced them.

## Stage 2 — Build ✅

- [x] Astro 7 scaffold, TypeScript strict, folder structure
- [x] `src/config/site.ts` as the single brand file
- [x] Tokens, global CSS, self-hosted fonts
- [x] BaseLayout with SEO head, header (no menu needed), footer
- [x] Home, Products, Product, Product privacy, About, Privacy, 404
- [x] Products collection + Rotunda + draft sample
- [x] Components incl. store buttons (Coming soon) and click-to-load trailer
- [x] Placeholder SVG art, favicon, default social image
- [x] Sitemap, robots.txt, JSON-LD
- [x] GitHub Pages workflow
- [x] Brand-swap test
- [x] HowTo docs, memory files

## Final design ✅ (2026-10-08)

- [x] Design exploration (five concepts), Converge picked with two touches from Stir
- [x] Re-positioned as a product showcase; portfolio link; Lab and research removed
- [x] Price, pricing model, planned stores, primary store; storefront product page
- [x] Products grouped by platform
- [x] Path-traced hero component with offline-rendered fallback stills
- [x] Self-hosted Space Grotesk and Space Mono; design lab deleted

## Stage 3 — Review and hardening ✅ (2026-10-08)

Report: `Docs/Reviews/Stage3-Review.md`. Launch steps for Charitha: `Docs/LaunchChecklist.md`.

- [x] Lighthouse (mobile) on every page: 100 in all four categories (local build, SwiftShader).
- [x] Automated accessibility pass (axe-core, WCAG 2.2 AA + best practice): 0 violations. Keyboard pass in headless Chromium.
- [x] WCAG 2.2 AA contrast computed for every text pair and state, including the disabled store button and the paper grain.
- [x] Tested at 320, 360, 640, 768, 1280 and 1920 px: no horizontal scroll, nothing clipped.
- [x] HTML validated (html-validate); JSON-LD parsed and checked.
- [x] Every internal link and asset path checked in `dist/` under the base path.
- [ ] Manual screen-reader pass (NVDA or VoiceOver) on real hardware.
- [ ] Rich Results Test and Open Graph / X card debuggers on the live URL (need a public URL).
- [ ] Measure the hero path tracer on a phone and an integrated GPU (time to 1024 spp, frame time). Lower the bounce count or the spp cap on small screens if needed.
- [ ] Review the copy with Charitha. Resolve every `TODO(charitha)` (see Docs/LaunchChecklist.md).
- [ ] Optional: link checker in CI.
- [ ] Fonts are 55 KB in total. Subsetting further is optional.

## Later

- **Real Rotunda media:** screenshots, hero, trailer ID, system requirements, store links, price, privacy policy.
- **Portfolio URL** in `site.ts` (links stay hidden until it is set).
- **Official store badges:** replace the text store buttons with official Steam, Meta and Google Play badges, following each brand's guidelines.
- **Press kit pages:** `/products/<slug>/press/` with a fact sheet, downloadable assets and logos.
- **Custom domain:** see Docs/HowTo/Deploy.md.
- **Devlog:** a `posts` collection with an RSS feed.
- **Branded social cards:** generate per-product OG images at build time.
- **Studio rename:** see Docs/HowTo/RenameBrand.md.
