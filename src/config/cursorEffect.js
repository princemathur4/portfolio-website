/**
 * Which pointer-interactive background effect the dot grid uses.
 *
 * Flip this string to switch effects site-wide, no other file needs to
 * change. Valid values (see src/utils/cursorEffects.js for what each one
 * actually does to the dots):
 *
 *   "none"          - plain static dot grid, no JS/canvas involved at all
 *   "repel"         - dots push away from the pointer (magnet repel)
 *   "attract"       - dots pull toward the pointer (magnet attract)
 *   "blackhole"     - dots swirl inward around the pointer, then ease back
 *   "constellation" - nearby dots light up and draw thin lines back to
 *                     the pointer, like a small network/graph
 *   "tubes"         - flowing lit 3D tubes trailing the pointer (WebGL,
 *                     via components/ui/TubesCursor.jsx). Loads Three.js
 *                     from a CDN at runtime, so it's noticeably heavier
 *                     than the others, and is CC BY-NC-SA 4.0 licensed
 *                     (attribution required, non-commercial only) — see
 *                     the comment at the top of that file before shipping
 *                     this on anything commercial.
 */
export const CURSOR_EFFECT = "attract";

/**
 * Radius (px) of the soft ambient vignette that follows the pointer
 * everywhere on the page (.page-glow in styles/effects.css) — separate
 * from CURSOR_EFFECT above, this one's always on regardless of which dot
 * effect is active. Smaller = a tighter pool of light/dark right around
 * the cursor instead of a wash covering most of the viewport.
 */
export const PAGE_GLOW_RADIUS = 350;
