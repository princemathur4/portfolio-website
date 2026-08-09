import React from "react";
import { getSkillColor } from "./skillColor.js";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Highlights a bullet/highlight's text against the current search query
 * and active skill filters in one pass. A search match renders as the
 * default amber <mark>. A skill match renders in that skill's own color
 * (see utils/skillColor.js), so two active skills highlight differently
 * inside the same sentence.
 *
 * Longest terms are matched first so a multi-word term isn't shadowed by
 * a shorter one that happens to be a substring of it.
 */
export function highlightMatches(text, { searchQuery = "", activeSkills = [] } = {}) {
  if (!text) return text;

  const terms = [];
  if (searchQuery.trim()) terms.push({ term: searchQuery.trim(), color: null });
  activeSkills.forEach((skill) => terms.push({ term: skill, color: getSkillColor(skill) }));

  if (terms.length === 0) return text;

  const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);
  const pattern = sortedTerms.map((t) => escapeRegExp(t.term)).join("|");
  const parts = String(text).split(new RegExp(`(${pattern})`, "gi"));

  if (parts.length === 1) return text;

  return parts.map((part, index) => {
    const match = sortedTerms.find((t) => t.term.toLowerCase() === part.toLowerCase());
    if (!match) return part;
    if (match.color) {
      return (
        <mark key={index} className="mark-skill" style={{ "--mark-color": match.color }}>
          {part}
        </mark>
      );
    }
    return <mark key={index}>{part}</mark>;
  });
}
