import { useEffect } from "react";

/**
 * Keeps document.title and <meta name="description"> in sync with
 * profile.js at runtime. index.html still ships static fallback values
 * (for the pre-hydration paint and for crawlers that don't execute JS),
 * but this is what stops them silently drifting out of sync with
 * profile.js after a content edit — the only other copy lives here.
 */
export function useDocumentMeta(profile) {
  useEffect(() => {
    if (!profile) return;

    document.title = `${profile.name} — ${profile.title}`;

    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", profile.shortBio);
  }, [profile]);
}
