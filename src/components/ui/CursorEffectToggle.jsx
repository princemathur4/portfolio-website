import React, { useState } from "react";
import { CURSOR_EFFECT_OPTIONS } from "../../config/cursorEffect.js";

/**
 * A tiny easter egg tucked into the footer's "built by ... · {year}" line
 * (see Footer.jsx): an unlabeled emoji that grows and glows on hover, and
 * opens a dropdown of dot-grid cursor effects on click (state lives in
 * hooks/useCursorEffect.js, options come from config/cursorEffect.js). No
 * visible tooltip on purpose — the reveal is finding it, not being told
 * it's there — but it still carries an aria-label for screen readers.
 * The dropdown opens upward since the footer is pinned to the bottom of
 * the viewport.
 */
export default function CursorEffectToggle({ cursorEffect, setCursorEffect }) {
  const [isOpen, setIsOpen] = useState(false);

  const activeLabel = CURSOR_EFFECT_OPTIONS.find((option) => option.value === cursorEffect)?.label ?? "Off";

  return (
    <span
      className={`footer__easter-egg ${isOpen ? "is-open" : ""}`.trim()}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setIsOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setIsOpen(false);
      }}
    >
      <button
        type="button"
        className="footer__easter-egg-button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Cursor effect: ${activeLabel}. Click to change.`}
      >
        <span aria-hidden="true">🌌</span>
      </button>

      {isOpen && (
        <ul className="footer__easter-egg-menu" role="listbox" aria-label="Cursor effect">
          {CURSOR_EFFECT_OPTIONS.map((option) => (
            <li key={option.value} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={option.value === cursorEffect}
                className={`footer__easter-egg-option ${option.value === cursorEffect ? "is-active" : ""}`.trim()}
                onClick={() => {
                  setCursorEffect(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </span>
  );
}
