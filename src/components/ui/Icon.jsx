import React from "react";

/**
 * Small inline-SVG icon set used anywhere a link needs more than plain
 * text: the footer's persistent social row, project cards' GitHub link,
 * the contact CTA, the resume link. Mostly stroke-based generic shapes,
 * except `github`, which is a filled brand mark (fill="currentColor",
 * stroke="none" set directly on its own path) rather than following the
 * svg wrapper's default stroke styling below.
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
    <path
      fill="currentColor"
      stroke="none"
      d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.39-5.27 5.67.42.36.78 1.07.78 2.16v3.2c0 .31.21.67.8.56A10.51 10.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
    />
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
