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
// Dark theme only — light theme's own, deliberately darker palette is
// below (see the comment there for why it can't just reuse this one).
const TUBE_COLORS_DARK = ["#e8b24d", "#59c3b4", "#b79ced"];
const LIGHT_COLORS_DARK = ["#e8b24d", "#59c3b4", "#7fc4e8", "#e88c8c"];

// The canvas is screen-blended onto the page (.tubes-cursor canvas in
// effects.css) so the library's opaque black backdrop disappears against
// either theme's --color-bg. Screen blending only ever lightens the
// result relative to whatever's behind it, though — it can't darken — so
// the dark theme's bright/neon palette above, screened onto light theme's
// near-white page, washes out to barely-visible pastels. These are the
// same hues pulled noticeably darker/more saturated (two of them reused
// directly from tokens.css's own light-theme --color-teal/--color-violet)
// so there's still visible color left after screening lightens them.
const TUBE_COLORS_LIGHT = ["#a3721b", "#1f8f7d", "#7c3aed"];
const LIGHT_COLORS_LIGHT = ["#a3721b", "#1f8f7d", "#2f6a91", "#a8433f"];

function supportsWebGL2() {
  try {
    const testCanvas = document.createElement("canvas");
    return !!(window.WebGL2RenderingContext && testCanvas.getContext("webgl2"));
  } catch {
    return false;
  }
}

function getTubePalette() {
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  return isLight
    ? { colors: TUBE_COLORS_LIGHT, lightColors: LIGHT_COLORS_LIGHT }
    : { colors: TUBE_COLORS_DARK, lightColors: LIGHT_COLORS_DARK };
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
    let tubesModule = null;

    function handleResize() {
      appInstance?.three?.resize?.();
    }

    function destroyInstance() {
      if (!appInstance) return;
      if (typeof appInstance.destroy === "function") appInstance.destroy();
      else if (typeof appInstance.dispose === "function") appInstance.dispose();
      else if (appInstance.renderer && typeof appInstance.renderer.dispose === "function") {
        appInstance.renderer.dispose();
      }
      appInstance = null;
    }

    function createInstance() {
      if (!canvasRef.current) return;
      const { colors, lightColors } = getTubePalette();
      appInstance = tubesModule.default(canvasRef.current, {
        tubes: {
          colors,
          lights: { intensity: 200, colors: lightColors },
        },
      });
    }

    import(/* @vite-ignore */ TUBES_CDN_URL)
      .then((mod) => {
        if (cancelled || !canvasRef.current) return;
        tubesModule = mod;
        createInstance();
        window.addEventListener("resize", handleResize);
      })
      .catch((err) => {
        // No documented destroy API and no bundled fallback: if the CDN
        // is unreachable or WebGL isn't available, just leave the canvas
        // empty rather than breaking the page.
        console.warn("Tubes cursor effect failed to load; leaving background empty.", err);
      });

    // The library has no documented API for swapping an already-running
    // instance's colors, so a theme toggle while tubes is active tears
    // down and re-creates it with the other theme's palette instead —
    // same "re-init from scratch on theme change" approach DotField.jsx
    // uses for its own colors, just via destroy+recreate instead of a
    // cheap re-read, since this one's a full WebGL scene.
    const themeObserver = new MutationObserver(() => {
      if (!tubesModule) return;
      destroyInstance();
      createInstance();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      cancelled = true;
      themeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      destroyInstance();
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
