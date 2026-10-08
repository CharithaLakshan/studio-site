/**
 * A small progressive path tracer in WebGL2.
 *
 * Scene: a white studio cove (floor, curved fillet, back wall) with five spheres under one
 * spherical area light. One sample per pixel per call to sample(); a running average lives in a
 * float texture (ping-pong), and show() tone-maps it to the canvas.
 *
 * The same code renders the hero's poster and stage images (see Docs/HowTo/RenderHeroImages.md),
 * so the live render and the pictures always match.
 */

export const SPHERES: readonly (readonly [number, number, number, number])[] = [
  [-1.15, 0.58, -0.55, 0.58], // matte cobalt
  [0.22, 0.5, 0.25, 0.5], // glass
  [1.38, 0.42, -0.85, 0.42], // chrome
  [-0.18, 0.21, 1.05, 0.21], // matte black
  [0.95, 0.16, 0.95, 0.16], // matte white
];

const VS = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const TRACE = `#version 300 es
precision highp float;
uniform sampler2D uPrev;
uniform vec2 uRes;
uniform int uFrame;
uniform vec3 uLight;
uniform vec3 uCam;
uniform vec3 uTarget;
uniform float uHalf;
uniform vec2 uShift;
out vec4 o;

const float PI = 3.14159265;
uint st;
uint pcg() { st = st * 747796405u + 2891336453u; uint w = ((st >> ((st >> 28u) + 4u)) ^ st) * 277803737u; return (w >> 22u) ^ w; }
float rnd() { return float(pcg()) / 4294967296.0; }

const int NS = ${SPHERES.length};
const vec4 SPH[NS] = vec4[NS](${SPHERES.map((s) => `vec4(${s.map((v) => v.toFixed(2)).join(', ')})`).join(', ')});
const float LR = 1.1;
const vec3 LE = vec3(9.0, 8.6, 8.0);

struct Hit { float t; vec3 n; int m; };  // m: 0 cove, 1-5 spheres, 9 light, -1 miss

float sph(vec3 ro, vec3 rd, vec4 s) {
  vec3 oc = ro - s.xyz; float b = dot(oc, rd), c = dot(oc, oc) - s.w * s.w, h = b * b - c;
  if (h < 0.0) return -1.0;
  h = sqrt(h);
  float t = -b - h; if (t > 1e-4) return t;
  t = -b + h; return t > 1e-4 ? t : -1.0;
}

Hit scene(vec3 ro, vec3 rd) {
  Hit H; H.t = 1e9; H.m = -1;
  // Cove: floor (z > -2), quarter-cylinder fillet (axis x, y = 1, z = -2, r = 1), back wall z = -3 (y > 1).
  if (rd.y < 0.0) { float t = -ro.y / rd.y; vec3 p = ro + rd * t; if (t > 1e-4 && p.z >= -2.0 && t < H.t) { H.t = t; H.n = vec3(0, 1, 0); H.m = 0; } }
  if (rd.z < 0.0) { float t = (-3.0 - ro.z) / rd.z; vec3 p = ro + rd * t; if (t > 1e-4 && p.y >= 1.0 && t < H.t) { H.t = t; H.n = vec3(0, 0, 1); H.m = 0; } }
  {
    vec2 o2 = vec2(ro.y - 1.0, ro.z + 2.0), d2 = rd.yz;
    float a = dot(d2, d2), b = dot(o2, d2), c = dot(o2, o2) - 1.0, h = b * b - a * c;
    if (a > 1e-8 && h > 0.0) {
      h = sqrt(h);
      for (int k = 0; k < 2; k++) {
        float t = (-b + (k == 0 ? -h : h)) / a; vec3 p = ro + rd * t;
        if (t > 1e-4 && p.y < 1.0 && p.z < -2.0 && t < H.t) { H.t = t; H.n = normalize(vec3(0.0, 1.0 - p.y, -2.0 - p.z)); H.m = 0; }
      }
    }
  }
  for (int i = 0; i < NS; i++) { float t = sph(ro, rd, SPH[i]); if (t > 0.0 && t < H.t) { H.t = t; H.n = normalize(ro + rd * t - SPH[i].xyz); H.m = i + 1; } }
  float tl = sph(ro, rd, vec4(uLight, LR));
  if (tl > 0.0 && tl < H.t) { H.t = tl; H.n = normalize(ro + rd * tl - uLight); H.m = 9; }
  return H;
}

vec3 albedo(int m) { return m == 1 ? vec3(0.03, 0.07, 0.62) : m == 4 ? vec3(0.025) : m == 5 ? vec3(0.8) : vec3(0.82); }
vec3 env(vec3 d) { return vec3(1.05, 1.04, 1.02) * (0.55 + 0.45 * clamp(d.y * 0.5 + 0.6, 0.0, 1.0)); }
vec3 cosdir(vec3 n) {
  float u = rnd(), v = rnd(), a = 2.0 * PI * u, r = sqrt(v);
  vec3 t = normalize(abs(n.y) < 0.99 ? cross(n, vec3(0, 1, 0)) : cross(n, vec3(1, 0, 0))), b = cross(n, t);
  return normalize(t * cos(a) * r + b * sin(a) * r + n * sqrt(1.0 - v));
}

vec3 trace(vec3 ro, vec3 rd) {
  vec3 L = vec3(0), T = vec3(1);
  bool diffPrev = false;
  for (int bounce = 0; bounce < 6; bounce++) {
    Hit h = scene(ro, rd);
    if (h.m < 0) { L += T * env(rd); break; }
    if (h.m == 9) { if (!diffPrev) L += T * LE; break; }
    vec3 p = ro + rd * h.t, n = h.n;
    if (h.m == 2) {                                   // glass, Schlick Fresnel
      bool inside = dot(rd, n) > 0.0; vec3 nn = inside ? -n : n; float eta = inside ? 1.5 : 1.0 / 1.5;
      float c = -dot(rd, nn), f = 0.04 + 0.96 * pow(1.0 - c, 5.0);
      vec3 rf = refract(rd, nn, eta);
      if (rnd() < f || dot(rf, rf) == 0.0) { rd = reflect(rd, nn); ro = p + nn * 1e-3; } else { rd = rf; ro = p - nn * 1e-3; }
      T *= vec3(0.98); diffPrev = false;
    } else if (h.m == 3) {                            // chrome, slightly rough
      rd = normalize(reflect(rd, n) + 0.06 * (vec3(rnd(), rnd(), rnd()) - 0.5));
      if (dot(rd, n) <= 0.0) break;
      ro = p + n * 1e-3; T *= vec3(0.9, 0.88, 0.85); diffPrev = false;
    } else {                                          // diffuse, with next-event estimation on the light
      vec3 a = albedo(h.m); ro = p + n * 1e-3;
      vec3 w = uLight - p; float d2 = dot(w, w), d = sqrt(d2); w /= d;
      float cmax = sqrt(max(0.0, 1.0 - LR * LR / d2));
      float ct = 1.0 - rnd() * (1.0 - cmax), stt = sqrt(1.0 - ct * ct), ph = 2.0 * PI * rnd();
      vec3 u = normalize(abs(w.y) < 0.99 ? cross(w, vec3(0, 1, 0)) : cross(w, vec3(1, 0, 0))), v = cross(w, u);
      vec3 l = normalize(u * cos(ph) * stt + v * sin(ph) * stt + w * ct);
      float ndl = dot(n, l);
      if (ndl > 0.0) { Hit s = scene(ro, l); if (s.m == 9) L += T * a / PI * LE * ndl * 2.0 * PI * (1.0 - cmax); }
      T *= a; rd = cosdir(n); diffPrev = true;
    }
    if (bounce > 2) { float q = max(T.r, max(T.g, T.b)); if (rnd() > q) break; T /= q; }
  }
  return min(L, vec3(12.0));
}

void main() {
  st = uint(gl_FragCoord.x) * 1973u + uint(gl_FragCoord.y) * 9277u + uint(uFrame) * 26699u | 1u; pcg();
  vec2 jit = vec2(rnd(), rnd());
  // Image plane at distance 1: uHalf is the half-height, uShift the lens shift (both in tangent units).
  vec2 uv = (gl_FragCoord.xy - 0.5 + jit - 0.5 * uRes) / uRes.y * 2.0 * uHalf + uShift;
  vec3 ww = normalize(uTarget - uCam), uu = normalize(cross(ww, vec3(0, 1, 0))), vv = cross(uu, ww);
  vec3 rd = normalize(uu * uv.x + vv * uv.y + ww);
  vec3 c = trace(uCam, rd);
  vec3 prev = texelFetch(uPrev, ivec2(gl_FragCoord.xy), 0).rgb;
  o = vec4(mix(prev, c, 1.0 / float(uFrame + 1)), 1.0);
}`;

// Tone map, then scale so the white cove lands exactly on the page colour (--color-paper).
const SHOW = `#version 300 es
precision highp float;
uniform sampler2D uAcc;
out vec4 o;
void main() {
  vec3 c = texelFetch(uAcc, ivec2(gl_FragCoord.xy), 0).rgb * 0.92;
  c = c * (2.51 * c + 0.03) / (c * (2.43 * c + 0.59) + 0.14);
  c = pow(clamp(c, 0.0, 1.0), vec3(1.0 / 2.2));
  o = vec4(c * vec3(0.906, 0.898, 0.878) / 0.93, 1.0);
}`;

export const DEFAULT_LIGHT: [number, number, number] = [-2.6, 4.4, 2.2];

type Vec3 = [number, number, number];

export interface View {
  eye: Vec3;
  target: Vec3;
  /** Half-height of the image plane at distance 1 (tan of half the vertical field of view). */
  half: number;
  /** Lens shift in the same units: moves the frame without changing the perspective. */
  shift: [number, number];
}

const EYE: Vec3 = [0, 1.25, 5.6];
const TARGET: Vec3 = [0, 0.45, -0.2];

/**
 * Where the spheres sit in the 12:5 frame, as fractions of its width and height (v from the top).
 * The plain studio above the band holds the headline, the space below it the hero's bottom bar.
 * The band is narrow enough that a cover crop down to 4:3 (phones) only removes empty backdrop.
 */
export const BAND = { width: 0.43, top: 0.32, bottom: 0.76 };

const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: Vec3): Vec3 => {
  const l = Math.hypot(...a);
  return [a[0] / l, a[1] / l, a[2] / l];
};

/**
 * The box the spheres project to on the image plane of the fixed camera (tangent units):
 * centre (cx, cy) and half-size (hx, hy). Each sphere's silhouette is bounded exactly per axis.
 */
function sceneBox() {
  const ww = norm(sub(TARGET, EYE)), uu = norm(cross(ww, [0, 1, 0])), vv = cross(uu, ww);
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const [x, y, z, r] of SPHERES) {
    const d = sub([x, y, z], EYE);
    const cz = dot(d, ww);
    for (const [c, axis] of [[dot(d, uu), 0], [dot(d, vv), 1]] as const) {
      const a = Math.atan2(c, cz), s = Math.asin(r / Math.hypot(c, cz));
      const lo = Math.tan(a - s), hi = Math.tan(a + s);
      if (axis === 0) (x0 = Math.min(x0, lo)), (x1 = Math.max(x1, hi));
      else (y0 = Math.min(y0, lo)), (y1 = Math.max(y1, hi));
    }
  }
  return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, hx: (x1 - x0) / 2, hy: (y1 - y0) / 2 };
}

/**
 * The one framing used everywhere: the poster, the stage images and the live canvas are all
 * rendered at FRAME.aspect with FRAME.view, and shown with the same object-fit: cover, so they line
 * up exactly. The camera zooms and shifts its lens so the spheres fill BAND.
 */
export const FRAME = (() => {
  const aspect = 12 / 5;
  const { cx, cy, hx, hy } = sceneBox();
  const half = Math.max(hy / (BAND.bottom - BAND.top), hx / (BAND.width * aspect));
  // Image-plane y of the band's centre, relative to the frame's centre (v grows downwards).
  const mid = half * (1 - (BAND.top + BAND.bottom));
  const view: View = { eye: EYE, target: TARGET, half, shift: [cx, cy - mid] };
  return { aspect, view };
})();

interface Target {
  tex: WebGLTexture;
  fbo: WebGLFramebuffer;
}

export class PathTracer {
  readonly canvas: HTMLCanvasElement;
  spp = 0;
  width = 0;
  height = 0;
  light: [number, number, number] = [...DEFAULT_LIGHT];
  readonly format: 'RGBA32F' | 'RGBA16F';

  private gl: WebGL2RenderingContext;
  private trace: WebGLProgram;
  private show: WebGLProgram;
  private vao: WebGLVertexArrayObject;
  private targets: Target[] = [];
  private cur = 0;
  private view = FRAME.view;
  private u: Record<string, WebGLUniformLocation | null> = {};

  /** Returns null when WebGL2 or float render targets are missing, or a shader fails. */
  static create(canvas: HTMLCanvasElement, opts: { preserveDrawingBuffer?: boolean } = {}): PathTracer | null {
    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: false,
      depth: false,
      powerPreference: 'low-power',
      preserveDrawingBuffer: !!opts.preserveDrawingBuffer,
    });
    if (!gl) return null;
    const f32 = !!gl.getExtension('EXT_color_buffer_float');
    if (!f32 && !gl.getExtension('EXT_color_buffer_half_float')) return null;
    try {
      return new PathTracer(canvas, gl, f32 ? 'RGBA32F' : 'RGBA16F');
    } catch (e) {
      console.warn(e);
      return null;
    }
  }

  private constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext, format: 'RGBA32F' | 'RGBA16F') {
    this.canvas = canvas;
    this.gl = gl;
    this.format = format;
    const compile = (src: string, type: number) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
      return s;
    };
    const link = (fs: string) => {
      const p = gl.createProgram()!;
      gl.attachShader(p, compile(VS, gl.VERTEX_SHADER));
      gl.attachShader(p, compile(fs, gl.FRAGMENT_SHADER));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? 'link');
      return p;
    };
    this.trace = link(TRACE);
    this.show = link(SHOW);
    for (const n of ['uPrev', 'uRes', 'uFrame', 'uLight', 'uCam', 'uTarget', 'uHalf', 'uShift']) this.u[n] = gl.getUniformLocation(this.trace, n);
    this.u.uAcc = gl.getUniformLocation(this.show, 'uAcc');
    this.vao = gl.createVertexArray()!;
  }

  /** Sizes the canvas to w×h device pixels (keep it at FRAME.aspect). Returns true (and restarts) if the size changed. */
  resize(w: number, h: number): boolean {
    w = Math.max(2, Math.round(w));
    h = Math.max(2, Math.round(h));
    if (w === this.width && h === this.height) return false;
    const gl = this.gl;
    this.width = this.canvas.width = w;
    this.height = this.canvas.height = h;
    for (const t of this.targets) {
      gl.deleteTexture(t.tex);
      gl.deleteFramebuffer(t.fbo);
    }
    this.targets = [0, 1].map(() => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texStorage2D(gl.TEXTURE_2D, 1, gl[this.format], w, h);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      return { tex, fbo };
    });
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.reset();
    return true;
  }

  reset() {
    this.spp = 0;
  }

  /** Adds one sample per pixel. */
  sample() {
    const gl = this.gl;
    const src = this.targets[this.cur]!, dst = this.targets[1 - this.cur]!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
    gl.viewport(0, 0, this.width, this.height);
    gl.useProgram(this.trace);
    gl.bindVertexArray(this.vao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, src.tex);
    gl.uniform1i(this.u.uPrev!, 0);
    gl.uniform2f(this.u.uRes!, this.width, this.height);
    gl.uniform1i(this.u.uFrame!, this.spp);
    gl.uniform3fv(this.u.uLight!, this.light);
    gl.uniform3fv(this.u.uCam!, this.view.eye);
    gl.uniform3fv(this.u.uTarget!, this.view.target);
    gl.uniform1f(this.u.uHalf!, this.view.half);
    gl.uniform2fv(this.u.uShift!, this.view.shift);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this.cur = 1 - this.cur;
    this.spp++;
  }

  /** Tone-maps the current average onto the canvas. */
  present() {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.width, this.height);
    gl.useProgram(this.show);
    gl.bindVertexArray(this.vao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.targets[this.cur]!.tex);
    gl.uniform1i(this.u.uAcc!, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /** Moves the light. u, v in 0..1 across the image (left to right, top to bottom). */
  setLightFromImage(u: number, v: number) {
    this.light[0] = -3.6 + 7.2 * Math.min(1, Math.max(0, u));
    this.light[2] = 3.4 - 3.6 * Math.min(1, Math.max(0, v));
    this.reset();
  }

  /** Puts the light back where the poster has it. */
  resetLight() {
    this.light = [...DEFAULT_LIGHT];
    this.reset();
  }

  nudgeLight(dx: number, dz: number) {
    this.light[0] = Math.min(3.6, Math.max(-3.6, this.light[0] + dx));
    this.light[2] = Math.min(3.4, Math.max(-0.2, this.light[2] + dz));
    this.reset();
  }
}
