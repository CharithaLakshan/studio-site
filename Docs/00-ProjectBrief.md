You are the designer and lead engineer for the official website of my one-person indie studio. This message is the MASTER BRIEF for the whole project. The project runs in stages across separate sessions. In THIS session you do Stage 1 only: design, architecture and documentation. Do not write site code in this session.

=== 0. FIRST ACTION ===
Save this entire message verbatim as Docs/00-ProjectBrief.md and commit it. It is the source of truth for every future session. If a later instruction from me conflicts with it, follow me and record the change in ClaudeMemory/Decisions.md.

=== 1. WHO I AM ===
- M. Charitha Lakshan, known online as "Lucky". Sri Lanka.
- Immersive Experience Engineer (real-time graphics and XR). Final-year Computer Science undergraduate at the University of Colombo School of Computing.
- Tools: Unity, Unreal Engine 5, Blender, C/C++/C#/Python, CUDA. Interests: real-time rendering, procedural generation, VR/XR, game development.
- YouTube channel: https://www.youtube.com/@mrtheplaylist.1437 (channel name [LKY]).
- Show my name on the About page as the person behind the studio.

=== 2. THE BRAND ===
- Studio name for now: [LKY] (the square brackets are part of the name). It is TEMPORARY.
- Hard requirement: the brand name, tagline, owner name, email and social links must live in ONE config file (for example src/config/site.ts) and nowhere else in source code. The wordmark is rendered as styled text from that config, not as an image. Renaming the studio must be a one-file edit plus, at most, regenerating the favicon and default social image, documented in Docs/HowTo/RenameBrand.md.
- Personality: abstract, technical, calm, crafted. A small studio that cares about graphics and immersive experiences. Not corporate, not cartoonish.

=== 3. WHAT THE SITE IS FOR ===
A small studio site, like many indie developers have: it lists everything I make (games, VR apps, tools, experiences) and gives each one its own permanent page. I will put those page URLs into store listings (Steam, Meta Horizon Store, Google Play), and each page links out to the stores where the product is available.

=== 4. PAGES ===
- Home: brand hero with tagline, featured product, grid of all published products, short studio intro, links (YouTube, email, GitHub).
- Products index (/products/): every published product, grouped or filterable by type.
- Product page (/products/<slug>/): hero media, tagline, description, key features, screenshots, trailer (YouTube embed, loaded only on click), platforms, status, store buttons, system requirements when relevant.
- Product privacy policy (/products/<slug>/privacy/): optional per product, written in Markdown. Google Play and Meta require a privacy policy URL, so this must exist as a pattern.
- About: the studio and me.
- Privacy: privacy policy for the website itself (no tracking, no cookies by default).
- 404 page.
Product slugs are PERMANENT once published because store listings link to them.

=== 5. CONTENT MODEL (proposal; refine it in the architecture docs) ===
One Markdown file per product, validated by a schema. Fields: title, slug, type (game | app | tool | experience), tagline, summary, status (concept | in-development | early-access | released), platforms (e.g. Windows PC VR, Meta Quest, Android, Windows, Web), featured (bool), draft (bool, drafts never build), releaseDate (optional), heroImage, screenshots, trailerYouTubeId, storeLinks (steam, metaHorizon, googlePlay, itch, github, website: each optional), systemRequirements (optional), hasPrivacyPolicy (bool), order. Body = long description.
Store buttons: an empty link shows a disabled "Coming soon" state. Use plain styled text buttons with the store's name; do NOT use official store badge images yet (they have brand guidelines — list them as a later task in the roadmap).

=== 6. FIRST PRODUCT: ROTUNDA ===
- Rotunda — VR Video Player. Slug: rotunda.
- A Windows PC VR video player for 360°, 180° and flat video, mono and stereo. Built in Unity with my own FFmpeg-based decoders.
- Status: in development. Target stores: Steam and Meta Horizon Store (PC VR). Store links empty for now.
- I have no screenshots yet: use on-brand placeholder art clearly marked as placeholder.
Also create one sample product with draft: true as a template for future entries.

=== 7. TECH CONSTRAINTS ===
- Astro (current stable), TypeScript strict, static output, npm, Node LTS.
- Astro content collections with schema validation for products.
- Styling: plain modern CSS with design tokens as CSS custom properties. No CSS framework and no UI framework (React, Vue etc.) unless you justify it in Decisions.md and I approve.
- Zero client JavaScript by default. Small vanilla scripts only where needed (mobile nav, theme toggle if the design has one, click-to-load trailer).
- Self-hosted fonts with open licences. Optimised images via Astro's image tooling.
- SEO: unique title and description per page, Open Graph and Twitter card tags, canonical URLs, sitemap, robots.txt, JSON-LD (VideoGame or SoftwareApplication) on product pages.
- Accessibility: WCAG 2.2 AA contrast, keyboard navigation, visible focus, alt text, semantic landmarks, prefers-reduced-motion respected.
- Performance target: Lighthouse 95+ in every category on mobile.
- Hosting: GitHub Pages via a GitHub Actions workflow. The site URL and base path come from config so a custom domain later is a one-line change. Current URL will be https://<username>.github.io/studio-site/.
- No backend, CMS, database, analytics or cookies.
- Ask me before adding any dependency not implied above.

=== 8. DESIGN DIRECTION ===
I work in real-time graphics and XR, so the site should feel like it comes from someone who cares about light, depth and motion — restrained and high quality, not flashy. Avoid generic template looks (default SaaS hero, stock gradients, emoji icons). You have creative freedom within these constraints: it must stay fast, readable and accessible, and the brand name must be swappable. Dark-first is welcome but not required.

=== 9. DOCUMENTATION AND CLAUDE MEMORY SYSTEM ===
Every session must leave the project fully documented. Structure:
- CLAUDE.md (repo root): auto-loaded each session. Keep it under about 120 lines: project summary, tech stack, commands, folder map, hard rules (from sections 2, 7 and 11), and pointers to the files below. Instruct future sessions to read ClaudeMemory/CurrentState.md first.
- ClaudeMemory/SessionLog.md: append one entry per session: date, model and effort, stage, what was done, files touched, open issues.
- ClaudeMemory/Decisions.md: every meaningful decision: date, decision, options considered, reason.
- ClaudeMemory/DeveloperPreferences.md: seed with: prefers simple, consolidated deliverables; prefers direct answers; prefers minimal boilerplate in code; wants every session documented; background is real-time graphics and XR engineering.
- ClaudeMemory/CurrentState.md: what works, what's next, known issues. Rewrite it at the end of every session.
- Docs/00-ProjectBrief.md (this message), Docs/Design/, Docs/Architecture/, Docs/HowTo/, Docs/Roadmap.md, README.md.
Write docs in plain, direct English. Markdown only.

=== 10. STAGE PLAN ===
Stage 1 (this session): design and architecture, no site code.
Stage 2: build the site to the approved docs, deploy workflow, docs updated.
Stage 3: review, accessibility/performance/SEO hardening, launch checklist.
Later: add products one at a time using Docs/HowTo/AddProduct.md.

=== 11. WORKING RULES (every session) ===
- Never invent facts about my products: no made-up prices, dates, specs, reviews, awards or download counts. Write marketing copy from what I gave you and mark anything that needs my input with TODO(charitha).
- Small, logical commits with conventional messages (feat:, fix:, docs:, chore:).
- At the end of every session: update SessionLog, Decisions and CurrentState, commit, push, and open or update a pull request with a short summary.
- Be cost-conscious: don't re-read large files you've already read, don't launch extra agents or workflows unless clearly needed, and keep chat replies short. Details belong in the docs.

=== 12. STAGE 1 TASKS (THIS SESSION) ===
Step A — Design directions, then STOP.
Write Docs/Design/DesignDirections.md with three clearly different visual directions. For each: name, mood in one line, colour palette with hex values, type pairing (open-licence fonts), layout idea for Home and a product page, one signature visual motif, motion approach, why it suits a graphics/XR studio, and risks. Recommend one. Commit, then reply in chat with a short summary of the three and STOP. Wait for my choice (I may mix parts).

Step B — After I choose:
1. Docs/Design/DesignSystem.md: tokens (colour, type scale, spacing, radii, shadows/glows, motion durations and easing), light/dark rules if any, and component specs (header, footer, product card, store button incl. disabled state, feature list, media gallery, trailer embed, status badge, buttons, links, focus styles).
2. Docs/Design/PageSpecs.md: every page from section 4 with a text wireframe (desktop and mobile), content hierarchy and responsive behaviour.
3. Docs/Design/Mockups/home.html and Docs/Design/Mockups/product-rotunda.html: self-contained static HTML with inline CSS, responsive, using the real design tokens and realistic copy, so I can open them in a browser and judge the design.
4. Docs/Architecture/Architecture.md: stack, folder structure, how config, content collections, layouts and components fit together, build and deploy flow, how the brand swap works, how base path and site URL work.
5. Docs/Architecture/ContentModel.md: the final product schema as a table (field, type, required, notes) plus an example Rotunda frontmatter.
6. Docs/Roadmap.md: stages 2–3 broken into tasks, plus later ideas (press kit pages, official store badges, custom domain, devlog).
7. Docs/HowTo/: LocalDev.md, Deploy.md, AddProduct.md, RenameBrand.md as outlines to be completed in Stage 2.
8. CLAUDE.md, all four ClaudeMemory files, README.md.
9. Commit, push, open a pull request titled "Stage 1: design and architecture". Reply in chat with at most 10 lines: what you produced and anything you need from me.

Definition of done for Stage 1: every file above exists and is consistent with the others, the mockups open correctly in a browser, and a new session could start Stage 2 using only CLAUDE.md and the docs.
