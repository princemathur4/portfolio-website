# Prince Mathur — Portfolio

A single-page, scrollable portfolio built with React + Vite. Content lives in
plain data files so it's easy to edit without touching component code, and
easy to swap for a real backend later.

## Live website 
https://prince-mathur.vercel.app/


## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To build for deployment (Vercel, Netlify, GitHub Pages, etc.):

```bash
npm run build
```

This outputs a static site to `dist/`, which you can deploy anywhere that
serves static files.

## Project structure

```
src/
  data/            Raw content: profile, skills, experience, projects, education
  services/        contentService.js is the ONLY thing components should
                    import data through. searchService.js is a documented
                    stub for the future search/ask feature (see below).
  context/          FilterContext.jsx — tracks active skill filters and the
                    search query, shared by the skills bar, the floating
                    filter bar, the search box, and the Experience/Projects
                    sections that actually do the filtering.
  config/          cursorEffect.js — the one-line switch for which
                    pointer-interactive dot-grid effect is active.
  hooks/            Small reusable hooks (scrollspy, scroll-reveal,
                    light/dark theme, etc.)
  utils/            Small pure helpers (smooth-scroll-to-id, cursor-effect
                    physics, etc.)
  components/
    layout/         Navbar, Footer
    ui/             Small reusable pieces: Tag, SectionHeading, ExternalLink,
                    MediaPlaceholder, ThemeToggle, DotField
    sections/       One component per page section (Hero, About, SkillsBar,
                    Experience, Projects, Education, Contact) plus their
                    card subcomponents
```

### Page layout

Sections render in this order: **Hero → About → Skills → Experience →
Projects → Education → Contact**. Hero is deliberately the "who I am" section
— name, tagline, availability, and the "Get in touch"/"Download resume"
actions — rather than a skills list, so a visitor gets the human summary
before the filterable skill tags. The quick social links (LinkedIn, GitHub,
HackerRank) live in the persistent `Footer`, not Hero, so they stay reachable
no matter how far down the page you've scrolled. Skills moves right after
About/experience so the filtering UI shows up once there's already content on
the page for it to filter.

### Theming

The site ships with a dark theme (default) and a light theme, toggled from
the sun/moon button in the navbar (`ThemeToggle.jsx` + `hooks/useTheme.js`).
The choice is stored in `localStorage` and re-applied via a `data-theme`
attribute on `<html>`; a small inline script in `index.html` sets that
attribute before React hydrates, so there's no flash of the wrong theme on
load. If no preference is stored yet, it falls back to the OS-level
`prefers-color-scheme`. All theme colors are CSS custom properties defined in
`src/styles/tokens.css` — add new colors as tokens there (in both the
`:root` and `:root[data-theme="light"]` blocks) rather than hardcoding hex
values in component CSS, so they stay theme-aware.

### Persistent footer

`Footer.jsx` is `position: fixed` to the bottom of the viewport (mirrors
the sticky navbar at the top), so contact/social links stay reachable
from anywhere on the page. That means it's pulled out of normal document
flow, so a few things stay in sync via one shared `--footer-height` token
in `tokens.css` (bumped in a mobile media query, since the footer wraps
to two lines on narrow screens): `body`'s bottom padding (`base.css`)
reserves space so the last section doesn't render underneath it, and
`FloatingFilterBar`'s `bottom` offset (`components.css`) is calculated
from it so the two fixed elements never overlap.

### Interactive cursor effects

The dot-grid background behind the page can react to the mouse. Which
effect is active is a single line in `src/config/cursorEffect.js`:

```js
export const CURSOR_EFFECT = "attract"; // "none" | "repel" | "attract" | "blackhole" | "constellation" | "tubes"
```

- `"none"` renders the original static CSS dot grid, no canvas/JS.
- `"repel"` / `"attract"` / `"blackhole"` / `"constellation"` swap in
  `components/ui/DotField.jsx`, a `<canvas>` that redraws the grid every
  frame and nudges dots near the pointer according to that mode's physics
  in `src/utils/cursorEffects.js` — repel/attract push or pull dots along
  the pointer vector, `blackhole` pulls them in while rotating them around
  the pointer, and `constellation` lights up nearby dots and draws thin
  lines back to the pointer. Add a new mode by writing a
  `compute(dot, pointer, radius, time)` function there and registering it
  in `CURSOR_EFFECTS` — no other file needs to change. Automatically falls
  back to a single static draw (no animation loop) on touch devices and
  under `prefers-reduced-motion`.
- `"tubes"` swaps in `components/ui/TubesCursor.jsx` instead — flowing lit
  3D tubes trailing the pointer, via a WebGL/Three.js effect loaded from a
  CDN at runtime rather than bundled, so it's noticeably heavier than the
  canvas modes above. It's **CC BY-NC-SA 4.0 licensed** (attribution
  required, non-commercial use only) — read the license comment at the
  top of that file before enabling it if this site ever becomes
  commercial.

### Why content lives in `src/data/`, accessed only through `contentService.js`

Every section reads content via functions like `getExperience()` or
`getProjects()` in `src/services/contentService.js`, rather than importing
`src/data/experience.js` directly. Today those functions just return the
local data. When a real backend exists, this is the only file that needs to
change, swap the function bodies for `fetch()` calls, and every component
keeps working unchanged.

### How the skill filtering and search work

- Hovering a skill tag shows a small card previewing every role/project
  that uses it (built from `contentService.getReferencesForSkill`), listed
  chronologically — most recent experience first, then projects — with no
  other resorting.
- Clicking a skill toggles it on as an active filter. Multiple skills can
  be active at once; a job or project stays visible if it matches *any*
  active skill (OR, not AND), since with only a handful of entries an AND
  filter would empty out fast.
- Active filters show up in a floating bar pinned to the bottom of the
  viewport (`FloatingFilterBar.jsx`) so they're visible no matter how far
  down the page you've scrolled. Each chip removes just that filter;
  "Clear all" resets everything, including the search box.
- The search icon in the navbar filters Experience/Projects by keyword
  across every text field (role, company, bullets, description, stack,
  etc.) and highlights the matching text inline with `<mark>`.
- Search and skill filters combine (AND), search narrows within whatever
  the skill filters already show.

### Adding a new skill, job, or project

- **Skills**: add the label to the right category in `src/data/skills.js`.
  It'll appear in the skills bar automatically.
- **Linking a skill to where it's used**: the skills bar doesn't use a
  separate mapping file. It matches a skill's label against the `stack`
  array on each entry in `experience.js` / `projects.js`. Add the skill
  label to a job or project's `stack` array and the skills bar will link to
  it, no other file to update.
- **New job or project**: add an object to `experience.js` or
  `projects.js` following the existing shape. Give it a unique `id`, it's
  used to build the anchor the skills bar scrolls to (`exp-<id>` /
  `proj-<id>`).

## TODO

A few things were left as placeholders since they weren't available yet in some cases:

- **Project media**: `src/data/projects.js` has `imagePath` / `videoUrl` /
  `liveUrl` set to `null` for some projects. Add screenshots to
  `public/images/` and point to them there, or leave as-is (a clean
  placeholder renders automatically).
- **Experience "built project" screenshots**: same idea, in
  `src/data/experience.js` → each job's `builtProject.screenshotPath`.

## Future scope this was built to support

Two things are planned but not built yet:

1. **Search / ask, backed by Postgres ts-vector or a RAG pipeline.**
   `src/services/searchService.js` documents the exact function
   signatures (`searchContent(query)`, `askQuestion(question)`) and
   response shape a backend should return. No UI calls it yet; wire up a
   search box or ask box to those functions once the backend exists, and
   set `VITE_API_BASE_URL` in a `.env` file.

2. **Admin panel with versioned content edits.** Because every section
   already reads through `contentService.js` instead of static imports,
   swapping the local `data/*.js` files for API responses (e.g.
   `GET /api/experience` returning the same shape as `experience.js`)
   should not require touching any component. If the admin panel stores
   versioned snapshots, `contentService.js` is also the natural place to
   add a `?version=` param or similar.
