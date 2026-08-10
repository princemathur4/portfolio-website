import React, { useEffect, useRef } from "react";
import { CURSOR_EFFECT } from "../../config/cursorEffect.js";
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

function parseDotColor(raw) {
  colorProbeCtx.fillStyle = "rgba(154, 164, 178, 0.28)";
  colorProbeCtx.fillStyle = raw;
  colorProbeCtx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = colorProbeCtx.getImageData(0, 0, 1, 1).data;
  return { r, g, b, a: a / 255 };
}

/**
 * Canvas replacement for the static .dot-grid background, used whenever
 * config/cursorEffect.js picks an interactive mode. Renders the same
 * dot-grid look at rest, but each frame nudges dots near the pointer
 * according to the active effect's physics (see utils/cursorEffects.js).
 *
 * On touch devices, touch position stands in for pointer position: contact
 * (touchstart/pointerdown) nudges dots the same way a mouse hover would,
 * and lifting the finger (pointerup/pointercancel) eases them back, same
 * as the mouse leaving the window. Falls back to drawing the grid once and
 * never animating under prefers-reduced-motion, same as the rest of the
 * site's motion effects.
 */
export default function DotField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const effect = CURSOR_EFFECTS[CURSOR_EFFECT];
    if (!effect) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasHover = window.matchMedia("(hover: hover)").matches;
    const hasTouch = window.matchMedia("(pointer: coarse)").matches;
    const interactive = !reducedMotion && (hasHover || hasTouch);
    const isConstellation = CURSOR_EFFECT === "constellation";

    let dots = [];
    let width = 0;
    let height = 0;
    let frameId = null;
    let running = true;
    let resizeTimer = null;
    const pointer = { x: -9999, y: -9999 };

    let dotColor = parseDotColor(getComputedStyle(document.documentElement).getPropertyValue("--dot-color"));
    let accentRgb = hexToRgbTuple(getComputedStyle(document.documentElement).getPropertyValue("--color-teal") || "#59c3b4");

    const themeObserver = new MutationObserver(() => {
      dotColor = parseDotColor(getComputedStyle(document.documentElement).getPropertyValue("--dot-color"));
      accentRgb = hexToRgbTuple(getComputedStyle(document.documentElement).getPropertyValue("--color-teal") || "#59c3b4");
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

      for (let i = 0; i < dots.length; i += 1) {
        const dot = dots[i];
        let result = null;
        if (interactive) result = effect.compute(dot, pointer, effect.radius, time);

        const targetOffsetX = result ? result.offsetX : 0;
        const targetOffsetY = result ? result.offsetY : 0;
        const targetScale = result ? result.scale : 1;
        const targetAlpha = result ? result.alpha : 1;

        dot.x += (dot.baseX + targetOffsetX - dot.x) * effect.ease;
        dot.y += (dot.baseY + targetOffsetY - dot.y) * effect.ease;
        dot.scale += (targetScale - dot.scale) * effect.ease;
        dot.alpha += (targetAlpha - dot.alpha) * effect.ease;

        const r = Math.max(0.15, DOT_RADIUS * dot.scale);
        const a = Math.min(1, Math.max(0, dot.alpha)) * dotColor.a;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${dotColor.r}, ${dotColor.g}, ${dotColor.b}, ${a})`;
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
  }, []);

  return <canvas ref={canvasRef} className="dot-field" aria-hidden="true" />;
}
