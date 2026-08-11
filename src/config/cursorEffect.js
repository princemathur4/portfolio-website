/**
 * Which pointer-interactive background effect the dot grid uses by
 * default, before a visitor picks something else from the footer's cursor-
 * effect easter egg (the 🌌 after "built by ... · {year}" — see
 * components/ui/CursorEffectToggle.jsx + hooks/useCursorEffect.js). Once a
 * visitor picks an option, their choice is remembered in localStorage and
 * wins over this constant on their next visit, same as the theme.
 *
 * Valid values (see src/utils/cursorEffects.js for what each one actually
 * does to the dots):
 *
 *   "none"          - plain static dot grid, no JS/canvas involved at all
 *   "repel"         - dots push away from the pointer (magnet repel)
 *   "attract"       - dots pull toward the pointer (magnet attract)
 *   "blackhole"     - dots swirl inward around the pointer, then ease back
 *                     (dark theme); on light theme this becomes a "white
 *                     hole" instead — see the isWhiteHole handling in
 *                     DotField.jsx — since a literal black glow reads as a
 *                     smudge on a light background.
 *   "constellation" - nearby dots light up and draw thin lines back to
 *                     the pointer, like a small network/graph
 *   "tubes"         - flowing lit 3D tubes trailing the pointer (WebGL,
 *                     via components/ui/TubesCursor.jsx). Loads Three.js
 *                     from a CDN at runtime, so it's noticeably heavier
 *                     than the others, and is CC BY-NC-SA 4.0 licensed
 *                     (attribution required, non-commercial only) — see
 *                     the comment at the top of that file. It's still
 *                     included in CURSOR_EFFECT_OPTIONS below (a visitor
 *                     can pick it from the easter egg), but keep that
 *                     license/attribution requirement in mind since it's
 *                     now a one-click-reachable, shippable choice, not
 *                     just a manual config edit.
 */
export const CURSOR_EFFECT = "blackhole";

/**
 * The effects a visitor can actually pick from the cursor-effect easter
 * egg. Add a new dot-grid mode here (after registering it in
 * CURSOR_EFFECTS, utils/cursorEffects.js) to make it choosable; no other
 * file needs to change.
 */
export const CURSOR_EFFECT_OPTIONS = [
  { value: "none", label: "Off" },
  { value: "repel", label: "Repel" },
  { value: "attract", label: "Attract" },
  { value: "blackhole", label: "Black hole" },
  { value: "constellation", label: "Constellation" },
  { value: "tubes", label: "Tubes" },
];

/**
 * Radius (px) of the soft ambient vignette that follows the pointer
 * everywhere on the page (.page-glow in styles/effects.css) — separate
 * from CURSOR_EFFECT above, this one's always on regardless of which dot
 * effect is active. Smaller = a tighter pool of light/dark right around
 * the cursor instead of a wash covering most of the viewport.
 */
export const PAGE_GLOW_RADIUS = 350;
