import React, { useEffect, useRef } from "react";

/**
 * "Tubes Cursor" — flowing, lit 3D tubes that trail the pointer. Loaded
 * from a CDN at runtime (not bundled) via threejs-components, so this
 * effect's WebGL/Three.js payload is only paid when it's actually the
 * active CURSOR_EFFECT. Original demo: https://codepen.io/soju22/pen/qEbdVjK,
 * built on the "Tubes Cursor" Framer component by Kevin Levron
 * (https://www.framer.com/@kevin-levron/).
 *
 * Licence: CC BY-NC-SA 4.0 (Attribution, Non-Commercial, Share-Alike) —
 * keep the attribution above if this stays active, and don't enable it on
 * anything commercial.
 */
const TUBES_CDN_URL = "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js";

// On-brand palette instead of the demo's neon defaults, so the effect
// reads as part of this site rather than a generic tech-demo background.
const TUBE_COLORS = ["#e8b24d", "#59c3b4", "#b79ced"];
const LIGHT_COLORS = ["#e8b24d", "#59c3b4", "#7fc4e8", "#e88c8c"];

function supportsWebGL2() {
  try {
    const testCanvas = document.createElement("canvas");
    return !!(window.WebGL2RenderingContext && testCanvas.getContext("webgl2"));
  } catch {
    return false;
  }
}

export default function TubesCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // The library falls back from WebGPU to WebGL2, but throws instead of
    // failing gracefully if neither context is actually available (old
    // hardware, WebGL disabled, some sandboxed/headless setups). Checking
    // ourselves first keeps that failure mode from crashing anything.
    if (!supportsWebGL2()) {
      console.warn("Tubes cursor effect skipped: WebGL2 isn't available in this browser.");
      return undefined;
    }

    let cancelled = false;
    let appInstance = null;

    function handleResize() {
      appInstance?.three?.resize?.();
    }

    import(/* @vite-ignore */ TUBES_CDN_URL)
      .then((mod) => {
        if (cancelled || !canvasRef.current) return;
        const initTubesCursor = mod.default;
        appInstance = initTubesCursor(canvasRef.current, {
          tubes: {
            colors: TUBE_COLORS,
            lights: { intensity: 200, colors: LIGHT_COLORS },
          },
        });
        window.addEventListener("resize", handleResize);
      })
      .catch((err) => {
        // No documented destroy API and no bundled fallback: if the CDN
        // is unreachable or WebGL isn't available, just leave the canvas
        // empty rather than breaking the page.
        console.warn("Tubes cursor effect failed to load; leaving background empty.", err);
      });

    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleResize);
      if (!appInstance) return;
      if (typeof appInstance.destroy === "function") appInstance.destroy();
      else if (typeof appInstance.dispose === "function") appInstance.dispose();
      else if (appInstance.renderer && typeof appInstance.renderer.dispose === "function") {
        appInstance.renderer.dispose();
      }
    };
  }, []);

  return (
    // The library sizes its renderer off the canvas's *parent* element
    // (size: "parent" in its own init code), so the canvas needs a real
    // viewport-sized wrapper — its actual DOM parent otherwise would be
    // the unstyled #root div (FilterProvider is a Context.Provider, it
    // renders no DOM node of its own), which has no explicit size.
    <div className="tubes-cursor" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
