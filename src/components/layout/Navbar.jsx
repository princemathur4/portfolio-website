import React from "react";
import { useActiveSection } from "../../hooks/useActiveSection.js";
import { scrollToId } from "../../utils/scrollTo.js";
import SearchBar from "../ui/SearchBar.jsx";
import ThemeToggle from "../ui/ThemeToggle.jsx";

const NAV_LINKS = [
  { id: "about", label: "/about" },
  { id: "skills", label: "/skills" },
  { id: "experience", label: "/experience" },
  { id: "projects", label: "/projects" },
  { id: "education", label: "/education" },
  { id: "contact", label: "/contact" },
];

export default function Navbar() {
  const activeId = useActiveSection(NAV_LINKS.map((link) => link.id));

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <a
          href="#hero"
          className="navbar__brand"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          prince<span>@</span>mathur
        </a>
        <div className="navbar__right">
          <div className="navbar__links">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`navbar__link ${activeId === link.id ? "is-active" : ""}`.trim()}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(link.id);
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <SearchBar />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
