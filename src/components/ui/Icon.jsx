import React from "react";

/**
 * Small inline-SVG icon set (stroke-based, generic shapes rather than exact
 * brand marks) used anywhere a link needs more than plain text: the footer's
 * persistent contact/social row, the contact CTA, the resume link.
 */
const ICONS = {
  email: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <line x1="8" y1="10" x2="8" y2="17" />
      <circle cx="8" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
      <path d="M12 17v-4a2 2 0 0 1 4 0v4" />
    </>
  ),
  github: (
    <>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="9" r="2.2" />
      <path d="M6 8.2V16" />
      <path d="M6 12c0 2.5 2.5 4 5.5 4H16" />
      <path d="M18 11.2V9" />
    </>
  ),
  hackerrank: (
    <>
      <polyline points="9 18 3 12 9 6" />
      <polyline points="15 6 21 12 15 18" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12" />
      <polyline points="7 10 12 15 17 10" />
      <path d="M5 21h14" />
    </>
  ),
};

export default function Icon({ name, size = 16, className = "" }) {
  const shape = ICONS[name];
  if (!shape) return null;
  return (
    <svg
      className={`icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shape}
    </svg>
  );
}
