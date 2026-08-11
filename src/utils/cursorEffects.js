/**
 * Physics for each pointer-interactive dot-grid effect (see DotField.jsx,
 * which drives these every animation frame, and config/cursorEffect.js,
 * which picks one).
 *
 * Each `compute(dot, pointer, radius, time)` returns the dot's TARGET
 * state for this frame — { offsetX, offsetY, scale, alpha } relative to
 * its resting grid position — which DotField then eases the dot's actual
 * rendered position toward, rather than snapping straight to it. That
 * easing is what makes the motion read as springy/fluid instead of jumpy.
 * `inRange` + `strength` are only used by "constellation", to decide which
 * dots get a connecting line back to the pointer.
 */

const IDLE = { offsetX: 0, offsetY: 0, scale: 1, alpha: 1, inRange: false, strength: 0 };

function repel(dot, pointer, radius) {
  const dx = dot.baseX - pointer.x;
  const dy = dot.baseY - pointer.y;
  const dist = Math.hypot(dx, dy);
  if (dist >= radius) return IDLE;

  const strength = 1 - dist / radius;
  const push = strength * 30;
  const safeDist = dist || 0.001;
  return {
    offsetX: (dx / safeDist) * push,
    offsetY: (dy / safeDist) * push,
    scale: 1 + strength * 0.4,
    alpha: 1 + strength * 0.6,
    inRange: true,
    strength,
  };
}

function attract(dot, pointer, radius) {
  const dx = pointer.x - dot.baseX;
  const dy = pointer.y - dot.baseY;
  const dist = Math.hypot(dx, dy);
  if (dist >= radius) return IDLE;

  const strength = 1 - dist / radius;
  const pull = strength * 26;
  const safeDist = dist || 0.001;
  return {
    offsetX: (dx / safeDist) * pull,
    offsetY: (dy / safeDist) * pull,
    scale: 1 + strength * 0.5,
    alpha: 1 + strength * 0.7,
    inRange: true,
    strength,
  };
}

function blackhole(dot, pointer, radius, time) {
  const dx = dot.baseX - pointer.x;
  const dy = dot.baseY - pointer.y;
  const dist = Math.hypot(dx, dy);
  if (dist >= radius) return IDLE;

  const strength = 1 - dist / radius;
  const pulledDist = dist * (1 - strength * 0.6);
  // Rotation speed ramps with closeness, driven by elapsed time rather than
  // a persisted per-dot angle, so it keeps orbiting for as long as the dot
  // stays inside the radius instead of settling into a fixed offset.
  const swirl = Math.atan2(dy, dx) + strength * strength * (time / 260);
  const targetX = pointer.x + Math.cos(swirl) * pulledDist;
  const targetY = pointer.y + Math.sin(swirl) * pulledDist;

  return {
    offsetX: targetX - dot.baseX,
    offsetY: targetY - dot.baseY,
    scale: Math.max(0.25, 1 - strength * 0.55),
    alpha: Math.max(0.2, 1 - strength * 0.35),
    inRange: true,
    strength,
  };
}

// No displacement at all — the grid stays exactly where it is, "sonar
// ping" style. `alpha` deliberately overshoots past 1 (like repel/attract
// already do) — DotField.jsx reads that overshoot as its blend-toward-
// accent-teal "closeness" signal (see isGridPulse there), the same trick
// isWhiteHole uses in the other direction, so the lit-up look rides the
// same eased channel driving everything else instead of needing separate
// per-dot state. The small scale bump makes the lit dots read as slightly
// bigger too, not just recolored.
function gridPulse(dot, pointer, radius) {
  const dx = dot.baseX - pointer.x;
  const dy = dot.baseY - pointer.y;
  const dist = Math.hypot(dx, dy);
  if (dist >= radius) return IDLE;

  const strength = 1 - dist / radius;
  return {
    offsetX: 0,
    offsetY: 0,
    scale: 1 + strength * GRID_PULSE_SCALE_BOOST,
    alpha: 1 + strength,
    inRange: true,
    strength,
  };
}

function constellation(dot, pointer, radius) {
  const dx = pointer.x - dot.baseX;
  const dy = pointer.y - dot.baseY;
  const dist = Math.hypot(dx, dy);
  if (dist >= radius) return IDLE;

  const strength = 1 - dist / radius;
  const safeDist = dist || 0.001;
  const drift = strength * 6;
  return {
    offsetX: (dx / safeDist) * drift,
    offsetY: (dy / safeDist) * drift,
    scale: 1 + strength * 1.6,
    alpha: 1 + strength * 1.2,
    inRange: true,
    strength,
  };
}

// Same interaction radius across every mode (kept small and consistent on
// purpose — this is the "how far from the pointer do dots start glowing"
// footprint, previously 150/150/190/170px and noticeably uneven between
// modes). Doesn't apply to "tubes", which is a separate WebGL rendering
// path with its own bloom settings, not part of this registry at all.
const GLOW_RADIUS = 200;

// Deliberately smaller and tighter than GLOW_RADIUS — a "soft 120px circle"
// sonar-ping footprint, not the same wide glow the other modes share.
const GRID_PULSE_RADIUS = 120;
const GRID_PULSE_SCALE_BOOST = 0.5;

export const CURSOR_EFFECTS = {
  repel: { radius: GLOW_RADIUS, ease: 0.18, compute: repel },
  attract: { radius: GLOW_RADIUS, ease: 0.18, compute: attract },
  blackhole: { radius: GLOW_RADIUS, ease: 0.12, compute: blackhole },
  constellation: { radius: GLOW_RADIUS, ease: 0.22, compute: constellation },
  gridpulse: { radius: GRID_PULSE_RADIUS, ease: 0.16, compute: gridPulse },
};
