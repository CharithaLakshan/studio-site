---
# TEMPLATE ENTRY. draft: true means this file is validated but never built.
# Copy it to <your-slug>.md, then follow Docs/HowTo/AddProduct.md.
title: Sample Product
slug: sample-product # PERMANENT once published
type: game # game | app | tool | experience
tagline: One line, under 90 characters, that says what it is.
summary: One or two sentences, under 200 characters. Used on cards, meta description and social previews.
status: released # concept | in-development | early-access | released
platforms: # Windows PC VR | Meta Quest | Android | Windows | Web
  - Android
  - Windows
pricingModel: paid # free | paid | free-with-in-app-purchases | tba
price: '$4.99' # shown as written; omit for "Price TBA" (free models fall back to "Free")
features:
  - First key feature, one sentence.
  - Second key feature, one sentence.
featured: false
draft: true
releaseDate: 2030-01-01 # optional, YYYY-MM-DD; only set when the date is public
heroImage:
  src: ../../assets/products/sample-product/placeholder-hero.svg
  alt: Placeholder art for the sample product. Describe the real image here.
screenshots:
  - src: ../../assets/products/sample-product/placeholder-shot.svg
    alt: Placeholder art for a screenshot. Describe what the screenshot shows.
trailerYouTubeId: aqz-KE-bpKQ # optional, 11-character ID only (this one is the Big Buck Bunny test video)
storeLinks: # live store pages: a URL shows a live button
  googlePlay: https://play.google.com/store/apps/details?id=com.example.sample
  itch: https://example.itch.io/sample-product
plannedStores: # stores without a page yet: shown as "Coming soon"
  - steam
primaryStore: googlePlay # optional: the live store that gets the big first button
systemRequirements: # optional; rows are free-form label: value
  minimum:
    OS: Windows 10 64-bit
    Processor: Example CPU
    Memory: 8 GB RAM
  recommended:
    OS: Windows 11 64-bit
    Processor: Example CPU
    Memory: 16 GB RAM
hasPrivacyPolicy: true # needs src/content/product-privacy/sample-product.md
order: 100 # lower comes first
---

Long description in Markdown, in first person. Write two to four short paragraphs: what it is, who it is for, what makes it different.

Use `##` subheadings only if the description is long.
