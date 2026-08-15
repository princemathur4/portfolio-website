const GAP = 10; // space between the trigger and the card, above or below it
const VIEWPORT_MARGIN = 16; // never let the card touch the very edge of the screen

function getSafeTop() {
  const navHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) || 60;
  return navHeight + 12;
}

/**
 * Fixed-position { top, left } for a tooltip/card anchored to `triggerRect`,
 * clamped to stay fully inside the viewport. Prefers appearing directly
 * above the trigger (matching the skill tag hover-card's original look);
 * flips below it if there isn't enough room above (e.g. the trigger is
 * near the top of the page, under the sticky navbar). Horizontally,
 * it's centered on the trigger but slides left/right just enough to stay
 * clear of the screen edges — which matters here because skill tags wrap
 * across a full-width row and can sit anywhere along it, including right
 * up against either edge.
 */
export function computeAnchoredPosition(triggerRect, cardRect) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const safeTop = getSafeTop();

  let top = triggerRect.top - cardRect.height - GAP;
  if (top < safeTop) top = triggerRect.bottom + GAP;
  const maxTop = Math.max(safeTop, viewportHeight - cardRect.height - VIEWPORT_MARGIN);
  top = Math.min(Math.max(top, safeTop), maxTop);

  const maxLeft = Math.max(VIEWPORT_MARGIN, viewportWidth - cardRect.width - VIEWPORT_MARGIN);
  let left = triggerRect.left + triggerRect.width / 2 - cardRect.width / 2;
  left = Math.min(Math.max(left, VIEWPORT_MARGIN), maxLeft);

  return { top, left };
}
