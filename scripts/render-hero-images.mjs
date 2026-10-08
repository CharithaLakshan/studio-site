// Renders the static fallback images of the path-traced hero with the same shader as the live one.
// Usage: node scripts/render-hero-images.mjs   (needs Playwright with Chromium; not a project dependency)
// Writes src/assets/hero/{wide-1024,tall-1024,strip-1,strip-16}.jpg and public/og-default.jpg.
// The 1 and 16 spp strip frames are rendered at 800px wide, the size they are shown at, so their noise is true to size.
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
const ONLY = process.env.ONLY?.split(',');   // e.g. ONLY=strip to re-render just the strip frames
const out = join(root, 'src/assets/hero');
mkdirSync(out, { recursive: true });
const work = join(tmpdir(), `render-hero-${process.pid}`);
mkdirSync(work, { recursive: true });
execFileSync(join(root, 'node_modules/.bin/esbuild'), [
  join(root, 'src/scripts/path-tracer.ts'), '--bundle', '--format=iife', '--global-name=PT', `--outfile=${join(work, 'pt.js')}`,
]);
writeFileSync(join(work, 'index.html'), `<!doctype html><canvas id="c"></canvas><script src="pt.js"></script><script>
window.render = async (w, h, spp, keep) => {
  const c = document.getElementById('c');
  const t = PT.PathTracer.create(c, { preserveDrawingBuffer: true });
  if (!t) throw new Error('WebGL2 with float render targets is required');
  t.resize(w, h);
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
const jobs = [['strip', 800, 343, 16, [1, 16]], ['wide', 1680, 720, SPP, [SPP]], ['tall', 864, 1080, SPP, [SPP]]];
for (const [name, w, h, spp, keep] of jobs.filter(([name]) => !ONLY || ONLY.includes(name))) {
  const t0 = Date.now();
  const shots = await page.evaluate(([w, h, spp, keep]) => window.render(w, h, spp, keep), [w, h, spp, keep]);
  for (const [spp, data] of Object.entries(shots)) save(data, join(out, `${name}-${spp}.jpg`));
  console.log(`${name} ${w}x${h} ${spp} spp in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}
// Default social image: 1200×630 centre crop of the wide frame, no text.
if (!ONLY || ONLY.includes('wide')) {
const og = await page.evaluate(async (src) => {
  const img = new Image(); img.src = src; await img.decode();
  const c = document.createElement('canvas'); c.width = 1200; c.height = 630;
  const s = 630 / 600, sw = 1200 / s;            // take a 1143×600 window around the spheres
  c.getContext('2d').drawImage(img, (img.width - sw) / 2, 70, sw, 600, 0, 0, 1200, 630);
  return c.toDataURL('image/jpeg', 0.9);
}, 'data:image/jpeg;base64,' + readFileSync(join(out, `wide-${SPP}.jpg`)).toString('base64'));
save(og, join(root, 'public/og-default.jpg'));
}
await browser.close();
