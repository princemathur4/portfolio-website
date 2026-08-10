import React from "react";
import ExternalLink from "../ui/ExternalLink.jsx";
import { useFilters } from "../../context/FilterContext.jsx";
import { highlightMatches } from "../../utils/highlightMatches.jsx";
import { filterPointsBySkills, getSkillTier } from "../../services/contentService.js";
import { getCompanyColor } from "../../utils/companyColor.js";

export default function ExperienceCard({ job }) {
  const { highlightedAnchorIds, searchQuery, activeSkills } = useFilters();
  const anchorId = `exp-${job.id}`;
  const isHighlighted = highlightedAnchorIds.includes(anchorId);
  const visibleBullets = filterPointsBySkills(job.bullets, activeSkills);
  const companyColor = getCompanyColor(job.id);

  return (
    <article
      id={anchorId}
      className={`experience-card ${isHighlighted ? "is-highlighted" : ""}`.trim()}
      style={{ "--company-color": companyColor }}
    >
      <div className="experience-card__dates">{job.dateRange}</div>
      <div className="card hover-card">
        <div className="experience-card__header">
          <h3 className="experience-card__title">
            {job.role} <span className="experience-card__at">@</span>{" "}
            <ExternalLink href={job.companyUrl} className="experience-card__company-link">
              {job.company}
            </ExternalLink>
          </h3>
        </div>
        <div className="experience-card__location">{job.location}</div>
        <p className="experience-card__summary">{job.summary}</p>

        <ul className="experience-card__bullets">
          {visibleBullets.map((bullet, index) => (
            <li key={index}>{highlightMatches(bullet.text, { searchQuery, activeSkills })}</li>
          ))}
        </ul>

        <div className="experience-card__stack">
          {job.stack
            .filter((tag) => getSkillTier(tag) === "primary")
            .map((tag) => (
              <span className="pill pill--primary" key={tag}>
                {tag}
              </span>
            ))}
        </div>

        {job.builtProject && (
          <div className="built-project">
            <div className="built-project__label">What I built there</div>
            <div className="built-project__name">{job.builtProject.name}</div>
            <p className="built-project__summary">{job.builtProject.summary}</p>
            {job.builtProject.screenshotPath && (
              <img
                src={job.builtProject.screenshotPath}
                alt={`Screenshot of ${job.builtProject.name}`}
                style={{ width: "100%", borderRadius: "var(--radius-sm)", marginBottom: "10px" }}
              />
            )}
            <ExternalLink href={job.builtProject.link}>Visit</ExternalLink>
          </div>
        )}
      </div>
    </article>
  );
}
