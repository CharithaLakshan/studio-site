/**
 * Wires the path tracer to the hero markup in PathTracer.astro.
 *
 * - Shows the pre-rendered still until the live renderer runs, and keeps it when WebGL2 or float
 *   render targets are missing.
 * - prefers-reduced-motion, or WebGL2 running on the CPU (no GPU): keeps the still frame. A button
 *   lets the visitor opt in.
 * - Starts after first paint, pauses when the tab is hidden or the image is off-screen, caps the
 *   device pixel ratio at 2 and stops at MAX_SPP (then nothing runs until the light moves).
 */
import { PathTracer, softwareWebGL } from './path-tracer';

const MAX_SPP = 1024;
const CAPTURES = [1, 16, MAX_SPP];
const PIXEL_BUDGET = 5.5e5;

const NOTE_LIVE =
  'Path-traced live in your browser, one sample per pixel per frame. It stops at 1024 samples, then the GPU goes idle. Click or drag on the image, or focus it and use the arrow keys, to move the light.';
const NOTE_REDUCED =
  'Reduced motion is on, so this is a still frame. It was rendered ahead of time by the same path tracer, at 1024 samples per pixel.';
const NOTE_SOFTWARE =
  'Your browser renders WebGL without a graphics card, which is too slow for this, so this is a still frame. It was rendered ahead of time by the same path tracer, at 1024 samples per pixel.';
const NOTE_FAILED =
  'Your browser can’t run the live renderer, so this is a still frame. It was rendered ahead of time by the same path tracer, at 1024 samples per pixel.';

const afterFirstPaint = (fn: () => void) =>
  requestAnimationFrame(() =>
    setTimeout(() => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 1000 }) : fn()), 0),
  );

export function mountPathTracer(root: HTMLElement) {
  const q = <T extends Element>(sel: string) => root.querySelector<T>(sel)!;
  const stage = q<HTMLElement>('[data-pt-stage]');
  const canvas = q<HTMLCanvasElement>('[data-pt-canvas]');
  const sppEl = q<HTMLElement>('[data-pt-spp]');
  const note = q<HTMLElement>('[data-pt-note]');
  const pauseBtn = q<HTMLButtonElement>('[data-pt-pause]');
  const restartBtn = q<HTMLButtonElement>('[data-pt-restart]');
  const playBtn = q<HTMLButtonElement>('[data-pt-play]');
  const tiles = [...root.querySelectorAll<HTMLCanvasElement>('[data-pt-tile]')];

  if (!('WebGL2RenderingContext' in window)) {
    note.textContent = NOTE_FAILED;
    return;
  }
  const held = matchMedia('(prefers-reduced-motion: reduce)').matches
    ? NOTE_REDUCED
    : softwareWebGL()
      ? NOTE_SOFTWARE
      : '';
  if (held) {
    note.textContent = held;
    playBtn.hidden = false;
    playBtn.addEventListener('click', () => {
      playBtn.hidden = true;
      goLive();
    });
    return;
  }
  goLive();

  function goLive() {
    root.classList.add('is-live'); // hides the still; the first paint shows the empty band
    sppEl.textContent = '0000';
    afterFirstPaint(start);
  }

  function showStill() {
    root.classList.remove('is-live');
    sppEl.textContent = String(MAX_SPP);
    note.textContent = NOTE_FAILED;
  }

  function start() {
    const created = PathTracer.create(canvas);
    if (!created) return showStill();
    const t = created; // a const of type PathTracer, so the hoisted functions below need no `!`
    canvas.tabIndex = 0;
    pauseBtn.hidden = restartBtn.hidden = false;
    note.textContent = NOTE_LIVE;

    let onScreen = true;
    let paused = false;
    let raf = 0;
    const want = () => onScreen && !document.hidden && !paused && t.spp < MAX_SPP;
    const schedule = () => {
      if (!raf && want()) raf = requestAnimationFrame(frame);
    };

    function fit() {
      const r = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = r.width * dpr, h = r.height * dpr;
      const s = Math.min(1, Math.sqrt(PIXEL_BUDGET / Math.max(1, w * h)));
      if (t.resize(w * s, h * s)) resetTiles();
    }

    function frame() {
      raf = 0;
      fit();
      t.sample();
      t.present();
      canvas.hidden = false; // only after the first frame, so an empty (black) canvas never shows
      sppEl.textContent = String(t.spp).padStart(4, '0');
      const i = CAPTURES.indexOf(t.spp);
      if (i >= 0) capture(tiles[i]);
      schedule();
    }

    // Copy the frame into a strip tile, in the same task, so the drawing buffer is still valid.
    function capture(tile: HTMLCanvasElement | undefined) {
      if (!tile) return;
      const ctx = tile.getContext('2d');
      if (!ctx) return;
      const s = Math.max(tile.width / canvas.width, tile.height / canvas.height);
      const w = canvas.width * s, h = canvas.height * s;
      ctx.drawImage(canvas, (tile.width - w) / 2, (tile.height - h) / 2, w, h);
      tile.hidden = false;
    }

    function resetTiles() {
      for (const tile of tiles) tile.hidden = true;
    }

    function restart() {
      t.reset();
      resetTiles();
      schedule();
    }

    let dragging = false;
    const moveTo = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      t.setLightFromImage((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
      restart();
    };
    canvas.addEventListener('pointerdown', (e) => {
      dragging = true;
      canvas.setPointerCapture(e.pointerId);
      moveTo(e);
    });
    canvas.addEventListener('pointermove', (e) => dragging && moveTo(e));
    canvas.addEventListener('pointerup', () => (dragging = false));
    canvas.addEventListener('pointercancel', () => (dragging = false));
    canvas.addEventListener('keydown', (e) => {
      const step = ({ ArrowLeft: [-0.5, 0], ArrowRight: [0.5, 0], ArrowUp: [0, -0.5], ArrowDown: [0, 0.5] } as const)[
        e.key as 'ArrowLeft'
      ];
      if (!step) return;
      e.preventDefault();
      t.nudgeLight(step[0], step[1]);
      restart();
    });

    // The label says what the button does next, so it carries no aria-pressed state as well.
    pauseBtn.addEventListener('click', () => {
      paused = !paused;
      pauseBtn.textContent = paused ? 'Resume' : 'Pause';
      schedule();
    });
    restartBtn.addEventListener('click', () => {
      paused = false;
      pauseBtn.textContent = 'Pause';
      restart();
    });

    // Re-fit on resize even when the render has finished, so the canvas is never stretched.
    new ResizeObserver(() => {
      if (!paused) fit();
      schedule();
    }).observe(stage);
    new IntersectionObserver(([e]) => {
      onScreen = !!e?.isIntersecting;
      schedule();
    }).observe(stage);
    document.addEventListener('visibilitychange', schedule);
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      canvas.hidden = true;
      pauseBtn.hidden = restartBtn.hidden = true;
      showStill();
    });
    schedule();
  }
}
