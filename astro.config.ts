import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './src/config/site';

export default defineConfig({
  site: site.url,
  base: site.base,
  trailingSlash: 'always',
  output: 'static',
  integrations: [sitemap()],
});
