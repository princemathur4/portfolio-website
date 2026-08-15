import React from "react";
import { getExperience } from "../../services/contentService.js";
import { useFilters } from "../../context/FilterContext.jsx";
import { useFilteredEntries } from "../../hooks/useFilteredEntries.js";
import { useRevealOnScroll } from "../../hooks/useRevealOnScroll.js";
import SectionHeading from "../ui/SectionHeading.jsx";
import EmptyFilterState from "../ui/EmptyFilterState.jsx";
import ExperienceCard from "./ExperienceCard.jsx";

export default function Experience() {
  const visibleJobs = useFilteredEntries(getExperience, "experience");
  const { clearFilters } = useFilters();
  const { ref, isVisible } = useRevealOnScroll();

  return (
    <section id="experience" className={`section reveal ${isVisible ? "is-visible" : ""}`.trim()} ref={ref}>
      <div className="container">
        <SectionHeading
          eyebrow="03 &middot; experience"
          title="Where I've worked"
        />
        {visibleJobs.length === 0 ? (
          <EmptyFilterState onClear={clearFilters} />
        ) : (
          <div className="experience-list">
            {visibleJobs.map((job) => (
              <ExperienceCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
