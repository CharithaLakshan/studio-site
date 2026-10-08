# studio-site

Official website of [LKY], a one-person indie studio making games, VR apps, tools and real-time experiences. A static Astro site with a permanent page per product and links to Steam, the Meta Horizon Store and Google Play.

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

## Docs

- [Project brief](Docs/00-ProjectBrief.md)
- [Design system](Docs/Design/DesignSystem.md) · [Page specs](Docs/Design/PageSpecs.md) · [Design directions](Docs/Design/DesignDirections.md)
- [Architecture](Docs/Architecture/Architecture.md) · [Content model](Docs/Architecture/ContentModel.md)
- [Roadmap](Docs/Roadmap.md)

## Licences

Fonts: Archivo and JetBrains Mono, SIL Open Font License 1.1 (`src/assets/fonts/`).
