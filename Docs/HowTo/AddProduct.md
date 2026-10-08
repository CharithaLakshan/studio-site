# Add a Product

Field details are in Docs/Architecture/ContentModel.md.

## Steps

1. **Pick the slug.** Lowercase kebab-case, short, e.g. `night-signal`. It is **permanent** once published, because store listings will link to `/products/<slug>/`.
2. **Add the images.** Create `src/assets/products/<slug>/` and put the hero (21:9, ideally 2100×900, PNG/JPG/WebP) and the screenshots (16:9) in it. Astro optimises them at build time. If there are no images yet, copy the placeholder SVGs from `src/assets/products/sample-product/`.
3. **Create the entry.** Copy `src/content/products/sample-product.md` to `src/content/products/<slug>.md`, or use the template below.
4. **Fill in the frontmatter.** Use only facts. Anything unknown is left out, or marked with a YAML comment `# TODO(charitha): …`.
5. **Write the body.** Two to four short paragraphs of Markdown: what it is, who it is for, what makes it different. Do not write the studio name; it comes from the config.
6. **Store links.** Add a key with `''` for each planned store ("Coming soon"). Replace it with the URL once the store page is live. Omit stores you won't use.
7. **Privacy policy (if needed).** Google Play and Meta require one. Create `src/content/product-privacy/<slug>.md` with `lastUpdated:` and the policy text, then set `hasPrivacyPolicy: true`. Give the stores the URL `…/products/<slug>/privacy/`.
8. **Preview it.** Keep `draft: true` while working. To see the page, set `draft: false` locally and run `npm run dev`.
9. **Check.** Run `npm run check && npm run build`. Both must pass with no warnings.
10. **Publish.** Set `draft: false`. Commit (`feat: add <title> product page`) and push to `main`. The deploy workflow publishes it.

## Frontmatter template

```yaml
---
title: Product Name
slug: product-name # PERMANENT once published
type: game # game | app | tool | experience
tagline: One line, under 90 characters.
summary: One or two sentences, under 200 characters.
status: in-development # concept | in-development | early-access | released
platforms: # Windows PC VR | Meta Quest | Android | Windows | Web
  - Windows
features:
  - Key feature, one sentence.
featured: false
draft: true
# releaseDate: 2027-01-31        # only when public
heroImage:
  src: ../../assets/products/product-name/hero.png
  alt: Describe what the image shows.
screenshots:
  - src: ../../assets/products/product-name/shot-1.png
    alt: Describe what the screenshot shows.
# trailerYouTubeId: dQw4w9WgXcQ   # 11-character ID only
storeLinks: # URL = live, '' = Coming soon, omit = hidden
  steam: ''
# systemRequirements:
#   minimum:
#     OS: Windows 10 64-bit
#   recommended:
#     OS: Windows 11 64-bit
hasPrivacyPolicy: false
order: 10 # lower comes first
---

Long description here.
```

## Changing a published product

- Everything except `slug` can change at any time.
- To retire a product, keep the page and set `status`, or ask first before removing it. Removing it breaks store links.
- New platform values go into `PLATFORMS` in `src/content.config.ts` first.
