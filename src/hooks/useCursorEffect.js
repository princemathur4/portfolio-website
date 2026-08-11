import { useCallback, useState } from "react";
import { CURSOR_EFFECT, CURSOR_EFFECT_OPTIONS } from "../config/cursorEffect.js";

const STORAGE_KEY = "cursorEffect";
const VALID_VALUES = CURSOR_EFFECT_OPTIONS.map((option) => option.value);

function getInitialCursorEffect() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (VALID_VALUES.includes(stored)) return stored;
  // Falls back to "none" rather than trusting CURSOR_EFFECT blindly, in
  // case it's ever set to a value that isn't (or is no longer) listed in
  // CURSOR_EFFECT_OPTIONS.
  return VALID_VALUES.includes(CURSOR_EFFECT) ? CURSOR_EFFECT : "none";
}

/**
 * Reads/writes the visitor's chosen dot-grid cursor effect, same pattern as
 * useTheme.js: state in localStorage, CURSOR_EFFECT_OPTIONS is the only
 * valid set of values. Consumed by App.jsx (to decide what to render) and
 * CursorEffectToggle.jsx (the footer easter egg's picker UI).
 */
export function useCursorEffect() {
  const [cursorEffect, setCursorEffectState] = useState(getInitialCursorEffect);

  const setCursorEffect = useCallback((value) => {
    if (!VALID_VALUES.includes(value)) return;
    setCursorEffectState(value);
    window.localStorage.setItem(STORAGE_KEY, value);
  }, []);

  return { cursorEffect, setCursorEffect };
}
