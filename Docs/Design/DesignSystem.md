# Design System — Key Light

Direction: **Key Light** (see DesignDirections.md, Direction 1). Dark only.
Code source of truth: `src/styles/tokens.css` (tokens) and `src/styles/global.css` (base styles, buttons, prose, helpers). If this doc and the code disagree, fix one of them in the same commit.

## Tokens

### Colour

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--color-void` | `#0b0c0e` | Page background | — |
| `--color-surface` | `#121418` | Cards, footer, spec sheet | — |
| `--color-raised` | `#1a1d22` | Media fallback, secondary button | — |
| `--color-line` | `#2a2e35` | Hairlines | Decorative |
| `--color-line-strong` | `#3a3f48` | Control borders, disabled store button | Decorative |
| `--color-text` | `#edeae4` | Body, headings | 16.3:1 on void |
| `--color-text-muted` | `#a39f98` | Labels, captions | 7.4:1 on void, 6.4:1 on raised |
| `--color-key` | `#f2b66d` | Links, primary fill, focus ring | 10.9:1 on void |
| `--color-on-key` | `#0b0c0e` | Text on key fill | 10.9:1 |
| `--color-fill` | `#4a5d7a` | Cool fill light in gradients | Decorative |

Light tokens (decorative only): `--light-key` (key at 16% alpha), `--light-key-strong` (26%), `--light-fill` (fill at 22%), `--rim` and `--rim-strong` (135° border gradients, bright at the top left).

**Rule:** text never sits on anything brighter than `--color-raised`. Over images, a vignette gradient guarantees a dark base under text.

### Type

- Sans: **Archivo** variable (wght 100-900, wdth 62-125). Self-hosted, `font-display: swap`, preloaded.
- Mono: **JetBrains Mono** variable (wght 100-800). Self-hosted, `font-display: swap`. Labels only.
- Metric-matched fallbacks: `Archivo Fallback` (Arial) and `JetBrains Mono Fallback`.

| Token | Value | Use |
|---|---|---|
| `--step--1` | 0.8125rem | Labels, captions, footer |
| `--step-0` | 1 → 1.125rem fluid | Body |
| `--step-1` | 1.25 → 1.5rem | Lede, h3 |
| `--step-2` | 1.5 → 2rem | h2, card titles |
| `--step-3` | 2 → 3rem | h1 |
| `--step-4` | 2.375 → 4.5rem | `.display` (hero h1) |

- Headings: weight 600-650, `font-stretch: 118%` (`--stretch-display`), tracking `-0.02em`, `text-wrap: balance`.
- Body: weight 400, stretch 100%, line height 1.6, max measure 68ch.
- `.label`: mono, `--step--1`, uppercase, tracking `0.06em`, muted.

### Space, layout, radii, shadow

- Space scale `--space-1`…`--space-10`: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px.
- `--gutter`: clamp(16px, 4vw, 40px). `--max-width`: 76rem. `--measure`: 68ch.
- Breakpoints (in media queries): 40rem (mobile nav), 48rem (21:9 heroes, 2-column studio), 64rem (product sidebar).
- Radii: `--radius-s` 4px, `--radius-m` 8px, `--radius-l` 14px, `--radius-pill`.
- Shadows: `--shadow-card` (soft drop under cards), `--shadow-hero` (featured frame).

### Motion

| Token | Value | Use |
|---|---|---|
| `--dur-fast` | 160ms | Colour and underline changes, arrow nudge |
| `--dur-base` | 400ms | Light raising (card rim, glow) |
| `--dur-slow` | 700ms | Reserved for slow fades |
| `--ease-out` | cubic-bezier(0.16, 1, 0.3, 1) | Default |
| `--ease-in-out` | cubic-bezier(0.65, 0, 0.35, 1) | Reserved |

Only opacity, colour and box-shadow animate. Layout never moves. There is no on-load or scroll animation. `prefers-reduced-motion: reduce` sets every duration to 0ms.

### Focus

`--focus-ring: 2px solid var(--color-key)`, `--focus-offset: 3px`, applied to `:focus-visible` everywhere. A card shows the ring on the whole card when its title link has focus.

## Signature motif

- **Light pool** (`.light-field`): a warm radial key light at the top right plus a cool fill at the bottom left, behind page headers and the home hero. It is clipped horizontally.
- **Specular rim**: a 1px gradient border (`--rim`) on cards, the featured frame and the spec sheet. On hover or focus a brighter rim and warm pool fade in (`--rim-strong`, opacity only).
- **Blue-noise dither**: a 64×64 blue-noise PNG (`src/assets/blue-noise.png`, 3 KB, inlined) tiled on the body at about 3% white, which hides gradient banding.

## Components

All components live in `src/components/`.

| Component | Spec |
|---|---|
| **Header** | Wordmark left, nav right (mono uppercase labels, 44px targets). `aria-current="page"` on an exact match, `"true"` on a section match, shown with a key-coloured underline. Below 40rem a "Menu" button (`aria-expanded`, `aria-controls`) toggles the nav; Escape closes it and returns focus. Without JS the button stays hidden and the nav is always visible. |
| **Wordmark** | `site.name` as text. Archivo 125% width, weight 700. Non-alphanumeric characters (e.g. brackets) are drawn in key colour at weight 400. |
| **Footer** | Surface background. Wordmark, tagline, social links, © year owner and a Privacy link. |
| **SocialLinks** | YouTube, GitHub, Email from config. Empty values are hidden. Mono uppercase. |
| **ProductCard** | Rim border, 16:9 media (decorative `alt=""`, because the title names it), type and platforms label, title (the link is stretched over the whole card), tagline, status badge. Hover or focus raises the light. |
| **ProductGrid** | `auto-fill, minmax(20rem, 1fr)`: 1 column on mobile, up to 3 on desktop. |
| **FeaturedProduct** | Mobile: 16:9 image above the text. ≥48rem: 21:9 frame with the text over a vignetted lower-left corner. Primary "View …" button plus status badge. |
| **StatusBadge** | Mono pill with a small "lamp" dot whose brightness rises from concept (30%) to released (100%). |
| **StoreButtons** | A vertical list. **Live**: key-filled, store name plus "Open store page ↗". **Coming soon** (empty string): `<span aria-disabled="true">`, dashed `--color-line-strong` border, transparent background, muted text (still AA), no pointer. Omitted keys are not shown. Plain text only, no official badges. |
| **SpecSheet** | Rim card. A `dl` of Status, Type, Platforms and Release (if set), then store buttons, then a privacy link if the product has one. Sticky in the sidebar at ≥64rem. |
| **FeatureList** | `ol` with mono key-coloured indices (01, 02…) and hairline separators. |
| **Gallery** | `auto-fill, minmax(16rem, 1fr)` grid of 16:9 thumbnails. Each links to the full image and has a `01 / 03` caption. The border turns key colour on hover. |
| **Trailer** | A poster (hero image, 60% opacity) with a key-filled "Play the … trailer" pill. It is a real link to youtube.com, so it works without JS. With JS a click swaps in a `youtube-nocookie.com` iframe with autoplay. No request goes to YouTube before the click. The note under it says so. |
| **SystemRequirements** | Table: row headers in mono, Minimum and Recommended columns, horizontal scroll on narrow screens. |
| **PageHeader** | Light-field header with an optional label, h1 and lede. |
| **Buttons** (`.button`, `.button--primary`) | 44px minimum height, radius m. Primary = key fill. Secondary = raised fill with a strong line border. Hover adds a key glow. |
| **Links** | Key colour with a 45%-alpha underline that turns solid on hover. |
