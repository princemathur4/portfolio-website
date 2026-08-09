/**
 * A small, dark-theme-friendly palette. Every color here reads well with
 * dark ink text (var(--color-amber-ink)) on top of it, same idea as the
 * existing amber accent.
 */
const PALETTE = [
    "#E8B24D", // amber
    "#59C3B4", // teal
    "#E88C8C", // rose
    "#B79CED", // violet
    "#7FC4E8", // sky
    "#A8D66B", // lime
    "#E8A66B", // coral
    "#D98CE0", // orchid
  ];
  
  /** Deterministic: the same skill label always gets the same color. */
  export function getSkillColor(label) {
    let hash = 0;
    for (let i = 0; i < label.length; i += 1) {
      hash = (hash * 31 + label.charCodeAt(i)) >>> 0;
    }
    return PALETTE[hash % PALETTE.length];
  }
  
  /** Turns any #rrggbb hex value into an rgba() string at the given alpha. */
  export function hexToRgba(hex, alpha = 0.16) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  export function getSkillColorSoftBackground(label, alpha = 0.16) {
    return hexToRgba(getSkillColor(label), alpha);
  }