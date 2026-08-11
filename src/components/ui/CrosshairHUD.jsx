import React, { useEffect, useRef } from "react";

/**
 * "Crosshair HUD" cursor effect — two full-viewport teal lines crossing
 * exactly at the pointer, plus a small monospace coordinate readout next
 * to it. Deliberately not part of the DotField/cursorEffects.js physics
 * system: the dot grid itself stays fully static for this mode (App.jsx
 * renders the plain .dot-grid for "crosshair", same as "none") — this is
 * a separate overlay on top of it, not a transform applied to the dots.
 *
 * Positions are written directly to refs' inline styles (transform, not
 * top/left, for compositor-only repositioning) rather than through React
 * state, same reasoning as usePointerGlow.js: pointermove fires far too
 * often to re-render on every event.
 */
export default function CrosshairHUD() {
  const hLineRef = useRef(null);
  const vLineRef = useRef(null);
  const coordsRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let frameId = null;
    let visible = false;

    const setVisible = (next) => {
      if (visible === next) return;
      visible = next;
      const display = next ? "block" : "none";
      if (hLineRef.current) hLineRef.current.style.display = display;
      if (vLineRef.current) vLineRef.current.style.display = display;
      if (coordsRef.current) coordsRef.current.style.display = display;
    };

    const movePointer = (event) => {
      if (frameId) return;
      frameId = requestAnimationFrame(() => {
        frameId = null;
        setVisible(true);
        const x = Math.round(event.clientX);
        const y = Math.round(event.clientY);
        if (hLineRef.current) hLineRef.current.style.transform = `translateY(${y}px)`;
        if (vLineRef.current) vLineRef.current.style.transform = `translateX(${x}px)`;
        if (coordsRef.current) {
          coordsRef.current.style.transform = `translate(${x + 14}px, ${y + 14}px)`;
          coordsRef.current.textContent = `x:${x}  y:${y}`;
        }
      });
    };

    const hidePointer = () => setVisible(false);

    window.addEventListener("pointermove", movePointer, { passive: true });
    document.addEventListener("mouseleave", hidePointer);

    // Touch: pointermove alone covers a dragging finger; a plain tap needs
    // pointerdown for that first contact position, same lifecycle DotField
    // and usePointerGlow use for their own touch handling.
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) {
      window.addEventListener("pointerdown", movePointer, { passive: true });
      window.addEventListener("pointerup", hidePointer, { passive: true });
      window.addEventListener("pointercancel", hidePointer, { passive: true });
    }

    return () => {
      window.removeEventListener("pointermove", movePointer);
      document.removeEventListener("mouseleave", hidePointer);
      if (isTouchDevice) {
        window.removeEventListener("pointerdown", movePointer);
        window.removeEventListener("pointerup", hidePointer);
        window.removeEventListener("pointercancel", hidePointer);
      }
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="crosshair-hud" aria-hidden="true">
      <div ref={hLineRef} className="crosshair-hud__line crosshair-hud__line--h" />
      <div ref={vLineRef} className="crosshair-hud__line crosshair-hud__line--v" />
      <div ref={coordsRef} className="crosshair-hud__coords" />
    </div>
  );
}
