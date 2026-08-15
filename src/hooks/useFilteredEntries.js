import { useEffect, useState } from "react";
import { useFilters } from "../context/FilterContext.jsx";
import { entryMatchesSkillFilters, entryMatchesSearch } from "../services/contentService.js";

/**
 * Fetches a content list via `fetchEntries` (e.g. getExperience/getProjects)
 * and narrows it down to the entries matching the current skill/search
 * filters from FilterContext. Shared by Experience.jsx and Projects.jsx,
 * which otherwise repeat this exact fetch-then-filter shape verbatim.
 */
export function useFilteredEntries(fetchEntries, type) {
  const [entries, setEntries] = useState([]);
  const { activeSkills, searchQuery } = useFilters();

  useEffect(() => {
    fetchEntries().then(setEntries);
  }, [fetchEntries]);

  return entries.filter(
    (entry) => entryMatchesSkillFilters(entry, activeSkills) && entryMatchesSearch(entry, type, searchQuery)
  );
}
