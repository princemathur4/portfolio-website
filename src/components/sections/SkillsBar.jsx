import React, { useEffect, useState } from "react";
import { getSkillCategories } from "../../services/contentService.js";
import SectionHeading from "../ui/SectionHeading.jsx";
import Tag from "../ui/Tag.jsx";

export default function SkillsBar() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getSkillCategories().then(setCategories);
  }, []);

  return (
    <section id="skills" className="skills-bar" aria-label="Skills">
      <div className="container">
        <SectionHeading
          eyebrow="02 &middot; skills"
          title="What I've worked on"
          subheading="Click a skill to filter Experience and Projects down to just the entries that used it — click it again, or use the bar at the bottom, to clear the filter. Hover first for a quick preview of where it shows up."
        />
        {categories.map((category) => (
          <div className="skills-bar__group" key={category.id}>
            <div className="skills-bar__group-label">{category.label}</div>
            <div className="skills-bar__tags">
              {category.skills.map((skill) => (
                <Tag key={skill.label} label={skill.label} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
