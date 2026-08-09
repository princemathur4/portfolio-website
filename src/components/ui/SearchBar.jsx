import React, { useEffect, useRef, useState } from "react";
import { useFilters } from "../../context/FilterContext.jsx";

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useFilters();
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const close = () => {
    if (!searchQuery.trim()) setIsOpen(false);
  };

  return (
    <div className={`search-bar ${isOpen ? "is-open" : ""}`.trim()}>
      <input
        ref={inputRef}
        type="text"
        className="search-bar__input"
        placeholder="Search experience & projects\u2026"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onBlur={close}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setSearchQuery("");
            inputRef.current?.blur();
          }
        }}
        aria-label="Search experience and projects"
      />
      <button
        type="button"
        className="search-bar__button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close search" : "Open search"}
      >
        {isOpen ? <span aria-hidden="true">&times;</span> : <span aria-hidden="true">&#128269;</span>}
      </button>
    </div>
  );
}
