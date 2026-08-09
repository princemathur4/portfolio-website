import React from "react";

export default function ExternalLink({ href, children, className = "" }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={`external-link ${className}`.trim()}
    >
      {children} <span aria-hidden="true">&#8599;</span>
    </a>
  );
}
