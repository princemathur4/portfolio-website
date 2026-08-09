import React, { useEffect, useState } from "react";
import { getProjects, entryMatchesSkillFilters, entryMatchesSearch } from "../../services/contentService.js";
import { useFilters } from "../../context/FilterContext.jsx";
import { useRevealOnScroll } from "../../hooks/useRevealOnScroll.js";
import SectionHeading from "../ui/SectionHeading.jsx";
import ProjectCard from "./ProjectCard.jsx";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const { activeSkills, searchQuery, clearFilters } = useFilters();
  const { ref, isVisible } = useRevealOnScroll();

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  const visibleProjects = projects.filter(
    (project) =>
      entryMatchesSkillFilters(project, activeSkills) && entryMatchesSearch(project, "project", searchQuery)
  );

  return (
    <section id="projects" className={`section reveal ${isVisible ? "is-visible" : ""}`.trim()} ref={ref}>
      <div className="container">
        <SectionHeading
          eyebrow="04 &middot; projects"
          title="Things I've built on my own time"
        />
        {visibleProjects.length === 0 ? (
          <div className="empty-state">
            <p>Nothing matches the current filters.</p>
            <button type="button" className="btn btn-secondary" onClick={clearFilters}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
