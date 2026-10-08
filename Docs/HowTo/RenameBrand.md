# Rename the Studio

The studio name `[LKY]` is temporary. Renaming it is a one-file edit.

## Steps

1. Open `src/config/site.ts`.
2. Change `name`. Also update `tagline`, `intro`, `email`, `socials`, `defaultSocialImageAlt` and `owner` if they change.
3. Run `npm run check && npm run build`.
4. Check that the old name is gone (it should print nothing):
   ```sh
   grep -rn "OLD NAME" dist src public astro.config.ts
   ```
5. Commit (`chore: rename studio to <new name>`) and push.

## What updates automatically

The header and footer wordmark, every `<title>`, `og:site_name`, `og:title`, the Twitter tags, the JSON-LD author and publisher, the About page, the site and product privacy pages, the products index description and the home studio section.

The wordmark styling works for any name: letters and digits are bright, and punctuation (such as brackets) is drawn in the key colour.

## Images

- `public/favicon.svg`, `public/apple-touch-icon.png` and `public/og-default.png` contain **no text**, so they don't need regenerating.
- Only if you want a branded social card: replace `public/og-default.png` with a 1200×630 PNG, then update `defaultSocialImage` and `defaultSocialImageAlt` in `site.ts`.

## Where the old name may still appear

- `Docs/`, `ClaudeMemory/` and `README.md`: historical records. Update README and CLAUDE.md by hand; leave session logs as they are.
- Nowhere in `src/`, `public/` or `dist/`. If it does appear there, it is a bug: move that text into `site.ts`.

## Rules that keep this working

- Never type the studio name, owner name, email or social URLs anywhere except `src/config/site.ts`.
- Product Markdown must not mention the studio name.

## Verified

Stage 2 brand-swap test (2026-10-07): renamed to "Halcyon Works" and built. The old name appeared 0 times in `dist/`, `src/`, `public/` or `.github/`, and the new name appeared on all 6 pages. Then reverted.
