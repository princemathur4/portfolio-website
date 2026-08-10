import React from "react";
import ExternalLink from "../ui/ExternalLink.jsx";
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
        {visibleHighlights.map((point, index) => (
          <li key={index}>{highlightMatches(point.text, { searchQuery, activeSkills })}</li>
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
        <ExternalLink href={project.githubUrl}>GitHub</ExternalLink>
        <ExternalLink href={project.liveUrl}>Live site</ExternalLink>
      </div>
    </article>
  );
}
