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
 *
 * Touch: no wrapper code needed here — inspected the actual CDN bundle
 * directly (downloaded tubes1.min.js and grepped it) and confirmed the
 * library attaches its own `pointermove`/`pointerleave`/`click` listeners
 * on `document.body`. Pointer Events fire for touch drags in all modern
 * mobile browsers, so a dragging finger already drives the trail through
 * that same native listener — which is this effect's primary, most
 * natural touch gesture anyway (a full-viewport WebGL trail is inherently
 * a "sweep your finger across the screen" thing). There's no
 * `pointerdown`/`touchstart` handler in the bundle, so a static tap with
 * no drag has no effect — deliberately left alone rather than bolting a
 * synthetic pointerdown->pointermove bridge into third-party minified,
 * version-pinned code for a secondary gesture.
 */
const TUBES_CDN_URL = "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js";

// On-brand palette instead of the demo's neon defaults, so the effect
// reads as part of this site rather than a generic tech-demo background.
// Same colors for both themes — a darker/less-saturated light-theme
// variant was tried and looked worse (screenshotted both side by side to
// check): with the transparency handled by a proper per-pixel alpha
// filter now (see #tubes-light-alpha in effects.css) rather than a blend
// mode, there's no "washes out against white" failure mode left to design
// around, and the darker palette just made the trail read as a duller,
// lower-contrast smudge for no benefit.
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
      {/* 0x0, renders nothing itself — just holds the #tubes-light-alpha
          filter definition that :root[data-theme="light"] .tubes-cursor
          canvas (effects.css) references via filter: url(#tubes-light-alpha).
          Harmless to always render regardless of theme, since it's only
          ever referenced by that light-theme-scoped CSS rule. See the
          comment there for why this exists: passes R/G/B through
          unchanged (rows 1-3 are identity) and replaces alpha with each
          pixel's luminance (row 4), so the canvas's black "empty" areas
          become genuinely transparent — real per-pixel alpha, not a
          blend-mode approximation — while the lit tubes keep their
          rendered color and go opaque in proportion to their brightness. */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="tubes-light-alpha" colorInterpolationFilters="sRGB">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0.2126 0.7152 0.0722 0 0"
          />
        </filter>
      </svg>
    </div>
  );
}
