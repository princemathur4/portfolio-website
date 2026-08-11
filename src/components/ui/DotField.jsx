import React, { useEffect, useRef } from "react";
import { CURSOR_EFFECTS } from "../../utils/cursorEffects.js";
import { hexToRgbTuple } from "../../utils/skillColor.js";

const SPACING = 26;
const DOT_RADIUS = 1.1;

// Resolves a CSS color string to RGBA by letting the canvas itself parse it
// and reading the pixel back, rather than regexing the text — the minified
// production build serializes --dot-color as 8-digit hex (e.g. #afb9c857)
// instead of the rgba(r, g, b, a) source form, and a regex tuned for one
// format silently misreads digits out of the other.
const colorProbe = document.createElement("canvas");
colorProbe.width = 1;
colorProbe.height = 1;
const colorProbeCtx = colorProbe.getContext("2d");
const FALLBACK_DOT_COLOR = { r: 154, g: 164, b: 178, a: 0.28 };
const WHITE_HOLE_PEAK = { r: 255, g: 255, b: 255 };

// `raw` only ever fails to be a real color when a transient computed-style
// read comes back empty — check that directly instead of the fillStyle
// before/after comparison this used to do. That comparison looked
// reasonable (a canvas silently ignores an invalid fillStyle assignment
// and keeps whatever was set before it, so "did fillStyle change" seemed
// like a fair proxy for "was this valid") but had a real bug: the probe
// canvas is a single persistent 1x1 pixel reused across every call, so if
// `raw` is ever identical to whatever the probe was already showing —
// which happens reliably under React StrictMode, which double-invokes
// this component's effect in dev, so the second invocation's mount-time
// parse reads the exact same value the first invocation already painted —
// "fillStyle didn't change" is true despite `raw` being completely valid,
// and it wrongly fell back to FALLBACK_DOT_COLOR. Since FALLBACK_DOT_COLOR
// is dimmer than every theme's real dot color, that showed up as dots
// rendering visibly dimmer on load than they should, correcting itself
// only once something (a theme or effect toggle) produced a `raw` that
// actually differed from the probe's last-painted value — which read
// exactly like the old "gets darker/more contrasty" accumulation bug this
// function was originally written to fix, just via a different mechanism.
function parseDotColor(raw, fallback = FALLBACK_DOT_COLOR) {
  if (!raw || !raw.trim()) return fallback;
  // The probe canvas is a single persistent 1x1 pixel reused across every
  // call (once per mount, plus once per theme toggle via themeObserver
  // below) — without clearing it first, painting a semi-transparent color
  // (--dot-color's alpha is always < 1) composites "source-over" onto
  // whatever's already there instead of replacing it, so the read-back
  // alpha ratchets up a little further with every single toggle instead of
  // reflecting `raw` on its own. A page refresh recreates this canvas from
  // scratch, which is why that "resets" the effect.
  colorProbeCtx.clearRect(0, 0, 1, 1);
  colorProbeCtx.fillStyle = raw;
  colorProbeCtx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = colorProbeCtx.getImageData(0, 0, 1, 1).data;
  return { r, g, b, a: a / 255 };
}

/**
 * Canvas replacement for the static .dot-grid background, used whenever
 * the active cursor effect (either the CURSOR_EFFECT default in
 * config/cursorEffect.js, or whatever the footer's cursor-effect easter
 * egg has switched to — see hooks/useCursorEffect.js) is an interactive
 * mode.
 * Renders the same dot-grid look at rest, but each frame nudges dots near
 * the pointer according to the active effect's physics (see
 * utils/cursorEffects.js).
 *
 * Re-runs its whole setup (rebuilding the grid, restarting the animation
 * loop) whenever `effectName` changes, so switching effects via the toggle
 * takes effect immediately without a page reload.
 *
 * On touch devices, touch position stands in for pointer position: contact
 * (touchstart/pointerdown) nudges dots the same way a mouse hover would,
 * and lifting the finger (pointerup/pointercancel) eases them back, same
 * as the mouse leaving the window. Falls back to drawing the grid once and
 * never animating under prefers-reduced-motion, same as the rest of the
 * site's motion effects.
 */
export default function DotField({ effectName }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const effect = CURSOR_EFFECTS[effectName];
    if (!effect) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasHover = window.matchMedia("(hover: hover)").matches;
    const hasTouch = window.matchMedia("(pointer: coarse)").matches;
    const interactive = !reducedMotion && (hasHover || hasTouch);
    const isConstellation = effectName === "constellation";
    const isBlackhole = effectName === "blackhole";
    const isGridPulse = effectName === "gridpulse";

    let dots = [];
    let width = 0;
    let height = 0;
    let frameId = null;
    let running = true;
    let resizeTimer = null;
    const pointer = { x: -9999, y: -9999 };
    // Blackhole derives both a distance AND a swirl angle from the pointer
    // every frame (see cursorEffects.js) — fed the raw, un-smoothed pointer,
    // fast mouse movement makes that angle jump between frames (the "center"
    // the swirl is measured from teleports along with the raw input), which
    // reads as dots scattering haphazardly instead of orbiting smoothly.
    // Easing a lagged copy of the pointer and physics-ing off that instead
    // keeps the reference point itself moving smoothly, so the swirl stays
    // stable during fast cursor movement. Other modes are unaffected.
    const smoothPointer = { x: -9999, y: -9999 };

    // Blackhole's page-glow vignette darkens toward the cursor instead of
    // away from it (see .page-glow--blackhole in effects.css), so resting
    // dots read from --dot-color-blackhole instead — brighter on dark
    // theme, darker on light theme (see the token comments in tokens.css).
    const dotColorProperty = isBlackhole ? "--dot-color-blackhole" : "--dot-color";

    let dotColor = parseDotColor(getComputedStyle(document.documentElement).getPropertyValue(dotColorProperty));
    let accentRgb = hexToRgbTuple(getComputedStyle(document.documentElement).getPropertyValue("--color-teal") || "#59c3b4");
    // Blackhole is a "white hole" on light theme: dots blend toward white
    // and full opacity near the pointer instead of dimming toward the
    // background, since a literal black-hole-style dim-and-shrink would
    // just fade dots into an already-light page instead of reading as a
    // glow. Re-checked on every theme toggle alongside dotColor/accentRgb.
    let isWhiteHole = isBlackhole && document.documentElement.getAttribute("data-theme") === "light";

    const themeObserver = new MutationObserver(() => {
      dotColor = parseDotColor(getComputedStyle(document.documentElement).getPropertyValue(dotColorProperty), dotColor);
      accentRgb = hexToRgbTuple(getComputedStyle(document.documentElement).getPropertyValue("--color-teal") || "#59c3b4");
      isWhiteHole = isBlackhole && document.documentElement.getAttribute("data-theme") === "light";
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    function buildGrid() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = [];
      const offset = SPACING / 2;
      for (let y = -offset; y < height + SPACING; y += SPACING) {
        for (let x = -offset; x < width + SPACING; x += SPACING) {
          dots.push({ baseX: x, baseY: y, x, y, scale: 1, alpha: 1 });
        }
      }
    }

    function draw(time) {
      frameId = null;
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      const lines = isConstellation ? [] : null;

      if (isBlackhole) {
        smoothPointer.x += (pointer.x - smoothPointer.x) * 0.12;
        smoothPointer.y += (pointer.y - smoothPointer.y) * 0.12;
      }
      const activePointer = isBlackhole ? smoothPointer : pointer;

      for (let i = 0; i < dots.length; i += 1) {
        const dot = dots[i];
        let result = null;
        if (interactive) result = effect.compute(dot, activePointer, effect.radius, time);

        const targetOffsetX = result ? result.offsetX : 0;
        const targetOffsetY = result ? result.offsetY : 0;
        const targetScale = result ? result.scale : 1;
        const targetAlpha = result ? result.alpha : 1;

        dot.x += (dot.baseX + targetOffsetX - dot.x) * effect.ease;
        dot.y += (dot.baseY + targetOffsetY - dot.y) * effect.ease;
        dot.scale += (targetScale - dot.scale) * effect.ease;
        dot.alpha += (targetAlpha - dot.alpha) * effect.ease;

        const r = Math.max(0.15, DOT_RADIUS * dot.scale);
        const alpha = Math.min(1, Math.max(0, dot.alpha));

        let fillR = dotColor.r;
        let fillG = dotColor.g;
        let fillB = dotColor.b;
        let a = alpha * dotColor.a;

        if (isWhiteHole) {
          // dot.alpha already eases from 1 (idle) down to blackhole's floor
          // of 0.2 (right at the pointer) — reusing that as the blend
          // factor means the color brightens in step with the same
          // smoothed motion driving position/scale, no separate easing
          // needed. closeness: 0 at rest, 1 at the pointer.
          const closeness = Math.min(1, Math.max(0, (1 - alpha) / 0.8));
          fillR = dotColor.r + (WHITE_HOLE_PEAK.r - dotColor.r) * closeness;
          fillG = dotColor.g + (WHITE_HOLE_PEAK.g - dotColor.g) * closeness;
          fillB = dotColor.b + (WHITE_HOLE_PEAK.b - dotColor.b) * closeness;
          a = Math.min(1, dotColor.a + (1 - dotColor.a) * closeness);
        } else if (isGridPulse) {
          // gridPulse's alpha target overshoots past 1 as strength rises
          // (see cursorEffects.js) instead of shrinking below it like
          // blackhole's — dot.alpha (unclamped, unlike the `alpha` local
          // above) reads that overshoot directly as closeness: 0 at rest,
          // 1 right at the pointer.
          const closeness = Math.min(1, Math.max(0, dot.alpha - 1));
          fillR = dotColor.r + (accentRgb[0] - dotColor.r) * closeness;
          fillG = dotColor.g + (accentRgb[1] - dotColor.g) * closeness;
          fillB = dotColor.b + (accentRgb[2] - dotColor.b) * closeness;
          a = Math.min(1, dotColor.a + (1 - dotColor.a) * closeness);
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(${fillR}, ${fillG}, ${fillB}, ${a})`;
        ctx.arc(dot.x, dot.y, r, 0, Math.PI * 2);
        ctx.fill();

        if (lines && result && result.inRange) {
          lines.push({ x: dot.x, y: dot.y, strength: result.strength });
        }
      }

      if (lines && lines.length && pointer.x > -1000) {
        ctx.lineWidth = 1;
        for (const point of lines) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${accentRgb[0]}, ${accentRgb[1]}, ${accentRgb[2]}, ${Math.min(0.5, point.strength * 0.6)})`;
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        }
      }

      if (interactive) frameId = requestAnimationFrame(draw);
    }

    function handlePointerMove(e) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    }

    function handlePointerLeave() {
      pointer.x = -9999;
      pointer.y = -9999;
    }

    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Resizing the canvas element clears its pixels. On non-interactive
        // (touch) devices the draw loop already exited after its one-shot
        // static frame, so without this the grid stays blank after any
        // viewport resize — e.g. mobile browser chrome collapsing/expanding
        // on tap/scroll, or the keyboard opening when an input is focused.
        buildGrid();
        if (!frameId) frameId = requestAnimationFrame(draw);
      }, 150);
    }

    function handleVisibility() {
      running = document.visibilityState === "visible";
      if (running && interactive && !frameId) frameId = requestAnimationFrame(draw);
    }

    buildGrid();
    frameId = requestAnimationFrame(draw);

    if (interactive) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      document.addEventListener("mouseleave", handlePointerLeave);
    }
    if (interactive && hasTouch) {
      // pointermove alone covers a dragging finger, but a plain tap fires
      // no pointermove at all — pointerdown carries that first contact
      // position instead. pointerup/pointercancel is touch's equivalent of
      // the mouse leaving the window, so dots ease back the same way.
      window.addEventListener("pointerdown", handlePointerMove, { passive: true });
      window.addEventListener("pointerup", handlePointerLeave, { passive: true });
      window.addEventListener("pointercancel", handlePointerLeave, { passive: true });
    }
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      running = false;
      if (frameId) cancelAnimationFrame(frameId);
      clearTimeout(resizeTimer);
      themeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("pointerdown", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerLeave);
      window.removeEventListener("pointercancel", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [effectName]);

  return <canvas ref={canvasRef} className="dot-field" aria-hidden="true" />;
}
