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

Each skill gets a deterministic color from `utils/skillColor.js` (hash of the label → fixed palette), reused consistently for that skill's active chip, checkmark, and inline text highlight.

### Page structure and section order

`App.jsx` renders sections in a fixed order: `Navbar → Hero → About → SkillsBar → Experience → Projects → Education → Contact → Footer`, plus a `FilterProvider` wrapping everything and a fixed `FloatingFilterBar`. Hero is the "who I am" section (summary, quick links, contact, resume) — skills/filtering intentionally comes after About, not before it. `Navbar`'s `NAV_LINKS` array and `useActiveSection` (IntersectionObserver-based scrollspy) should stay in sync with the actual section `id`s if sections are reordered or renamed.

### Interactive dot-grid background

The dotted background behind the whole page can render two ways, switched by a single constant, `CURSOR_EFFECT` in `src/config/cursorEffect.js`:
- `"none"` — the original static CSS `.dot-grid` (radial-gradient background-image, zero JS).
- `"repel"` / `"attract"` / `"blackhole"` / `"constellation"` — `App.jsx` mounts `components/ui/DotField.jsx`, a `<canvas>` that draws the same dot grid but nudges dots near the pointer each animation frame according to that mode's physics function in `utils/cursorEffects.js`. Each frame, a dot's rendered position/scale/alpha is eased toward a "target" computed fresh from the current pointer distance — there's no persisted per-dot velocity, which keeps the whole thing simple despite the spring-like motion. Add a new dot-grid effect by writing a `compute(dot, pointer, radius, time)` function there and registering it in `CURSOR_EFFECTS`; no other file needs to change. Falls back to a single static draw (no animation loop) under `prefers-reduced-motion` or on touch devices, same convention as the rest of `effects.css`.
- `"tubes"` — an entirely different rendering path: `App.jsx` mounts `components/ui/TubesCursor.jsx` instead of `DotField`, which dynamically `import()`s a WebGL/Three.js cursor effect from a CDN at runtime (not bundled) rather than drawing the 2D dot grid at all. It's noticeably heavier and is CC BY-NC-SA 4.0 licensed (attribution required, non-commercial use only) — see the license comment at the top of that file before enabling it anywhere commercial.

### Theming

`src/styles/tokens.css` defines CSS custom properties for both dark (default, on `:root`) and light (`:root[data-theme="light"]`) themes — colors, effect/glow colors, fonts, spacing. `useTheme.js` toggles the `data-theme` attribute on `<html>` and persists the choice to `localStorage` (`ThemeToggle.jsx` in the navbar calls it); an inline script in `index.html` stamps the attribute before React mounts to avoid a flash of the wrong theme. When adding new colors, prefer adding a token in both blocks of `tokens.css` over hardcoding a hex/rgba value in component CSS, so it stays theme-aware.

CSS is split by concern and all imported in `main.jsx` in this order: `tokens.css` (variables) → `base.css` (resets/global) → `layout.css` (navbar/footer) → `components.css` (buttons, cards, tags, pills — reusable pieces) → `sections.css` (per-section layout, one block per section) → `effects.css` (cursor-follow glow, spotlight-card, scroll-reveal animations).

### Not yet wired up

`src/services/searchService.js` is a documented stub (not called by any component) for a future Postgres ts-vector or RAG-based search/ask backend — the function signatures and response shapes it expects are specified in its comments. Don't wire it into the UI unless asked; the current search box filters `Experience`/`Projects` client-side via `contentService.entryMatchesSearch` instead.
