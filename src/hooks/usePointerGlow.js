import { useEffect } from "react";

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
 * position instead of staying stuck under the last touch point.
 */
export function usePointerGlow() {
  useEffect(() => {
    let frameId = null;

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

    window.addEventListener("pointermove", setPointer, { passive: true });

    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    if (isTouchDevice) {
      window.addEventListener("pointerdown", setPointer, { passive: true });
      window.addEventListener("pointerup", resetPointer, { passive: true });
      window.addEventListener("pointercancel", resetPointer, { passive: true });
    }

    return () => {
      window.removeEventListener("pointermove", setPointer);
      if (isTouchDevice) {
        window.removeEventListener("pointerdown", setPointer);
        window.removeEventListener("pointerup", resetPointer);
        window.removeEventListener("pointercancel", resetPointer);
      }
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);
}
