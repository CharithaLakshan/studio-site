# Design Directions

Stage 1, Step A. Three different visual directions for the [LKY] studio site. Pick one, or mix parts. Nothing here is built yet.

All contrast ratios below were calculated with the WCAG 2.x formula. "Decorative" means the colour is never used for text or for anything a user must see to operate the page.

## Shared baseline (true for every direction)

- The wordmark is live text read from `src/config/site.ts`. No direction depends on the letters "LKY" or on the brackets.
- Zero client JavaScript by default. Every motif below is pure CSS (gradients, borders, shadows, transitions). No canvas, no WebGL, no video backgrounds.
- `prefers-reduced-motion: reduce` turns every transition into an instant state change.
- Body text is at least 16px (17-18px on desktop), line length 60-75 characters.
- Placeholder art is generated in the site's own style and carries a visible "Placeholder" label until real screenshots exist.
- Fonts are self-hosted WOFF2, variable where possible, subset to Latin, `font-display: swap`, with metric-matched system fallbacks to avoid layout shift.

---

## Direction 1 — Key Light

**Mood:** A dark stage where each product is lit by one soft, warm light.

### Palette

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `void` | `#0B0C0E` | Page background | — |
| `surface` | `#121418` | Cards, panels | — |
| `raised` | `#1A1D22` | Hovered cards, inputs | — |
| `line` | `#2A2E35` | Hairlines, borders | Decorative |
| `text` | `#EDEAE4` | Body and headings (warm white) | 16.3:1 on `void` |
| `text-muted` | `#A39F98` | Secondary text, captions | 7.4:1 on `void`, 6.4:1 on `raised` |
| `key` | `#F2B66D` | Accent: links, primary button fill, focus ring | 10.9:1 on `void`, 9.4:1 on `raised` |
| `on-key` | `#0B0C0E` | Text on `key` fills | 10.9:1 |
| `fill` | `#4A5D7A` | Cool "fill light" in gradients only | Decorative |

One warm accent (tungsten) against a cool fill, the way a lighting artist sets up a key and fill.

### Type

- **Archivo** (SIL OFL 1.1, variable weight and width). Headings use the expanded width (≈115-125) at large sizes for a film-title feel; body uses normal width.
- **JetBrains Mono** (SIL OFL 1.1) for small metadata labels only: status, platform, type, frame numbers.

### Layout

**Home**
```
[LKY]                                   Products  About
-----------------------------------------------------------
                                  (soft light pool, top right)
  TAGLINE IN EXPANDED TYPE,
  TWO OR THREE LINES
  one-line studio sentence

  ┌───────────────────────────────────────────────────────┐
  │  Featured product, 21:9 key art, vignetted             │
  │  ROTUNDA            IN DEVELOPMENT · WINDOWS PC VR     │
  │  tagline                                  [View →]    │
  └───────────────────────────────────────────────────────┘

  All products                                   ┌───┐┌───┐┌───┐
  3-column grid of 16:9 cards (1 column mobile)  └───┘└───┘└───┘

  Studio intro (left, 2-3 sentences)   Links: YouTube / Email / GitHub
-----------------------------------------------------------
footer: wordmark · privacy · ©
```

**Product page**
- Full-bleed 21:9 hero image with a dark vignette. Title, tagline and status sit on the lower-left of the image.
- Below: two columns on desktop. Main column = description, key features, screenshots, trailer. Side column = a sticky "spec sheet" card (status, platforms, release date, store buttons, privacy link).
- On mobile the spec sheet moves directly under the hero, so store buttons are reachable without scrolling through the description.

### Signature motif: the key light

- Every hero and featured frame sits in a soft elliptical pool of warm light (one `radial-gradient`, zero bytes of images).
- Cards have a 1px "specular rim": a border gradient that is brighter on the top-left edge, as if the key light catches the bevel.
- Hover or keyboard focus raises the light: the pool and rim brighten by changing opacity only (cheap to composite).
- Gradient banding is hidden with a tiny tiled blue-noise texture (≈2 KB PNG) at very low opacity. A rendering person will notice the absence of banding; nobody else will notice anything.

### Motion

Slow and photographic. 400-700ms "exposure" fades with a long ease-out. Light changes intensity; layout never moves. No parallax, no scroll-triggered animation.

### Why it suits a graphics/XR studio

- Game and VR media is dark. Screenshots and trailers look best on near-black, and Steam and Meta Horizon store pages are dark too, so the jump from store to site is seamless.
- It shows craft through light itself: key/fill, falloff, specular edges, dithering. That is exactly the brief's "light, depth and motion".
- It stays elegant with only one product. Empty space reads as a dark stage, not as missing content.

### Risks

- Dark tech sites are common. It only feels premium if the lighting is tuned carefully; done lazily it becomes "another dark template".
- Glows can reduce perceived contrast. Rule: no text ever sits on a glow brighter than `raised`.
- With no real screenshots yet, the placeholder art carries a lot of weight.
- Archivo's expanded width needs care on small screens (switch to normal width below ~480px).

---

## Direction 2 — Viewport

**Mood:** The site as a calm, well-organised scene editor: grids, axes, an inspector panel.

### Palette

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `bg` | `#1D1F22` | Page background (graphite, not black) | — |
| `panel` | `#25282C` | Cards, inspector panel | — |
| `panel-raised` | `#2D3035` | Hover, active tab | — |
| `grid` | `#2F3337` | Background grid lines | Decorative |
| `line` | `#3A3E44` | Borders | Decorative |
| `text` | `#E4E5E2` | Body and headings | 13.1:1 on `bg` |
| `text-muted` | `#A3A7AC` | Labels, captions | 6.8:1 on `bg`, 5.5:1 on `panel-raised` |
| `select` | `#6CB4FF` | Accent: links, selection brackets, focus | 7.6:1 on `bg`, 6.8:1 on `panel` |
| `axis-x` | `#E5615A` | Gizmo X axis | Decorative (4.9:1) |
| `axis-y` | `#8BC34A` | Gizmo Y axis | Decorative (7.9:1) |
| `axis-z` | `#5B8DEF` | Gizmo Z axis | Decorative (5.1:1) |

The three axis colours are used only in the small gizmo and never to carry meaning.

### Type

- **IBM Plex Sans** (SIL OFL 1.1) for headings and body. Engineered, neutral, very legible.
- **IBM Plex Mono** (SIL OFL 1.1) for the wordmark, nav, labels and key/value metadata. Same family, so the two sit together naturally.

### Layout

**Home**
```
[LKY]  ·  products  ·  about                         ⌖ x y z
-----------------------------------------------------------
  · · · · · · · faint orthographic grid · · · · · · · · ·
  Tagline in Plex Sans, large
  one-line studio sentence                       (XYZ gizmo)

  ┌ ─                                                 ─ ┐
     Featured product in a "viewport" frame
     caption bar: rotunda · app · in development
  └ ─                                                 ─ ┘

  products ── all | games | apps | tools | experiences
  asset-browser grid: thumbnail + mono caption

  ┌ inspector ───────────────┐
  │ studio      [LKY]        │   short intro text
  │ based in    Sri Lanka    │
  │ youtube     →            │
  └──────────────────────────┘
```

**Product page**
- Hero media framed as a viewport with corner brackets and a caption bar.
- Desktop: an "Inspector" panel to the right of the hero with key/value rows (type, status, platforms, release, stores).
- Description and features in a single readable column below.
- Screenshots as a contact sheet with frame numbers (`01 / 06`).
- System requirements as a mono spec table (minimum / recommended columns).

### Signature motif: selection brackets

- Corner marks, like an editor's selection outline, frame the hovered or focused card. They also frame the featured product at rest.
- They echo the brackets in the current name `[LKY]`, but still read as selection marks if the name changes.
- A faint orthographic grid (CSS `repeating-linear-gradient`, zero bytes) sits behind the hero only, fading out with a mask.

### Motion

Crisp, tool-like. 120-180ms, fast ease-out. Brackets snap from 6px outside to the corners on hover/focus. No slow fades.

### Why it suits a graphics/XR studio

- It speaks the language of the tools you use every day (Unity, Unreal, Blender) without copying any of them.
- The inspector pattern is a natural fit for store-style metadata: platforms, status, requirements.
- Cheapest direction in bytes: almost everything is CSS lines and gradients.

### Risks

- Can read as "developer tool" rather than "studio that makes experiences". Less emotional pull.
- Too much monospace tires readers. Rule: mono for labels and values only, never paragraphs.
- Easy to slide into parody of an engine UI. Must not copy any editor's exact colours or icons.
- Product art competes with grid lines; the grid must stay behind the hero only.

---

## Direction 3 — Atrium

**Mood:** A quiet gallery in daylight: warm paper, soft shadows, room to breathe.

### Palette (light-first, with a dark variant that follows the system setting)

| Token | Light | Dark | Use | Contrast (light / dark) |
|---|---|---|---|---|
| `paper` | `#F2EFE8` | `#141311` | Page background | — |
| `surface` | `#FBF9F4` | `#1C1B18` | Cards, plates | — |
| `line` | `#D9D3C7` | `#2E2C27` | Hairlines | Decorative |
| `ink` | `#1B1A17` | `#ECE8DF` | Body and headings | 15.2:1 / 15.2:1 |
| `ink-muted` | `#5E5A52` | `#A8A296` | Captions, metadata | 6.0:1 / 7.3:1 |
| `accent` | `#2B3BC4` | `#9EA8FF` | Links, buttons, focus (ultramarine) | 7.2:1 / 8.4:1 |
| `shadow` | `rgb(58 44 26)` | `rgb(0 0 0)` | Shadow tint at low alpha | Decorative |

### Type

- **Newsreader** (SIL OFL 1.1, variable with optical sizes) for display headings. Elegant at large sizes, calm, slightly literary.
- **Instrument Sans** (SIL OFL 1.1, variable) for body, UI and metadata. Tabular figures for system requirements.
- No monospace face; technical detail is carried by layout and tables instead.

### Layout

**Home**
```
[LKY]                                          Products  About
-------------------------------------------------------------
  Large serif tagline,                    ┌──────────────┐
  set over three short lines              │ featured     │
                                          │ product plate│
  one-line studio sentence                └──────────────┘
                                          Rotunda — caption

  ─────────────── Work ───────────────
  ┌──────────┐   ┌──────────┐
  │  plate   │   │  plate   │      2-column catalogue grid,
  └──────────┘   └──────────┘      captions under each plate
  Title — type · status

  "Studio intro as a short pull-quote in serif."
                    — Charitha Lakshan
```

**Product page**
- Monograph layout. Big serif title and tagline, then a wide hero "plate" with a caption line.
- Desktop: body text in a 65ch column, with a left margin column ("marginalia") for status, platforms, release and store buttons.
- Mobile: the margin column becomes a compact block between the hero and the description.
- Screenshots as a sequence of plates; the trailer is a plate with a play button.

### Signature motif: contact shadows

- Images sit on the paper like printed plates under a skylight, with two-layer shadows: a tight dark contact shadow plus a wide soft penumbra.
- On hover the plate lifts: the contact shadow fades and the penumbra widens and softens, the way a real shadow behaves as an object moves away from a surface (the same idea as contact-hardening shadows in a renderer).
- Section dividers are a hairline with a long, faint shadow below, as if the page were folded.

### Motion

Gentle and physical. 250-350ms with a soft ease. Only elevation and shadow change. No on-load animation.

### Why it suits a graphics/XR studio

- It stands apart from the default dark "gamer" look and reads as confident and crafted.
- Light physics (ambient occlusion, contact shadows) is still a rendering idea, just expressed in daylight.
- Best readability of the three for long descriptions and privacy policies.

### Risks

- Game and VR screenshots are usually dark and can feel heavy on light paper.
- Store pages (Steam, Meta) are dark, so arriving from a store is a visual jump.
- Feels less "immersive"; the serif display can read as editorial rather than technical.
- Two themes means twice the contrast checking and screenshot review.
- Layered shadows on many cards cost more paint time than the other directions (still fine at this site's size).

---

## Side by side

| | Key Light | Viewport | Atrium |
|---|---|---|---|
| Base | Near-black, warm | Graphite, neutral | Warm paper (+ dark variant) |
| Accent | Tungsten `#F2B66D` | Selection blue `#6CB4FF` | Ultramarine `#2B3BC4` |
| Fonts | Archivo + JetBrains Mono | IBM Plex Sans + Plex Mono | Newsreader + Instrument Sans |
| Motif | Soft key light, specular rim | Selection brackets, ortho grid | Contact shadows on plates |
| Motion | Slow fades (400-700ms) | Crisp snaps (120-180ms) | Soft lifts (250-350ms) |
| Feels like | A lit stage / film title | A scene editor | A gallery monograph |
| Main risk | Generic if lighting is lazy | Cold, tool-like | Dark media on light paper |

## Recommendation: Key Light

Key Light is the best fit for the brief. It puts the media first, matches the dark context of the stores that will link here, and expresses "light, depth and motion" directly through how the page is lit rather than through decoration. It also holds up with a single product, which is the situation at launch.

If you want to mix, the part that transplants best is Viewport's **inspector panel**: key/value rows in mono for the product spec sheet. It fits naturally inside Key Light's sticky side column. Viewport's selection brackets could also become Key Light's focus style, but that adds a second motif, so I would only do it if you want the bracket echo of the current name.
