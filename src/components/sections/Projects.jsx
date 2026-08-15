import React from "react";
import { getProjects } from "../../services/contentService.js";
import { useFilters } from "../../context/FilterContext.jsx";
import { useFilteredEntries } from "../../hooks/useFilteredEntries.js";
import { useRevealOnScroll } from "../../hooks/useRevealOnScroll.js";
import SectionHeading from "../ui/SectionHeading.jsx";
import EmptyFilterState from "../ui/EmptyFilterState.jsx";
import ProjectCard from "./ProjectCard.jsx";

export default function Projects() {
  const visibleProjects = useFilteredEntries(getProjects, "project");
  const { clearFilters } = useFilters();
  const { ref, isVisible } = useRevealOnScroll();

  return (
    <section id="projects" className={`section reveal ${isVisible ? "is-visible" : ""}`.trim()} ref={ref}>
      <div className="container">
        <SectionHeading
          eyebrow="04 &middot; projects"
          title="Things I've built on my own time"
        />
        {visibleProjects.length === 0 ? (
          <EmptyFilterState onClear={clearFilters} />
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
