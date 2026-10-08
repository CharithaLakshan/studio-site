# Deploy

The site deploys to GitHub Pages through `.github/workflows/deploy.yml` on every push to `main`. It can also be run by hand (Actions → Deploy to GitHub Pages → Run workflow).

## One-time setup (manual)

1. Merge the Stage 2 pull request into `main`.
2. On GitHub, open the repository, then **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Open the **Actions** tab. If the run triggered by the merge failed because Pages was not enabled yet, open it and click **Re-run all jobs**.
5. The site is live at https://charithalakshan.github.io/studio-site/.

## What the workflow does

1. `actions/checkout@v7`
2. `withastro/action@v6` with Node 24 and npm: `npm ci`, `npm run check && npm run build`, upload `dist/` as the Pages artifact.
3. `actions/deploy-pages@v5` publishes it to the `github-pages` environment.

A failing check or build stops the deploy, so the live site stays on the last good version.

## Custom domain (later)

1. In `src/config/site.ts` set `url: 'https://yourdomain.com'` and `base: '/'`.
2. Add a `public/CNAME` file containing `yourdomain.com`.
3. In **Settings → Pages → Custom domain**, enter the domain and save. Add the DNS records GitHub shows (an apex `A`/`AAAA` record or a `www` `CNAME`). Enable **Enforce HTTPS** once the certificate is issued.
4. Push. Every canonical URL, sitemap, robots and social URL updates from the config.

**Warning:** store listings link to product URLs. GitHub normally redirects the old `github.io/studio-site/...` URLs to the custom domain. After switching, open an old product URL and confirm it lands on the right page. If it doesn't, update the store listings.

## Notes

- `robots.txt` only takes effect at a domain root. Under `github.io/studio-site/` crawlers ignore it, but the sitemap is still found through the `<link rel="sitemap">` tag and can be submitted in Search Console.
