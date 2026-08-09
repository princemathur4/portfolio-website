import { useEffect } from "react";

/**
 * Writes the pointer's viewport position to CSS custom properties on the
 * root element, throttled to one update per animation frame. A fixed,
 * pointer-events:none layer (see .page-glow in styles/effects.css) reads
 * --pointer-x/--pointer-y to render a soft glow that follows the cursor.
 */
export function usePointerGlow() {
  useEffect(() => {
    let frameId = null;

    const handlePointerMove = (event) => {
      if (frameId) return;
      frameId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
        document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
        frameId = null;
      });
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);
}
