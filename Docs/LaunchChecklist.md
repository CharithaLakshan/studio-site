# Launch Checklist

For Charitha. Work top to bottom. Every item that needs your input is a `TODO(charitha)` in the code. To list them all:

```sh
grep -rn "TODO(charitha)" src
```

After any change: `npm run check` (0 errors, 0 warnings, 0 hints), then `npm run build`, then push. Merging to `main` deploys.

## 1. Brand and contact (`src/config/site.ts`)

- [ ] **Public contact email** (`email`). It is empty now, so every email link is hidden and the privacy pages point to GitHub instead. Meta and Google expect a contact address next to a privacy policy, so set it before submitting to a store.
- [ ] **Portfolio URL** (`portfolioUrl`). The header link, the footer link and the portfolio sentences stay hidden until it is set.
- [ ] **Tagline.** Option 1 is live; the other two are in `ClaudeMemory/Decisions.md`. Change it only in `site.ts`.
- [ ] **Studio name**, if "[LKY]" is renamed: follow `Docs/HowTo/RenameBrand.md`. Redraw the favicon if the new name has no brackets.

## 2. Rotunda facts (`src/content/products/rotunda.md`)

Use real facts only. Leave a field out until it is true.

- [ ] **Pricing:** `pricingModel` (`free` | `paid` | `free-with-in-app-purchases`) and `price` (e.g. `'$4.99'`). The page shows "Price TBA" until then. A known price also adds an `Offer` to the JSON-LD.
- [ ] **Release date:** `releaseDate: YYYY-MM-DD`, once it is public.
- [ ] **Trailer:** `trailerYouTubeId`, the 11-character video ID, not the URL. A Trailer section appears when it is set.
- [ ] **System requirements:** `systemRequirements.minimum` (and optionally `recommended`): OS, CPU, GPU, RAM, headset. A Hardware section appears when they are set.
- [ ] **Status:** move `status` on when it changes (`early-access`, `released`). The store button verbs follow it ("Wishlist on …" before release, "Buy on …" or "Get it on …" after).

## 3. Replace the placeholder art

- [ ] **Hero:** put the real image in `src/assets/products/rotunda/` (21:9, ideally 2100×900, at least 1200×630, PNG/JPG/WebP) and point `heroImage.src` at it. Rewrite `heroImage.alt` to describe what the image shows. A raster hero also becomes Rotunda's 1200×630 social image automatically.
- [ ] **Screenshots:** replace the three placeholder SVGs with real 16:9 screenshots. Give each an `alt` that describes it. Delete the placeholder SVGs once nothing points to them.
- [ ] Confirm that no page says "PLACEHOLDER" any more: `grep -rl PLACEHOLDER dist` after a build.

## 4. Store pages

- [ ] **Steam:** when the store page exists, add its URL under `storeLinks.steam`. The "Coming soon" button becomes a live button.
- [ ] **Meta Horizon Store:** the same, under `storeLinks.metaHorizon`.
- [ ] If both are live, set `primaryStore` to the one that should get the big first button. It defaults to Steam, the first in `STORE_KEYS` order.
- [ ] In each store listing, link back to **`https://charithalakshan.github.io/studio-site/products/rotunda/`** (or the custom-domain URL, see section 7). This slug is permanent.

## 5. Rotunda privacy policy (before store submission)

Meta requires a privacy policy URL, and Steam and Google ask for one too.

- [ ] Write `src/content/product-privacy/rotunda.md`, using `src/content/product-privacy/sample-product.md` as the shape:
  - set `lastUpdated`;
  - only true statements: what data Rotunda collects (if any), where video files are read from, any network access, crash reports, analytics or the platform SDKs (OpenXR, Steam, Meta), and how to contact you.
- [ ] Set `hasPrivacyPolicy: true` in `rotunda.md`. The build fails if the flag is true and the file is missing.
- [ ] Check that `/studio-site/products/rotunda/privacy/` loads, then paste that URL into the Meta and Steam forms.
- [ ] Review the **site** privacy page (`src/pages/privacy.astro`): read the text and set `lastUpdated` to the day you review it.

## 6. Go live and check the live URL

- [ ] Merge the open pull requests into `main`.
- [ ] GitHub → **Settings → Pages → Source: GitHub Actions** (one time). Then check that the Actions run is green.
- [ ] Open https://charithalakshan.github.io/studio-site/ and click through Home, Products, Rotunda, About and Privacy, plus a broken URL for the 404 page.
  - Every page should load with styles, fonts and images.
  - On the home page the render should go live on a computer with a GPU.
- [ ] **Hero on real hardware:** on a phone and on a laptop with integrated graphics, check that the render reaches 1024 spp, that scrolling stays smooth, and how long it takes. Tell Claude the numbers if it feels slow.
- [ ] **Previews and tests** (need the public URL):
  - [ ] PageSpeed Insights (mobile) on Home and Rotunda. Expect about 100 everywhere.
  - [ ] Google Rich Results Test on the Rotunda page. "Missing offers" is expected until the price is set.
  - [ ] A social preview check: paste the URL into a Discord or Slack message, or use the LinkedIn Post Inspector.
  - [ ] A quick screen-reader pass (NVDA on Windows or VoiceOver on a Mac or phone) of Home and Rotunda.
- [ ] **Google Search Console:** add the property and submit `https://charithalakshan.github.io/studio-site/sitemap-index.xml`.

## 7. Custom domain (later)

Follow `Docs/HowTo/Deploy.md` → "Custom domain". In short:

- [ ] Buy the domain. In `site.ts` set `url: 'https://yourdomain.com'` and `base: '/'`.
- [ ] Add `public/CNAME` containing the domain.
- [ ] GitHub → Settings → Pages → Custom domain. Add the DNS records it shows, then tick **Enforce HTTPS**.
- [ ] Open an old `github.io/studio-site/products/rotunda/` URL and check that it redirects to the new domain. If it doesn't, update the store listings.
- [ ] Re-submit the sitemap in Search Console for the new domain. `robots.txt` starts working at a domain root.
