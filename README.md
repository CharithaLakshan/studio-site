# studio-site

Official website of [LKY], a one-person indie studio. A product showcase: a static Astro site with a permanent storefront page per product (price, platforms, store buttons for Steam, the Meta Horizon Store, Google Play, itch.io). The home hero is a small WebGL2 path tracer.

Live (once Pages is enabled): https://charithalakshan.github.io/studio-site/

## Quick start

```sh
npm install
npm run dev      # http://localhost:4321/studio-site/
npm run check && npm run build
```

Requires Node 22.12+ (CI uses Node 24).

## Common tasks

- Add a product: [Docs/HowTo/AddProduct.md](Docs/HowTo/AddProduct.md)
- Rename the studio: [Docs/HowTo/RenameBrand.md](Docs/HowTo/RenameBrand.md) (one file: `src/config/site.ts`)
- Deploy / custom domain: [Docs/HowTo/Deploy.md](Docs/HowTo/Deploy.md)
- Local development: [Docs/HowTo/LocalDev.md](Docs/HowTo/LocalDev.md)
- Re-render the hero stills: [Docs/HowTo/RenderHeroImages.md](Docs/HowTo/RenderHeroImages.md)

## Docs

- [Project brief](Docs/00-ProjectBrief.md)
- [Design system](Docs/Design/DesignSystem.md) · [Page specs](Docs/Design/PageSpecs.md) · [Exploration and decision](Docs/Design/Exploration/Concepts.md)
- [Architecture](Docs/Architecture/Architecture.md) · [Content model](Docs/Architecture/ContentModel.md)
- [Roadmap](Docs/Roadmap.md)

## Licences

Fonts: Space Grotesk and Space Mono, SIL Open Font License 1.1 (`src/assets/fonts/`).
