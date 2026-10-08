/**
 * Wires the hero in PathTracer.astro.
 *
 * - The page opens on the pre-rendered 1024 spp poster. path-tracer.ts is imported, and the WebGL2
 *   context created, only when the visitor starts a live render: the primary button, or a click or
 *   drag on the picture (which also moves the light). Nothing runs unasked, with or without reduced motion.
 * - Primary button: Render live → Pause → Resume; after convergence, Render again. Restart shows
 *   while a render is running or paused.
 * - Thumbnails stop any live render and show that stage full size (1 and 16 spp load on first click).
 * - The live canvas has the poster's 12:5 framing and object-fit, capped at MAX_W pixels wide. It
 *   pauses when the tab is hidden or the hero is off-screen, and stops at MAX_SPP.
 */
import type { PathTracer } from './path-tracer';

const MAX_SPP = 1024;
/** Live canvas width cap (0.73 MP at 12:5). The stage images are rendered at this width. */
const MAX_W = 1320;
/** FRAME.aspect in path-tracer.ts, repeated here so the module loads only on demand. */
const ASPECT = 12 / 5;

const samples = (n: number) => `${n} ${n === 1 ? 'sample' : 'samples'} per pixel`;
const STATUS = {
  poster: `Pre-rendered at ${samples(MAX_SPP)}. Press Render live to watch it converge in your browser.`,
  running: 'Rendering live, one sample per pixel each frame.',
  paused: (n: number) => `Paused at ${samples(n)}.`,
  done: `Converged at ${MAX_SPP} samples. The GPU is idle again.`,
  stage: (n: number) => `This is the frame at ${samples(n)}.`,
  failed: `Your browser can’t run the live renderer, so this stays the frame rendered ahead of time at ${samples(MAX_SPP)}.`,
};
const LABEL = { picture: 'Render live', running: 'Pause', paused: 'Resume', done: 'Render again' } as const;

type Mode = keyof typeof LABEL;

export function mountHero(root: HTMLElement) {
  const q = <T extends Element>(sel: string) => root.querySelector<T>(sel)!;
  const stage = q<HTMLElement>('[data-pt-stage]');
  const canvas = q<HTMLCanvasElement>('[data-pt-canvas]');
  const sppEl = q<HTMLElement>('[data-pt-spp]');
  const status = q<HTMLElement>('[data-pt-status]');
  const play = q<HTMLButtonElement>('[data-pt-play]');
  const restartBtn = q<HTMLButtonElement>('[data-pt-restart]');
  const thumbs = [...root.querySelectorAll<HTMLButtonElement>('[data-pt-thumb]')];
  const stageImgs = new Map(
    [...root.querySelectorAll<HTMLImageElement>('[data-pt-stage-img]')].map((img) => [Number(img.dataset.ptStageImg), img]),
  );

  let mode: Mode = 'picture';
  let shown = MAX_SPP; // the stage picture on show in picture mode
  let tracer: PathTracer | null = null;
  let loading: Promise<PathTracer | null> | null = null;
  let broken = false;
  let raf = 0;
  let onScreen = true;

  status.textContent = STATUS.poster;
  status.setAttribute('role', 'status'); // after the first text, so only changes are announced
  root.classList.add('is-ready');

  const setSpp = (n: number) => (sppEl.textContent = String(n).padStart(4, '0'));

  function update() {
    play.textContent = LABEL[mode];
    const live = mode === 'running' || mode === 'paused';
    if (!live && document.activeElement === restartBtn) play.focus();
    restartBtn.hidden = !live;
    for (const b of thumbs) b.setAttribute('aria-pressed', String(mode === 'picture' && Number(b.dataset.ptThumb) === shown));
  }

  function setMode(m: Mode, text: string) {
    mode = m;
    status.textContent = text;
    update();
    schedule();
  }

  /** Imports the path tracer and creates the WebGL2 context, once. */
  function load() {
    loading ??= import('./path-tracer')
      .then(({ PathTracer }) => {
        const t = PathTracer.create(canvas);
        if (!t) return null;
        canvas.tabIndex = 0;
        canvas.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          fail();
        });
        new IntersectionObserver(([e]) => {
          onScreen = !!e?.isIntersecting;
          schedule();
        }).observe(stage);
        return (tracer = t);
      })
      .catch((e: unknown) => {
        console.warn(e);
        return null;
      });
    return loading;
  }

  function fail() {
    broken = true;
    tracer = null;
    cancelAnimationFrame(raf);
    raf = 0;
    canvas.hidden = true;
    shown = MAX_SPP;
    for (const img of stageImgs.values()) img.hidden = true;
    setSpp(MAX_SPP);
    play.hidden = true;
    setMode('picture', STATUS.failed);
  }

  function schedule() {
    if (!raf && tracer && mode === 'running' && onScreen && !document.hidden) raf = requestAnimationFrame(frame);
  }

  /** Sizes the canvas for the picture's shown size, at 12:5, before the first sample. */
  function fit(t: PathTracer) {
    const r = stage.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.min(MAX_W, Math.max(r.width, r.height * ASPECT) * dpr);
    const W = Math.max(12, Math.round(w / 12) * 12);
    t.resize(W, W / ASPECT);
  }

  function frame() {
    raf = 0;
    const t = tracer;
    if (!t || mode !== 'running') return;
    if (t.spp === 0) fit(t);
    t.sample();
    t.present();
    if (canvas.hidden) {
      canvas.hidden = false; // only after the first frame, so an empty canvas never shows
      for (const img of stageImgs.values()) img.hidden = true;
    }
    setSpp(t.spp);
    if (t.spp >= MAX_SPP) setMode('done', STATUS.done);
    else schedule();
  }

  /** Starts (or restarts) a live render from 1 spp, optionally with the light under a pointer. */
  async function start(opts: { fresh?: boolean; at?: PointerEvent } = {}) {
    if (broken) return;
    const first = !tracer;
    setSpp(0);
    setMode('running', STATUS.running);
    const t = tracer ?? (await load());
    if (!t) return fail();
    if (opts.fresh && !first) t.resetLight();
    if (opts.at) aim(t, opts.at);
    t.reset();
    schedule();
  }

  function aim(t: PathTracer, e: PointerEvent) {
    const r = stage.getBoundingClientRect();
    t.setLightFromImage((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
  }

  function showStage(n: number) {
    cancelAnimationFrame(raf);
    raf = 0;
    shown = n;
    canvas.hidden = true;
    setSpp(n);
    setMode('picture', STATUS.stage(n));
    for (const [k, img] of stageImgs) {
      if (k !== n) img.hidden = true;
      else if (img.src) img.hidden = false;
      else {
        img.src = img.dataset.src!;
        img.decode().then(
          () => (img.hidden = mode !== 'picture' || shown !== n),
          () => {},
        );
      }
    }
  }

  play.addEventListener('click', () => {
    if (mode === 'picture') start({ fresh: true });
    else if (mode === 'running') setMode('paused', STATUS.paused(tracer?.spp ?? 0));
    else if (mode === 'paused') setMode('running', STATUS.running);
    else start();
  });
  restartBtn.addEventListener('click', () => start());
  for (const b of thumbs) b.addEventListener('click', () => showStage(Number(b.dataset.ptThumb)));

  // Click or drag on the picture moves the light; on the poster it starts a live render from there.
  // Touch acts on lift or on a sideways drag, so scrolling past the hero starts nothing.
  let dragging = false;
  const moveLight = (e: PointerEvent) => {
    if (mode === 'picture' || !tracer) return void start({ fresh: true, at: e });
    aim(tracer, e);
    tracer.reset();
    if (mode !== 'running') setMode('running', STATUS.running);
  };
  stage.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || broken) return;
    dragging = true;
    stage.setPointerCapture(e.pointerId);
    if (e.pointerType !== 'touch') moveLight(e);
  });
  stage.addEventListener('pointermove', (e) => dragging && (e.pointerType !== 'touch' || mode !== 'picture') && moveLight(e));
  stage.addEventListener('pointerup', (e) => {
    if (dragging && e.pointerType === 'touch' && mode === 'picture') moveLight(e);
    dragging = false;
  });
  stage.addEventListener('pointercancel', () => (dragging = false));

  canvas.addEventListener('keydown', (e) => {
    const step = ({ ArrowLeft: [-0.5, 0], ArrowRight: [0.5, 0], ArrowUp: [0, -0.5], ArrowDown: [0, 0.5] } as const)[
      e.key as 'ArrowLeft'
    ];
    if (!step || !tracer) return;
    e.preventDefault();
    tracer.nudgeLight(step[0], step[1]);
    if (mode !== 'running') setMode('running', STATUS.running);
    schedule();
  });

  document.addEventListener('visibilitychange', schedule);
}
