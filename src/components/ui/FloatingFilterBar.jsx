import React from "react";
import { useFilters } from "../../context/FilterContext.jsx";
import { getSkillColor, getSkillColorSoftBackground } from "../../utils/skillColor.js";

export default function FloatingFilterBar() {
  const { activeSkills, searchQuery, removeSkill, clearFilters, setSearchQuery, hasActiveFilters } = useFilters();

  if (!hasActiveFilters) return null;

  return (
    <div className="floating-filter-bar" role="status">
      <span className="floating-filter-bar__label">Showing entries matching these filters: </span>

      <div className="floating-filter-bar__chips">
        {searchQuery.trim() && (
          <button type="button" className="filter-chip filter-chip--search" onClick={() => setSearchQuery("")}>
            &#128269; &ldquo;{searchQuery}&rdquo;
            <span aria-hidden="true">&times;</span>
          </button>
        )}
        {activeSkills.map((skill) => (
          <button
            type="button"
            className="filter-chip"
            key={skill}
            style={{ borderColor: getSkillColor(skill), background: getSkillColorSoftBackground(skill, 0.22) }}
            onClick={() => removeSkill(skill)}
          >
            {skill}
            <span aria-hidden="true">&times;</span>
          </button>
        ))}
      </div>

      <button type="button" className="floating-filter-bar__reset" onClick={clearFilters}>
        Clear all
      </button>
    </div>
  );
}
