import React, { useEffect, useState } from "react";
import { getExperience, entryMatchesSkillFilters, entryMatchesSearch } from "../../services/contentService.js";
import { useFilters } from "../../context/FilterContext.jsx";
import { useRevealOnScroll } from "../../hooks/useRevealOnScroll.js";
import SectionHeading from "../ui/SectionHeading.jsx";
import ExperienceCard from "./ExperienceCard.jsx";

export default function Experience() {
  const [jobs, setJobs] = useState([]);
  const { activeSkills, searchQuery, clearFilters } = useFilters();
  const { ref, isVisible } = useRevealOnScroll();

  useEffect(() => {
    getExperience().then(setJobs);
  }, []);

  const visibleJobs = jobs.filter(
    (job) => entryMatchesSkillFilters(job, activeSkills) && entryMatchesSearch(job, "experience", searchQuery)
  );

  return (
    <section id="experience" className={`section reveal ${isVisible ? "is-visible" : ""}`.trim()} ref={ref}>
      <div className="container">
        <SectionHeading
          eyebrow="03 &middot; experience"
          title="Where I've worked"
        />
        {visibleJobs.length === 0 ? (
          <div className="empty-state">
            <p>Nothing matches the current filters.</p>
            <button type="button" className="btn btn-secondary" onClick={clearFilters}>
              Clear filters
            </button>
          </div>
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
