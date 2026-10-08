# Current State

_Rewritten at the end of every session. Last: 2026-10-08, design exploration (graphics-first concepts)._

## What works

- The full static site builds clean (`npm run check`: 0 errors, 0 warnings, 0 hints; `npm run build`: 6 pages): Home, Products, Rotunda page, About, Privacy, 404, sitemap, robots.txt. **Unchanged this session.**
- Key Light design system implemented (`src/styles/tokens.css`, `global.css`, components). Still the live design.
- Single brand file `src/config/site.ts`. The brand-swap test passed in Stage 2.
- Deploy workflow ready (`.github/workflows/deploy.yml`).
- **Design lab (temporary):** `public/design-lab/` has five graphics-first home page concepts plus a gallery `index.html`, all `noindex`, not in the sitemap. Write-up, ranking and recommendation (Concept 3, Converge): `Docs/Design/Exploration/Concepts.md`. Screenshots: `Docs/Design/Exploration/screenshots/`. After merge (and once Pages is on): `https://charithalakshan.github.io/studio-site/design-lab/`.

## What's next

1. **Charitha:** pick a concept (or a mix) from the design lab. Also decide:
   - the tagline;
   - whether Kirana and the IJACSA paper go on the real site;
   - whether the Lab is a Home section or its own collection and pages.
2. **Then:** apply the chosen concept to the Astro site:
   - tokens and fonts, self-hosted;
   - the hero real-time element as a component;
   - Lab content;
   - product page restyle;
   - update DesignSystem.md and PageSpecs.md;
   - delete `public/design-lab/` and its thumbnails.
3. **Charitha (manual, if not done):** Settings → Pages → Source: **GitHub Actions** (Docs/HowTo/Deploy.md).
4. **Stage 3:** Lighthouse, accessibility, HTML and structured-data validation, social previews, copy review, launch checklist (Docs/Roadmap.md). Do this after the redesign, so it is measured once.

## Needs Charitha's input (`grep -rn "TODO(charitha)" src`)

- `site.ts`: confirm the tagline. The new positioning has five proposals in Concepts.md. Add a public contact **email** (currently empty, so email links are hidden).
- Rotunda: real hero and screenshots (placeholders now), trailer YouTube ID, system requirements, Steam and Meta store URLs, release date when public.
- Rotunda **privacy policy**: Meta requires one. Write `src/content/product-privacy/rotunda.md` with true facts, then set `hasPrivacyPolicy: true`.
- About: keep the "final-year undergraduate" line current.
- Site privacy page: review the text and its date.

## Known issues / notes

- New positioning: graphics and simulation first, games second, XR third (Decisions.md, 2026-10-08). The live site still uses the old intro and tagline until a concept is applied.
- Design-lab mockups hard-code brand values and use Google Fonts (a logged, temporary exception). Do not copy that into `src/`.
- Real-GPU frame times of the concepts are unmeasured: only a software GPU is available here. Press the backtick key on a concept page on a real device.
- Lighthouse has not been measured yet (Stage 3).
- A draft's images are still copied into `dist/_astro/`, though no page links them. This is harmless.
- `robots.txt` has no effect under a `github.io/<repo>/` path. It will once a custom domain is set.
- Fonts: about 130 KB total (Archivo variable 90 KB, preloaded; JetBrains Mono 40 KB).
