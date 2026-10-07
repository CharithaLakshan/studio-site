# Local Development

## Requirements

- Node.js 22.12 or newer (CI uses 24, see `.nvmrc`), and npm.

## First run

```sh
npm install
npm run dev
```

Open http://localhost:4321/studio-site/. The base path is part of every URL, so `http://localhost:4321/` alone shows Astro's "base path" notice.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload. |
| `npm run check` | Type-checks `.astro` and `.ts` files and validates content. Must report 0 errors, 0 warnings, 0 hints. |
| `npm run build` | Static build to `dist/`. Fails on invalid content. |
| `npm run preview` | Serves `dist/` exactly as GitHub Pages will. |

Before every push, run `npm run check && npm run build`. CI runs the same commands.

## Where things are

- Brand and identity values: `src/config/site.ts`
- Products: `src/content/products/*.md` (see AddProduct.md)
- Colours, type, spacing, motion: `src/styles/tokens.css`
- Structure overview: Docs/Architecture/Architecture.md

## Troubleshooting

- **Content error on build:** the message names the file and the field. Compare it with Docs/Architecture/ContentModel.md.
- **Image not found:** image paths in frontmatter are relative to the Markdown file, e.g. `../../assets/products/<slug>/hero.png`.
- **Stale types after a schema change:** stop the dev server, delete `.astro/`, then run `npm run check`.
