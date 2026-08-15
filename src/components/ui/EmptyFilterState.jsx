import React from "react";

/**
 * Shown by Experience/Projects in place of their grid when the active
 * skill/search filters match nothing, with a way back to an unfiltered
 * view.
 */
export default function EmptyFilterState({ onClear }) {
  return (
    <div className="empty-state">
      <p>Nothing matches the current filters.</p>
      <button type="button" className="btn btn-secondary" onClick={onClear}>
        Clear filters
      </button>
    </div>
  );
}
