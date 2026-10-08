# Roadmap

## Stage 1 — Design and architecture ✅ (partial)

- Brief, three design directions. Key Light was adopted in Stage 2 (see Decisions.md). The HTML mockups were skipped because the real site replaced them.

## Stage 2 — Build ✅

- [x] Astro 7 scaffold, TypeScript strict, folder structure
- [x] `src/config/site.ts` as the single brand file
- [x] Tokens, global CSS, self-hosted fonts
- [x] BaseLayout with SEO head, header with mobile menu, footer
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

## Stage 3 — Review and hardening

- [ ] Lighthouse (mobile) on every page: 95+ in all four categories. Record the scores in SessionLog.
- [ ] Automated accessibility pass (axe) plus a manual keyboard and screen-reader pass (NVDA or VoiceOver).
- [ ] Verify WCAG 2.2 AA contrast for every state (hover, focus, disabled) on real hardware.
- [ ] Test at 320px, 390px, 768px, 1024px and 1440px, and at 200% zoom.
- [ ] Validate HTML (Nu validator) and structured data (Rich Results Test, schema.org validator).
- [ ] Check social previews (Open Graph debugger, X card validator).
- [ ] Measure the hero path tracer on a phone and an integrated GPU (time to 1024 spp, frame time). Lower the bounce count or the spp cap on small screens if needed.
- [ ] Fonts are 55 KB in total (Space Grotesk 22 KB, Space Mono 2 × 17 KB). Subsetting further is optional.
- [ ] Review the copy with Charitha. Resolve every `TODO(charitha)` (`grep -rn "TODO(charitha)" src`).
- [ ] Optional: link checker in CI.
- [ ] Launch checklist: Pages enabled, live URL works, every product URL loads, sitemap submitted to Search Console, store listings point to `/products/<slug>/`.

## Later

- **Real Rotunda media:** screenshots, hero, trailer ID, system requirements, store links, price, privacy policy.
- **Portfolio URL** in `site.ts` (links stay hidden until it is set).
- **Official store badges:** replace the text store buttons with official Steam, Meta and Google Play badges, following each brand's guidelines.
- **Press kit pages:** `/products/<slug>/press/` with a fact sheet, downloadable assets and logos.
- **Custom domain:** see Docs/HowTo/Deploy.md.
- **Devlog:** a `posts` collection with an RSS feed.
- **Branded social cards:** generate per-product OG images at build time.
- **Studio rename:** see Docs/HowTo/RenameBrand.md.
