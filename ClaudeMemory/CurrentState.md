# Current State

_Rewritten at the end of every session. Last: 2026-10-07, end of Stage 2._

## What works

- The full static site builds clean (`npm run check` and `npm run build`: 0 errors, 0 warnings): Home, Products, Rotunda page, About, Privacy, 404, sitemap, robots.txt.
- Key Light design system implemented (`src/styles/tokens.css`, `global.css`, components).
- Single brand file `src/config/site.ts`. The brand-swap test passed.
- Products collection with schema validation. Drafts never build. Privacy flag/file and slug/id mismatches fail the build.
- Store buttons: live / Coming soon / hidden. Trailer loads YouTube only on click.
- Deploy workflow ready (`.github/workflows/deploy.yml`). Not run yet, because Pages is not enabled.

## What's next

1. **Charitha (manual):** merge the Stage 2 PR, then Settings → Pages → Source: **GitHub Actions** (Docs/HowTo/Deploy.md), then re-run the workflow if needed.
2. **Stage 3:** Lighthouse, accessibility, HTML/structured-data validation, social previews, copy review, launch checklist (Docs/Roadmap.md).

## Needs Charitha's input (`grep -rn "TODO(charitha)" src`)

- `site.ts`: confirm the tagline. Add a public contact **email** (currently empty, so email links are hidden).
- Rotunda: real hero and screenshots (placeholders now), trailer YouTube ID, system requirements, Steam and Meta store URLs, release date when public.
- Rotunda **privacy policy**: Meta requires one. Write `src/content/product-privacy/rotunda.md` with true facts, then set `hasPrivacyPolicy: true`.
- About: keep the "final-year undergraduate" line current.
- Site privacy page: review the text and its date.

## Known issues / notes

- Lighthouse has not been measured yet (Stage 3).
- The Stage 1 HTML mockups were never made (decision logged). The design direction was adopted without an explicit choice; if Charitha wants another direction or a mix, change `tokens.css` and the component styles.
- A draft's images are still copied into `dist/_astro/`, though no page links them. This is harmless.
- `robots.txt` has no effect under a `github.io/<repo>/` path. It will once a custom domain is set.
- Fonts: about 130 KB total (Archivo variable 90 KB, preloaded; JetBrains Mono 40 KB). Further subsetting is a Stage 3 option.
