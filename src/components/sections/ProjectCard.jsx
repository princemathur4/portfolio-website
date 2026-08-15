import React from "react";
import ExternalLink from "../ui/ExternalLink.jsx";
import Icon from "../ui/Icon.jsx";
import MediaPlaceholder from "../ui/MediaPlaceholder.jsx";
import { useFilters } from "../../context/FilterContext.jsx";
import { highlightMatches } from "../../utils/highlightMatches.jsx";
import { filterPointsBySkills, getSkillTier } from "../../services/contentService.js";

export default function ProjectCard({ project }) {
  const { highlightedAnchorIds, searchQuery, activeSkills } = useFilters();
  const anchorId = `proj-${project.id}`;
  const isHighlighted = highlightedAnchorIds.includes(anchorId);
  const visibleHighlights = filterPointsBySkills(project.highlights, activeSkills);

  return (
    <article
      id={anchorId}
      className={`card hover-card project-card ${isHighlighted ? "is-highlighted" : ""}`.trim()}
    >
      {(project.imagePath || project.videoUrl) && (
        <MediaPlaceholder
          className="project-card__media"
          imagePath={project.imagePath}
          videoUrl={project.videoUrl}
          label={project.name}
        />
      )}

      <div>
        <h3 className="project-card__name">{project.name}</h3>
        <div className="project-card__tagline">{project.tagline}</div>
      </div>

      <p className="project-card__description">{highlightMatches(project.description, { searchQuery, activeSkills })}</p>

      <ul className="project-card__highlights">
        {visibleHighlights.map((point) => (
          <li key={point.text}>{highlightMatches(point.text, { searchQuery, activeSkills })}</li>
        ))}
      </ul>

      <div className="project-card__stack">
        {project.stack.map((tag) => (
          <span className={`pill pill--${getSkillTier(tag)}`} key={tag}>
            {tag}
          </span>
        ))}
      </div>

      <div className="project-card__links">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="project-card__github"
          >
            <Icon name="github" />
            <span>GitHub</span>
            <span className="project-card__github-arrow" aria-hidden="true">
              <svg className="project-card__github-arrow-icon" viewBox="0 0 12 12" aria-hidden="true">
                <path
                  d="M3.5 8.5L9 3M9 3H6.75M9 3V5.25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        )}
        <ExternalLink href={project.liveUrl}>Live site</ExternalLink>
      </div>
    </article>
  );
}
