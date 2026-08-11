import { useEffect } from "react";

// Kept in sync with DotField.jsx's own TOUCH_LINGER_MS — same reasoning:
// a plain tap's pointerdown->pointerup round-trip is quick enough that
// resetting the instant pointerup fires barely lets the glow show up at
// all, so the reset is deferred by this long instead of happening inline.
const TOUCH_LINGER_MS = 300;

/**
 * Writes the pointer's viewport position to CSS custom properties on the
 * root element, throttled to one update per animation frame. A fixed,
 * pointer-events:none layer (see .page-glow in styles/effects.css) reads
 * --pointer-x/--pointer-y to render a soft glow that follows the cursor,
 * falling back to a default resting position (50vw 20vh) when unset —
 * that's what keeps the page looking the same darker-by-default way
 * before the pointer ever moves.
 *
 * On touch devices, pointermove alone misses a plain tap (it only fires
 * while dragging), so pointerdown carries that first contact position
 * instead — same touch lifecycle DotField.jsx uses for the dot-grid
 * effect. Lifting the finger removes the custom properties rather than
 * hiding the glow, so it snaps back to that same default resting
 * position instead of staying stuck under the last touch point — after a
 * short linger (TOUCH_LINGER_MS), not instantly, since removing them the
 * instant a quick tap ends barely lets the glow register at all.
 */
export function usePointerGlow() {
  useEffect(() => {
    let frameId = null;
    let releaseTimer = null;

    const setPointer = (event) => {
      if (frameId) return;
      frameId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
        document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
        frameId = null;
      });
    };

    const resetPointer = () => {
      document.documentElement.style.removeProperty("--pointer-x");
      document.documentElement.style.removeProperty("--pointer-y");
    };

    // A fresh touch cancels any pending release from a previous tap first,
    // so a new tap elsewhere while the last one's linger is still running
    // re-arms cleanly instead of getting reset out from under it later.
    const beginTouch = (event) => {
      clearTimeout(releaseTimer);
      releaseTimer = null;
      setPointer(event);
    };

    const endTouch = () => {
      clearTimeout(releaseTimer);
      releaseTimer = setTimeout(() => {
        resetPointer();
        releaseTimer = null;
      }, TOUCH_LINGER_MS);
    };

    window.addEventListener("pointermove", setPointer, { passive: true });

    // (pointer: coarse) — same touch-detection query DotField.jsx uses,
    // rather than (hover: none) as this file used previously, so both
    // files agree on what counts as a touch device instead of risking
    // disagreement on edge-case hybrid hardware.
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) {
      window.addEventListener("pointerdown", beginTouch, { passive: true });
      window.addEventListener("pointerup", endTouch, { passive: true });
      window.addEventListener("pointercancel", endTouch, { passive: true });
    }

    return () => {
      window.removeEventListener("pointermove", setPointer);
      if (isTouchDevice) {
        window.removeEventListener("pointerdown", beginTouch);
        window.removeEventListener("pointerup", endTouch);
        window.removeEventListener("pointercancel", endTouch);
      }
      if (frameId) cancelAnimationFrame(frameId);
      clearTimeout(releaseTimer);
    };
  }, []);
}
