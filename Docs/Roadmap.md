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

## Stage 3 — Review and hardening

- [ ] Lighthouse (mobile) on every page: 95+ in all four categories. Record the scores in SessionLog.
- [ ] Automated accessibility pass (axe) plus a manual keyboard and screen-reader pass (NVDA or VoiceOver).
- [ ] Verify WCAG 2.2 AA contrast for every state (hover, focus, disabled) on real hardware.
- [ ] Test at 320px, 390px, 768px, 1024px and 1440px, and at 200% zoom.
- [ ] Validate HTML (Nu validator) and structured data (Rich Results Test, schema.org validator).
- [ ] Check social previews (Open Graph debugger, X card validator).
- [ ] Decide whether to subset the fonts further. Archivo is 90 KB, JetBrains Mono 40 KB.
- [ ] Review the copy with Charitha. Resolve every `TODO(charitha)` (`grep -rn "TODO(charitha)" src`).
- [ ] Optional: link checker in CI.
- [ ] Launch checklist: Pages enabled, live URL works, every product URL loads, sitemap submitted to Search Console, store listings point to `/products/<slug>/`.

## Later

- **Real Rotunda media:** screenshots, hero, trailer ID, system requirements, store links, privacy policy.
- **Official store badges:** replace the text store buttons with official Steam, Meta and Google Play badges, following each brand's guidelines.
- **Press kit pages:** `/products/<slug>/press/` with a fact sheet, downloadable assets and logos.
- **Custom domain:** see Docs/HowTo/Deploy.md.
- **Devlog:** a `posts` collection with an RSS feed.
- **Branded social cards:** generate per-product OG images at build time.
- **Studio rename:** see Docs/HowTo/RenameBrand.md.
