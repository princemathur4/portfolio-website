import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { getReferencesForSkill } from "../services/contentService.js";
import { scrollToId } from "../utils/scrollTo.js";

const FilterContext = createContext(null);

const HIGHLIGHT_DURATION_MS = 2200;

export function FilterProvider({ children }) {
  const [activeSkills, setActiveSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedAnchorIds, setHighlightedAnchorIds] = useState([]);
  const clearTimerRef = useRef(null);

  const flashHighlight = useCallback((anchorIds) => {
    setHighlightedAnchorIds(anchorIds);
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    clearTimerRef.current = setTimeout(() => setHighlightedAnchorIds([]), HIGHLIGHT_DURATION_MS);
  }, []);

  const toggleSkill = useCallback(
    async (skillLabel) => {
      setActiveSkills((current) => {
        const isActive = current.includes(skillLabel);
        const next = isActive ? current.filter((s) => s !== skillLabel) : [...current, skillLabel];
        return next;
      });

      const isCurrentlyActive = activeSkills.includes(skillLabel);
      if (!isCurrentlyActive) {
        const refs = await getReferencesForSkill(skillLabel);
        if (refs.length > 0) {
          flashHighlight(refs.map((ref) => ref.anchorId));
          scrollToId(refs[0].anchorId);
        }
      }
    },
    [activeSkills, flashHighlight]
  );

  const removeSkill = useCallback((skillLabel) => {
    setActiveSkills((current) => current.filter((s) => s !== skillLabel));
  }, []);

  const clearFilters = useCallback(() => {
    setActiveSkills([]);
    setSearchQuery("");
    setHighlightedAnchorIds([]);
  }, []);

  const value = useMemo(
    () => ({
      activeSkills,
      searchQuery,
      highlightedAnchorIds,
      toggleSkill,
      removeSkill,
      clearFilters,
      setSearchQuery,
      hasActiveFilters: activeSkills.length > 0 || searchQuery.trim().length > 0,
    }),
    [activeSkills, searchQuery, highlightedAnchorIds, toggleSkill, removeSkill, clearFilters]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return ctx;
}
