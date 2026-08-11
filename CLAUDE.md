# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install      # install dependencies
npm run dev       # start Vite dev server (default http://localhost:5173)
npm run build     # production build to dist/
npm run preview   # serve the dist/ build locally
```

There is no test suite, linter, or type checker configured in this repo — don't invent commands for them.

## Architecture

Single-page React (Vite, no router) portfolio site. Every section of the page is one scrollable document; navigation just scrolls to an `id` (`utils/scrollTo.js`), it doesn't route.

### Content flows one way: `data/` → `services/contentService.js` → components

All site copy (profile, skills, experience, projects, education) lives as plain serializable objects in `src/data/*.js`. Components never import those files directly — they call functions like `getExperience()` / `getProjects()` / `getProfile()` in `src/services/contentService.js`, which today just return the local data synchronously (wrapped in `Promise.resolve`-style async functions on purpose). This is the seam meant to become real `fetch()` calls once a backend/admin panel exists, so when editing content-fetching logic, change `contentService.js`, not the data files' shape or the component call sites.

When adding a new skill/job/project, follow the existing object shape in the relevant `data/*.js` file — see the comments at the top of `experience.js`, `projects.js`, and `skills.js` for the exact fields expected (`bullets`/`highlights` are `{ text, skills }` pairs, not plain strings).

### Skills are cross-referenced by matching `stack`, not a mapping file

`src/data/skills.js` is just a flat categorized list of skill labels. There is no separate file mapping a skill to where it's used — `contentService.getReferencesForSkill(label)` derives that at runtime by scanning every experience/project's `stack` array (and each bullet/highlight's own `skills` array) for a case-insensitive match. So: to make a skill tag link to a job or project, add the label to that entry's `stack` array in `experience.js` / `projects.js` — nothing else needs updating.

### Filter/search state lives in `FilterContext`, consumed by four different UI pieces

`src/context/FilterContext.jsx` holds `activeSkills`, `searchQuery`, and `highlightedAnchorIds`, shared via `useFilters()`. It's read/written by:
- `Tag.jsx` (skills bar) — toggles a skill into `activeSkills` on click, shows a hover-card preview via `getReferencesForSkill`
- `FloatingFilterBar.jsx` — a fixed bottom bar showing active filter chips whenever `hasActiveFilters` is true, for visibility no matter how far down the page you've scrolled
- `SearchBar.jsx` (navbar) — writes `searchQuery`
- `Experience.jsx` / `Projects.jsx` — filter their entries via `entryMatchesSkillFilters` + `entryMatchesSearch` (both in `contentService.js`); `ExperienceCard.jsx` / `ProjectCard.jsx` further narrow individual bullets via `filterPointsBySkills` and highlight matching text inline via `utils/highlightMatches.jsx`

Multiple active skills are OR'd (any match keeps an entry visible), and search + skill filters combine with AND. When `toggleSkill` activates a skill, it also flashes a highlight and auto-scrolls to the first matching card (see `flashHighlight`/`HIGHLIGHT_DURATION_MS` in `FilterContext.jsx`).

`getReferencesForSkill` (the hover-card preview list) orders results chronologically — experience first (most recent role first, since `data/experience.js` is already authored that way), then projects — by relying on `.filter()` preserving each source array's original order. There's no secondary "relevance" sort; if an entry needs to jump the queue, reorder it in the data file rather than adding sorting logic back here.

Each skill gets a deterministic color from `utils/skillColor.js` (hash of the label → fixed palette), reused consistently for that skill's active chip, checkmark, and inline text highlight.

### Page structure and section order

`App.jsx` renders sections in a fixed order: `Navbar → Hero → About → SkillsBar → Experience → Projects → Education → Contact → Footer`, plus a `FilterProvider` wrapping everything and a fixed `FloatingFilterBar`. Hero is the "who I am" section (summary, quick links, contact, resume) — skills/filtering intentionally comes after About, not before it. `Navbar`'s `NAV_LINKS` array and `useActiveSection` (IntersectionObserver-based scrollspy) should stay in sync with the actual section `id`s if sections are reordered or renamed.

`useActiveSection`'s IntersectionObserver uses a shrunk `rootMargin` band to decide the "active" section, which can never fire for the last section once the page hits its true max scroll (there's no more content to scroll into that band, and the fixed footer covers part of the viewport besides). It's backed by an explicit `window.scrollY`-based "am I at the bottom" check that forces `sectionIds[sectionIds.length - 1]` active in that case — so `NAV_LINKS`'s last entry is implicitly "whatever should be active at the bottom of the page," not just cosmetically last in the list.

### Persistent footer

`Footer.jsx` is `position: fixed` to the bottom of the viewport (mirrors the sticky navbar), pulling it out of normal document flow. Three files stay in sync via one `--footer-height` token in `tokens.css` (bumped in a mobile media query, since the footer wraps to two lines on narrow screens): `body`'s bottom padding in `base.css` reserves space so the last section doesn't render underneath it, and `.floating-filter-bar`'s `bottom` offset in `components.css` is calculated from it so the two fixed elements never overlap. Change `--footer-height` first if the footer's content/height changes, rather than hand-tuning the other two.

### Interactive dot-grid background

The dotted background behind the whole page can render two ways, switched by a single constant, `CURSOR_EFFECT` in `src/config/cursorEffect.js`:
- `"none"` — the original static CSS `.dot-grid` (radial-gradient background-image, zero JS).
- `"repel"` / `"attract"` / `"blackhole"` / `"constellation"` — `App.jsx` mounts `components/ui/DotField.jsx`, a `<canvas>` that draws the same dot grid but nudges dots near the pointer each animation frame according to that mode's physics function in `utils/cursorEffects.js`. Each frame, a dot's rendered position/scale/alpha is eased toward a "target" computed fresh from the current pointer distance — there's no persisted per-dot velocity, which keeps the whole thing simple despite the spring-like motion. Add a new dot-grid effect by writing a `compute(dot, pointer, radius, time)` function there and registering it in `CURSOR_EFFECTS`; no other file needs to change. Falls back to a single static draw (no animation loop) only under `prefers-reduced-motion` — touch devices get the same interactive easing as mouse input (`pointerdown` stands in for hover, `pointerup`/`pointercancel` for the pointer leaving), with a brief linger (`TOUCH_LINGER_MS`) after a tap before dots ease back to rest, since resetting the instant a quick tap ends gave the eased animation no time to actually be seen.
- `"tubes"` — an entirely different rendering path: `App.jsx` mounts `components/ui/TubesCursor.jsx` instead of `DotField`, which dynamically `import()`s a WebGL/Three.js cursor effect from a CDN at runtime (not bundled) rather than drawing the 2D dot grid at all. It's noticeably heavier and is CC BY-NC-SA 4.0 licensed (attribution required, non-commercial use only) — see the license comment at the top of that file before enabling it anywhere commercial.

### Theming

`src/styles/tokens.css` defines CSS custom properties for both dark (default, on `:root`) and light (`:root[data-theme="light"]`) themes — colors, effect/glow colors, fonts, spacing. `useTheme.js` toggles the `data-theme` attribute on `<html>` and persists the choice to `localStorage` (`ThemeToggle.jsx` in the navbar calls it); an inline script in `index.html` stamps the attribute before React mounts to avoid a flash of the wrong theme. When adding new colors, prefer adding a token in both blocks of `tokens.css` over hardcoding a hex/rgba value in component CSS, so it stays theme-aware.

CSS is split by concern and all imported in `main.jsx` in this order: `tokens.css` (variables) → `base.css` (resets/global) → `layout.css` (navbar/footer) → `components.css` (buttons, cards, tags, pills — reusable pieces) → `sections.css` (per-section layout, one block per section) → `effects.css` (cursor-follow glow, card hover, scroll-reveal animations).

### Not yet wired up

`src/services/searchService.js` is a documented stub (not called by any component) for a future Postgres ts-vector or RAG-based search/ask backend — the function signatures and response shapes it expects are specified in its comments. Don't wire it into the UI unless asked; the current search box filters `Experience`/`Projects` client-side via `contentService.entryMatchesSearch` instead.
