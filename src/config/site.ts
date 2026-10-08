/**
 * The ONLY place brand and identity values live.
 * Renaming the studio = edit this file. See Docs/HowTo/RenameBrand.md.
 * Nothing else in src/ may contain the studio name, owner name, email or social URLs.
 */

const name = '[LKY]';

export const site = {
  /** Studio name, rendered as the text wordmark. */
  name,
  /** Home hero headline (h1). First person, short. */
  headline: 'I make things to play, watch and use.',
  /** One line under the headline. Also the default meta description, home title and footer line. */
  tagline: 'Games, VR apps and tools, made by one person in Sri Lanka.',

  owner: {
    name: 'M. Charitha Lakshan',
    alias: 'Lucky',
    location: 'Sri Lanka',
  },

  /** Public contact email. Leave empty to hide every email link. */
  // TODO(charitha): add the public contact email for the studio.
  email: '',

  /** Personal portfolio (background, projects, research). Leave empty to hide every portfolio link. */
  // TODO(charitha): paste the portfolio URL, e.g. 'https://example.com'.
  portfolioUrl: '',

  /** Social links. Empty string hides the link. */
  socials: {
    youtube: 'https://www.youtube.com/@mrtheplaylist.1437',
    github: 'https://github.com/CharithaLakshan',
  },

  /** Deployment. Custom domain later: set url to 'https://example.com' and base to '/'. */
  url: 'https://charithalakshan.github.io',
  base: '/studio-site',

  /** Default social image, path inside public/. 1200x630 JPEG, no text. */
  defaultSocialImage: 'og-default.jpg',
  defaultSocialImageAlt:
    'A path-traced render of a cobalt sphere, a glass sphere, a chrome sphere and a small black sphere in a white studio.',

  /** Language and locale for <html lang> and Open Graph. */
  lang: 'en',
  locale: 'en_GB',
} as const;

export type Site = typeof site;
