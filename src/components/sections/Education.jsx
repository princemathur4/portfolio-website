import React, { useEffect, useState } from "react";
import { getEducation } from "../../services/contentService.js";
import SectionHeading from "../ui/SectionHeading.jsx";
import ExternalLink from "../ui/ExternalLink.jsx";

export default function Education() {
  const [education, setEducation] = useState([]);

  useEffect(() => {
    getEducation().then(setEducation);
  }, []);

  return (
    <section id="education" className="section">
      <div className="container">
        <SectionHeading eyebrow="05 &middot; education" title="My academic background" />
        <div className="education-list">
          {education.map((entry) => (
            <div className="card hover-card" key={entry.id}>
              <div className="education-card__degree">{entry.degree}</div>
              <ExternalLink href={entry.institutionUrl} className="education-card__institution">
                {entry.institution}
              </ExternalLink>
              <div className="education-card__dates">{entry.dateRange}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
