import React, { useEffect, useState } from "react";
import { getReferencesForSkill } from "../../services/contentService.js";
import { useFilters } from "../../context/FilterContext.jsx";
import { getSkillColor, getSkillColorSoftBackground } from "../../utils/skillColor.js";

/**
 * A skill tag in the skills bar. Hover shows a small card previewing
 * every experience/project that uses it. Click toggles it on as an
 * active filter (see FilterContext + FloatingFilterBar). Each active
 * skill gets its own color (utils/skillColor.js), reused for its chip,
 * its checkmark, and the matching keyword highlights inside cards.
 */
export default function Tag({ label }) {
  const [references, setReferences] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const { activeSkills, toggleSkill } = useFilters();

  useEffect(() => {
    let isMounted = true;
    getReferencesForSkill(label).then((refs) => {
      if (isMounted) setReferences(refs);
    });
    return () => {
      isMounted = false;
    };
  }, [label]);

  const hasReferences = references.length > 0;
  const isActive = activeSkills.includes(label);
  const color = getSkillColor(label);

  if (!hasReferences) {
    return <span className="pill">{label}</span>;
  }

  const idleStyle = { borderColor: getSkillColorSoftBackground(label, 0.55), background: getSkillColorSoftBackground(label, 0.09) };
  const activeStyle = { borderColor: color, background: getSkillColorSoftBackground(label, 0.24) };

  return (
    <button
      type="button"
      className={`skill-tag ${isActive ? "is-active" : ""}`.trim()}
      style={isActive ? activeStyle : idleStyle}
      onClick={() => toggleSkill(label)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      aria-pressed={isActive}
    >
      {label}
      {isActive && (
        <span className="skill-tag__check" style={{ color }} aria-hidden="true">
          &#10003;
        </span>
      )}

      {isHovered && (
        <span className="skill-tag__card" role="tooltip">
          <span className="skill-tag__card-title">
            {label} <span className="skill-tag__card-count">&middot; {references.length} {references.length === 1 ? "place" : "places"}</span>
          </span>
          <span className="skill-tag__card-list">
            {references.slice(0, 4).map((ref) => (
              <span className="skill-tag__card-item" key={ref.anchorId} style={{ borderLeftColor: color }}>
                <span className="skill-tag__card-item-title">{ref.title}</span>
                <span className="skill-tag__card-item-subtitle">{ref.subtitle}</span>
              </span>
            ))}
            {references.length > 4 && (
              <span className="skill-tag__card-more">+{references.length - 4} more</span>
            )}
          </span>
          <span className="skill-tag__card-hint">Click to filter</span>
        </span>
      )}
    </button>
  );
}
