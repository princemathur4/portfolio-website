import React, { useEffect, useRef } from "react";
import { CURSOR_EFFECT } from "../../config/cursorEffect.js";
import { CURSOR_EFFECTS } from "../../utils/cursorEffects.js";
import { hexToRgbTuple } from "../../utils/skillColor.js";

const SPACING = 26;
const DOT_RADIUS = 1.1;

function parseDotColor(raw) {
  const nums = (raw.match(/[\d.]+/g) || []).map(Number);
  const [r = 154, g = 164, b = 178, a = 0.28] = nums;
  return { r, g, b, a };
}

/**
 * Canvas replacement for the static .dot-grid background, used whenever
 * config/cursorEffect.js picks an interactive mode. Renders the same
 * dot-grid look at rest, but each frame nudges dots near the pointer
 * according to the active effect's physics (see utils/cursorEffects.js).
 *
 * Falls back to drawing the grid once and never animating on touch
 * devices (no real pointer) and under prefers-reduced-motion, same as the
 * rest of the site's motion effects.
 */
export default function DotField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const effect = CURSOR_EFFECTS[CURSOR_EFFECT];
    if (!effect) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const interactive =
      window.matchMedia("(hover: hover)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
      resizeTimer = setTimeout(buildGrid, 150);
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
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      running = false;
      if (frameId) cancelAnimationFrame(frameId);
      clearTimeout(resizeTimer);
      themeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="dot-field" aria-hidden="true" />;
}
