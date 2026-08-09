import React from "react";
import { useTheme } from "../../hooks/useTheme.js";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      className="theme-toggle"
      role="switch"
      aria-checked={isLight}
      onClick={toggleTheme}
      aria-label={`Switch to ${isLight ? "dark" : "light"} theme`}
    >
      <span className="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">
        {"\u{1F319}"}
      </span>
      <span className="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">
        ☀️
      </span>
      <span className="theme-toggle__thumb" aria-hidden="true" />
    </button>
  );
}
