# Re-render the Hero Images

The home hero is a live path tracer. Before it starts, and when it can't run, the page shows still frames rendered by the same code. They live in `src/assets/hero/`:

| File | Size | Used for |
|---|---|---|
| `wide-1024.jpg` | 2400×733, 1024 spp | Still frame at ≥40rem. Rendered with the `STILL` framing (wider and taller than any plate needs) and scaled by CSS to match the live camera at any aspect from 1.2 to 4.2 |
| `tall-1024.jpg` | 864×1080, 1024 spp | Still frame below 40rem (fixed phone framing) |
| `strip-1024.jpg` | 800×450, 1024 spp | Third strip tile |
| `strip-16.jpg` | 800×450, 16 spp | Second strip tile |
| `strip-1.jpg` | 800×450, 1 spp | First strip tile |

The same run also writes `public/og-default.jpg` (1200×630, the centre of the wide still, no text). `ONLY=strip,wide` or `ONLY=tall` renders a subset.

Re-render them whenever you change the scene, the camera, the light or the tone mapping in `src/scripts/path-tracer.ts`:

```sh
npm install                       # esbuild comes with Astro
node scripts/render-hero-images.mjs
```

- It needs Playwright with Chromium. That is **not** a project dependency: it uses a global install (`npm i -g playwright`, then `npx playwright install chromium`) or the one in the Claude cloud environment.
- It renders on the CPU (SwiftShader), so it takes several minutes. `SPP=64 node scripts/render-hero-images.mjs` gives a quick, noisy preview (it writes `*-64.jpg` instead of the 1024 files).
- They are stored as JPEG (quality 93) to keep the repository small; Astro converts them to responsive WebP at build time.

Then run `npm run check && npm run build`, look at the home page and commit the images with the code change.
