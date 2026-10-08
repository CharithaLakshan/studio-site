// Renders the hero's pictures with the same shader and the same 12:5 framing (FRAME) as the live render.
// Usage: node scripts/render-hero-images.mjs   (needs Playwright with Chromium; not a project dependency)
// Writes src/assets/hero/{poster-1024,stage-1,stage-16,thumb-1,thumb-16,thumb-1024}.jpg and public/og-default.jpg.
// - poster: the LCP image, large enough for wide screens.
// - stage: the 1 and 16 spp frames shown full size, at the live canvas's own resolution so the noise matches.
// - thumb: the three thumbnails, rendered at their own size so their noise is true to size.
// See Docs/HowTo/RenderHeroImages.md.
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const require = createRequire(join(root, 'package.json'));
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  ({ chromium } = createRequire(execFileSync('npm', ['root', '-g']).toString().trim() + '/')('playwright'));
}

const SPP = Number(process.env.SPP ?? 1024);
const ONLY = process.env.ONLY?.split(','); // e.g. ONLY=thumb,stage to skip the slow poster
const out = join(root, 'src/assets/hero');
mkdirSync(out, { recursive: true });
const work = join(tmpdir(), `render-hero-${process.pid}`);
mkdirSync(work, { recursive: true });
execFileSync(join(root, 'node_modules/.bin/esbuild'), [
  join(root, 'src/scripts/path-tracer.ts'), '--bundle', '--format=iife', '--global-name=PT', `--outfile=${join(work, 'pt.js')}`,
]);
writeFileSync(join(work, 'index.html'), `<!doctype html><canvas id="c"></canvas><script src="pt.js"></script><script>
window.render = async (w, spp, keep) => {
  const c = document.getElementById('c');
  const t = PT.PathTracer.create(c, { preserveDrawingBuffer: true });
  if (!t) throw new Error('WebGL2 with float render targets is required');
  t.resize(w, w / PT.FRAME.aspect);
  const shots = {};
  while (t.spp < spp) {
    t.sample();
    if (keep.includes(t.spp)) { t.present(); shots[t.spp] = c.toDataURL('image/jpeg', 0.93); }
    if (t.spp % 4 === 0) await new Promise((r) => setTimeout(r, 0));
  }
  return shots;
};
</script>`);

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage();
await page.goto('file://' + join(work, 'index.html'));
const save = (dataUrl, file) => writeFileSync(file, Buffer.from(dataUrl.split(',')[1], 'base64'));
// Widths are multiples of 12, so every frame is exactly 12:5. The stage width matches MAX_W in path-tracer-hero.ts.
const jobs = [
  ['thumb', 240, SPP, [1, 16, SPP]],
  ['stage', 1320, 16, [1, 16]],
  ['poster', 2880, SPP, [SPP]],
];
for (const [name, w, spp, keep] of jobs.filter(([name]) => !ONLY || ONLY.includes(name))) {
  const t0 = Date.now();
  const shots = await page.evaluate((a) => window.render(...a), [w, spp, keep]);
  for (const [n, data] of Object.entries(shots)) save(data, join(out, `${name}-${n}.jpg`));
  console.log(`${name} ${w}x${(w * 5) / 12} ${spp} spp in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}
// Default social image: 1200×630 from the middle of the poster, around the spheres, no text.
if (!ONLY || ONLY.includes('poster')) {
  const og = await page.evaluate(async (src) => {
    const img = new Image(); img.src = src; await img.decode();
    const c = document.createElement('canvas'); c.width = 1200; c.height = 630;
    // A 1200:630 crop 70% of the poster's height, centred on the sphere band.
    const sh = img.height * 0.7, sw = (sh * 1200) / 630;
    const band = PT.BAND, sy = Math.min(img.height - sh, Math.max(0, ((band.top + band.bottom) / 2) * img.height - sh / 2));
    c.getContext('2d').drawImage(img, (img.width - sw) / 2, sy, sw, sh, 0, 0, 1200, 630);
    return c.toDataURL('image/jpeg', 0.9);
  }, 'data:image/jpeg;base64,' + readFileSync(join(out, `poster-${SPP}.jpg`)).toString('base64'));
  save(og, join(root, 'public/og-default.jpg'));
}
await browser.close();
