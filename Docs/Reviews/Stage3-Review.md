# Stage 3 Review

Date: 2026-10-08. Scope: every page of the built site (`dist/`), served locally under the GitHub Pages base path `/studio-site/`.

## How it was checked

| Area | Tool | Notes |
|---|---|---|
| Layout | Playwright + headless Chromium | 320, 360, 640, 768, 1280 and 1920 px wide, every page. Checked for horizontal scroll, elements past the viewport and clipped text. Full-page screenshots reviewed by eye. |
| Accessibility | axe-core 4 (WCAG 2.0/2.1/2.2 A + AA, best practice) | Run at 360 and 1280 px on every page. |
| Keyboard | Playwright | Tabbed through every page and recorded each stop and its focus outline. |
| Contrast | Computed (WCAG formula) | Every text and button pair, including the disabled store button, and the worst case of the paper grain (4% ink specks). |
| Performance, SEO, best practices | Lighthouse 13 CLI, mobile preset | Run against the local server. |
| HTML | html-validate (recommended rules) | Every page. |
| Links | A script that resolves every `href`, `src`, `srcset`, CSS `url()`, sitemap `<loc>` and robots `Sitemap:` | Checked against `dist/` under `/studio-site/`. |
| JSON-LD | Parsed and checked by hand | Google's Rich Results Test needs a public URL, so it moves to the launch checklist. |
| Brand swap | Rebuilt with `name: 'Halcyon Works'` | Same test as Stage 2. |

Limits: the only GPU here is SwiftShader, a software renderer. Lighthouse ran on a local server without gzip, so its "document latency" hints (compression) don't apply to GitHub Pages, which gzips. No screen reader was available.

## Results after the fixes

- **Lighthouse (mobile):** 100 / 100 / 100 / 100 (performance, accessibility, best practices, SEO) on Home, Products, Rotunda, About and Privacy. Home: FCP 0.9 s, LCP 1.2 s, TBT 0 ms, CLS 0, 130 KiB transferred.
- **axe:** 0 violations on every page at both widths. The only "incomplete" items are contrast checks axe can't finish over the wordmark's text shadow and the grain background; they were computed by hand (below).
- **Layout:** no horizontal scroll and no clipped text at any of the six widths.
- **Links:** 138 internal references, all resolve under `/studio-site/`. External links: YouTube, GitHub, the GitHub and Google privacy statements.
- **HTML:** valid, apart from one deliberate pattern (below).
- **Brand swap:** "Halcyon Works" on 6 of 6 pages. "LKY" in 0 files of `dist/`, `src/`, `public/`, `.github/` and `astro.config.ts`. No owner name, alias, email or social URL outside `src/config/site.ts`. Reverted.

### Contrast (WCAG 2.2 AA needs 4.5:1 for text, 3:1 for UI)

| Pair | Ratio |
|---|---|
| Ink on paper | 15.0 |
| Ink-2 on paper (secondary text, disabled "Coming soon" buttons and their dashed border) | 7.1 |
| Ink-2 on paper, worst grain speck | 6.5 |
| Ink-2 on card (disabled button in the featured card) | 7.9 |
| Ink-2 on paper-2 | 6.3 |
| Cobalt on paper, worst grain speck | 6.6 |
| Cobalt on card | 8.0 |
| Paper on ink (footer, primary buttons, hovered buttons) | 15.0 |
| `#aab3ff` on ink (footer hover and focus) | 9.5 |
| Ink on paper-2 | 13.4 |

Every pair passes AA with room to spare: the lowest is 6.3:1 (ink-2 on paper-2).

## Findings and fixes

### Performance

1. **The home page scored 59 for performance under Lighthouse.** On a machine without a GPU, WebGL2 runs on the CPU (SwiftShader, llvmpipe), and the path tracer blocked the main thread for 84 s (TBT). PageSpeed Insights runs the same way, so the public score would have been 59. The same applies to real visitors without GPU acceleration, whose tab would freeze. **Fixed:** `softwareWebGL()` in `path-tracer.ts` reads the WebGL renderer name. On a software renderer the hero keeps the 1024 spp still and offers the "Render it live" button, as it does for reduced motion. Home now scores 100 (TBT 0 ms).
2. **Render-blocking CSS:** two stylesheets (14 KB + 6 KB) delayed the first paint by about 300–500 ms on simulated mobile. **Fixed:** `build.inlineStylesheets: 'always'`. All the CSS is about 5 KB gzipped, so inlining it beats an extra request.
3. **The LCP image had no priority hint.** **Fixed:** the hero still has `fetchpriority="high"`.
4. **Strip tile sizes:** the 1 spp tile is noise and compresses badly: 121 KB at 640 px, lazy-loaded. **Fixed:** added a 480 px size (32 KB), which most screens pick.
5. **Canvas stretched after a resize:** once the render finished (or before it resumed), resizing the window stretched the old frame. **Fixed:** the resize observer re-fits the canvas, unless the render is paused.
6. Checked and fine: no unused JavaScript. The only script (13 KB, the path tracer) loads on the home page only, as a module, so it doesn't block rendering. The trailer script appears only on pages with a trailer. Unused CSS is below Lighthouse's threshold. All images go through `astro:assets` as WebP with `srcset`, and below-the-fold images are lazy. Fonts: one preload (Space Grotesk), `font-display: swap`, 55 KB in total, CLS 0.

### Accessibility

7. **Invisible focus on the hero canvas.** The canvas can be focused (arrow keys move the light), but its focus outline was hidden: the plate's fade mask clips it, and the plate is full-bleed, so the left and right edges sit off-screen. **Fixed:** a `.pt-focus` frame draws the 3px cobalt ring between the crop marks while the canvas has keyboard focus.
8. **Two navigation landmarks with the same name on About** (the page's social links and the footer, both "Elsewhere"; axe `landmark-unique`). **Fixed:** the About links are a plain list, as on the home page.
9. **Pause button:** it had `aria-pressed` and a label that changes (Pause ↔ Resume), so screen readers announced "Resume, toggle button, not pressed". **Fixed:** the label alone carries the state.
10. **Invalid HTML in the hero:** a `<figcaption>` sat inside a `<div>`. **Fixed:** it is a `<p>`; the figure still names it with `aria-labelledby`.
11. Checked and fine:
    - Headings: one h1 per page, no skipped levels.
    - Landmarks: header, main, footer and named navs, plus a skip link.
    - Keyboard: every interactive element is reachable in a sensible order and shows the 3px ring (ink footer: `#aab3ff`). A product card shows the ring around the whole card.
    - Alt text: placeholders say they are not screenshots; decorative card images use `alt=""`.
    - Reduced motion: still frame, 0 frames rendered, an opt-in button. JavaScript off: the still and no buttons.
    - 44 px targets.

### Design fidelity

12. **"Coming soon" buttons in the featured card broke into four fragments** ("META HORIZON / STORE", "COMING / SOON") at 360 px and on desktop, where the card's text column is narrow. **Fixed:** buttons in the `row` layout share a line only when each gets 15rem, else they stack full width like the buy box. When a planned button is still too narrow, "Coming soon" moves under the store name in one piece.
13. **Featured card 19 px too wide at 320 px**, because the status row in its spec table couldn't shrink. **Fixed:** the status label may wrap beside its gauge, and the card's column can shrink (`minmax(0, 1fr)`).
14. **The storefront's bottom rule ran into the gutters:** it was neither full-bleed like every other section rule nor content-width. **Fixed:** it is full-bleed.
15. **Status badge text was 12 px**, smaller than every other mono label (13 px, `--step--1`). **Fixed:** it uses `--step--1`.
16. **The featured card's shadow was a hard-coded value.** **Fixed:** it is now the token `--shadow-featured`, documented in DesignSystem.md.
17. Checked against `Docs/Design/`: colours, type scale, rail, rules, shadows, buttons, store buttons, status gauge, crop marks and grain all match the spec.

### SEO

18. **Product titles had a full stop before the brand:** "Rotunda: A VR video player for 360°, 180° and flat video. — [LKY]". **Fixed:** a trailing full stop or exclamation mark is dropped from the tagline in the title.
19. **The 404 page had an `og:url` pointing to `/studio-site/404/`, which does not exist.** **Fixed:** `noindex` pages get no `og:url`, as they already had no canonical.
20. **Product social image:**
    - It was a 1200 px-wide resize, so a 21:9 hero gave a 1200×514 card that platforms crop.
    - **Fixed:** it is a 1200×630 cover crop, and every page now declares `og:image:width` and `og:image:height`.
    - A raster hero smaller than 1200×630 fails the build with a clear message, because the image would be upscaled.
    - Placeholder (SVG) heroes still use the site's default image, since social platforms can't show SVG.
21. Checked and fine:
    - Titles and descriptions are unique on every page.
    - Canonicals are absolute and include the base path.
    - The sitemap lists the 5 indexable pages, with the 404 excluded.
    - robots.txt points to the sitemap.
    - The product JSON-LD is valid JSON with `SoftwareApplication`, name, description, url, image, category, OS, author and publisher.
    - It has no `Offer` while the price is TBA, by design, so Google's Rich Results may report "missing offers".

### Code quality

22. **Casts:** `site.ts` used `as const`, which typed `portfolioUrl` and `email` as the literal `''`, so four files had to cast them (`as string`). **Fixed:** the config is a plain object, and the casts and the unused `Site` type are gone.
23. **Duplicate CSS:**
    - The wordmark's inverse variant repeated the base `text-shadow` rule.
    - Both privacy pages defined the same `.page-body`.
    - **Fixed:** the repeat is removed, and `.page-body` lives in `global.css`.
24. **Untyped tuples:** the hero strip was built from tuples cast with `as`. **Fixed:** it uses typed objects.
25. **Hero script:** the reduced-motion and software paths share one hold-and-opt-in branch, and the failure path is one `showStill()`. The `t!` assertions are gone.

## Deferred, and why

- **`role="list"` on styled lists:** html-validate calls it redundant. It is kept on purpose: Safari/VoiceOver drops list semantics from lists with `list-style: none`.
- **Rich Results Test, Open Graph debugger, X card validator:** they need the public URL. They are in the launch checklist.
- **Screen-reader pass (NVDA/VoiceOver):** none available here. It is in the launch checklist.
- **Path tracer on real GPUs** (phone, integrated GPU): only SwiftShader is available here. It is in the launch checklist.
- **Branded social cards** (title on the image): a new feature, not a fix; it stays in the Roadmap's "Later" list. Products with a raster hero already get their own 1200×630 card.
- **Privacy pages with no email and no GitHub link:** the contact line falls back to GitHub when `email` is empty. If both were empty, the link would be empty. Setting the email (a TODO) closes this, and Meta needs a contact anyway.
- **Lighthouse "document latency" (compression):** the local test server didn't gzip. GitHub Pages does.
- **`robots.txt` under a project path:** it has no effect until a custom domain is set (Deploy.md).
- **A draft's images are still emitted to `dist/_astro/`:** this is harmless, and nothing links them.
