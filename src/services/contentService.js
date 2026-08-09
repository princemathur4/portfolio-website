import profile from "../data/profile.js";
import skillCategories from "../data/skills.js";
import experience from "../data/experience.js";
import projects from "../data/projects.js";
import education from "../data/education.js";

/**
 * Content service.
 *
 * Every component reads site content through these functions instead of
 * importing src/data/*.js directly. Today they just return the local
 * data. Later, when there's a backend, these are the only functions that
 * need to change (e.g. to `fetch('/api/experience')`), and it's a good
 * seam for an admin panel to write through too, since every read already
 * goes through one place.
 *
 * They're written as async functions on purpose, even though the local
 * versions resolve instantly, so call sites already handle the shape
 * they'll need once this is backed by a real request.
 */

export async function getProfile() {
  return profile;
}

export async function getSkillCategories() {
  return skillCategories;
}

export async function getExperience() {
  return experience;
}

export async function getProjects() {
  return projects;
}

export async function getEducation() {
  return education;
}

function stackIncludes(stack = [], skillLabel) {
  const needle = skillLabel.trim().toLowerCase();
  return stack.some((tag) => tag.toLowerCase() === needle);
}

function hasSkillInPoints(points = [], skillLabel) {
  const needle = skillLabel.trim().toLowerCase();
  return points.some((point) => (point.skills || []).some((s) => s.toLowerCase() === needle));
}

/**
 * Finds every experience/project entry whose `stack` array includes the
 * given skill label (case-insensitive), so the skills bar can preview and
 * filter to real content without a second, manually-maintained mapping.
 *
 * Entries where the skill is backed by an actual tagged bullet/highlight
 * (not just a broader stack-level mention) sort first, on the theory that
 * "I have a specific example of this" is a more relevant match than "this
 * was part of the toolkit". Ties keep their original (reverse-chronological)
 * order, since Array#sort is stable.
 *
 * Returns an array of:
 *   { type: 'experience' | 'project', id, title, subtitle, excerpt, anchorId }
 * `subtitle` and `excerpt` exist to populate the hover-card preview.
 */
export async function getReferencesForSkill(skillLabel) {
  const byDetailFirst = (a, b) => Number(b.hasDetail) - Number(a.hasDetail);

  const experienceMatches = experience
    .filter((job) => stackIncludes(job.stack, skillLabel))
    .map((job) => ({
      type: "experience",
      id: job.id,
      title: job.role,
      subtitle: `${job.company} \u00b7 ${job.dateRange}`,
      excerpt: job.summary,
      anchorId: `exp-${job.id}`,
      hasDetail: hasSkillInPoints(job.bullets, skillLabel),
    }))
    .sort(byDetailFirst);

  const projectMatches = projects
    .filter((project) => stackIncludes(project.stack, skillLabel))
    .map((project) => ({
      type: "project",
      id: project.id,
      title: project.name,
      subtitle: project.tagline,
      excerpt: project.description,
      anchorId: `proj-${project.id}`,
      hasDetail: hasSkillInPoints(project.highlights, skillLabel),
    }))
    .sort(byDetailFirst);

  return [...experienceMatches, ...projectMatches];
}

/**
 * True if `entry` (a job or project) should be visible given the current
 * active skill filters. Empty `activeSkills` means "no filter, show
 * everything". Multiple active skills are OR'd together, matching any
 * one of them keeps the entry visible, since narrowing to entries that
 * used *every* selected skill would empty out fast with this few entries.
 */
export function entryMatchesSkillFilters(entry, activeSkills) {
  if (!activeSkills || activeSkills.length === 0) return true;
  const stack = entry.stack || [];
  return activeSkills.some((skill) => stackIncludes(stack, skill));
}

/**
 * Narrows a bullets/highlights array down to the ones tagged with at
 * least one active skill. If that would leave nothing (e.g. the card
 * matched via a stack-level skill that isn't tagged on any individual
 * bullet), falls back to showing everything rather than an empty card.
 */
export function filterPointsBySkills(points, activeSkills) {
  if (!activeSkills || activeSkills.length === 0) return points;
  const matching = points.filter((point) =>
    activeSkills.some((skill) => stackIncludes(point.skills, skill))
  );
  return matching.length > 0 ? matching : points;
}

function fieldsForSearch(entry, type) {
  if (type === "experience") {
    return [
      entry.role,
      entry.company,
      entry.summary,
      entry.location,
      ...(entry.bullets || []).map((b) => b.text),
      ...(entry.stack || []),
    ];
  }
  return [
    entry.name,
    entry.tagline,
    entry.description,
    ...(entry.highlights || []).map((h) => h.text),
    ...(entry.stack || []),
  ];
}

/**
 * True if any text field on the entry contains `query` (case-insensitive).
 * An empty query matches everything.
 */
export function entryMatchesSearch(entry, type, query) {
  const trimmed = (query || "").trim().toLowerCase();
  if (!trimmed) return true;
  return fieldsForSearch(entry, type).some((field) => (field || "").toLowerCase().includes(trimmed));
}

/**
 * Full-text search across experience and projects. Not currently called
 * by any component (the search bar filters Experience/Projects directly
 * via entryMatchesSearch instead), kept here as a ready-made snippet
 * source if you want a dropdown-style results list later.
 *
 * Returns an array of:
 *   { type, id, title, subtitle, snippet, anchorId }
 */
export async function searchContent(query) {
  const trimmed = (query || "").trim().toLowerCase();
  if (!trimmed) return [];

  const buildSnippet = (fields) => {
    const match = fields.find((field) => (field || "").toLowerCase().includes(trimmed));
    if (!match) return "";
    const index = match.toLowerCase().indexOf(trimmed);
    const start = Math.max(0, index - 40);
    const end = Math.min(match.length, index + trimmed.length + 60);
    return `${start > 0 ? "\u2026" : ""}${match.slice(start, end)}${end < match.length ? "\u2026" : ""}`;
  };

  const experienceResults = experience
    .filter((job) => entryMatchesSearch(job, "experience", trimmed))
    .map((job) => ({
      type: "experience",
      id: job.id,
      title: job.role,
      subtitle: job.company,
      snippet: buildSnippet(fieldsForSearch(job, "experience")),
      anchorId: `exp-${job.id}`,
    }));

  const projectResults = projects
    .filter((project) => entryMatchesSearch(project, "project", trimmed))
    .map((project) => ({
      type: "project",
      id: project.id,
      title: project.name,
      subtitle: project.tagline,
      snippet: buildSnippet(fieldsForSearch(project, "project")),
      anchorId: `proj-${project.id}`,
    }));

  return [...experienceResults, ...projectResults];
}