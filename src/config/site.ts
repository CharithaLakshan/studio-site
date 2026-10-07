/**
 * The ONLY place brand and identity values live.
 * Renaming the studio = edit this file. See Docs/HowTo/RenameBrand.md.
 * Nothing else in src/ may contain the studio name, owner name, email or social URLs.
 */

export const site = {
  /** Studio name, rendered as the text wordmark. */
  name: '[LKY]',
  /** Short line used in the home hero, default meta description and the footer. */
  // TODO(charitha): confirm or replace the tagline.
  tagline: 'Real-time graphics and immersive experiences.',
  /** One or two sentences about the studio. Used on Home and About. */
  intro:
    'A one-person studio from Sri Lanka making games, VR apps, tools and real-time experiences, with a focus on rendering, light and immersion.',

  owner: {
    name: 'M. Charitha Lakshan',
    alias: 'Lucky',
    role: 'Immersive Experience Engineer',
    location: 'Sri Lanka',
  },

  /** Public contact email. Leave empty to hide every email link. */
  // TODO(charitha): add the public contact email for the studio.
  email: '',

  /** Social links. Empty string hides the link. */
  socials: {
    youtube: 'https://www.youtube.com/@mrtheplaylist.1437',
    github: 'https://github.com/CharithaLakshan',
  },

  /** Deployment. Custom domain later: set url to 'https://example.com' and base to '/'. */
  url: 'https://charithalakshan.github.io',
  base: '/studio-site',

  /** Default social share image, path inside public/. 1200x630 PNG. */
  defaultSocialImage: 'og-default.png',
  defaultSocialImageAlt: 'Abstract warm light falling across a dark curved surface.',

  /** Language and locale for <html lang> and Open Graph. */
  lang: 'en',
  locale: 'en_GB',
} as const;

export type Site = typeof site;
