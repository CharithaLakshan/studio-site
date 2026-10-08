# Re-render the Hero Images

The home hero opens on a pre-rendered poster and only path-traces live when the visitor asks. Its pictures are rendered by the same code, with the same 12:5 framing (`FRAME` in `src/scripts/path-tracer.ts`), so they line up exactly with the live canvas. They live in `src/assets/hero/`:

| File | Size | Used for |
|---|---|---|
| `poster-1024.jpg` | 2880×1200, 1024 spp | The poster (LCP image), served as responsive WebP from 960 to 2880 px |
| `stage-1.jpg` | 1320×550, 1 spp | Full-size 1 spp stage, loaded on first click of its thumbnail |
| `stage-16.jpg` | 1320×550, 16 spp | Full-size 16 spp stage, likewise |
| `thumb-1.jpg`, `thumb-16.jpg`, `thumb-1024.jpg` | 240×100 | The three thumbnails, rendered at their own size so the noise is true to size |

The stage images use the live canvas's maximum size (`MAX_W` in `path-tracer-hero.ts`), so their noise matches what the live render shows. The same run also writes `public/og-default.jpg` (1200×630 from the middle of the poster, around the spheres, no text). `ONLY=thumb,stage` skips the slow poster.

Re-render them whenever you change the scene, the camera, `BAND`, the light or the tone mapping in `src/scripts/path-tracer.ts`:

```sh
npm install                       # esbuild comes with Astro
node scripts/render-hero-images.mjs
```

- It needs Playwright with Chromium. That is **not** a project dependency: it uses a global install (`npm i -g playwright`, then `npx playwright install chromium`) or the one in the Claude cloud environment.
- It renders on the CPU (SwiftShader). The poster takes about 45 minutes; thumbnails and stages under a minute. `SPP=64 node scripts/render-hero-images.mjs` gives a quick, noisy preview (it writes `*-64.jpg` instead of the 1024 files; delete them afterwards).
- They are stored as JPEG (quality 93) to keep the repository small; Astro converts them to WebP at build time.

Then run `npm run check && npm run build`, look at the home page and commit the images with the code change.
