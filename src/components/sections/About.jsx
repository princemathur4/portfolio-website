import React from "react";
import SectionHeading from "../ui/SectionHeading.jsx";

export default function About({ profile }) {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHeading eyebrow="01 &middot; about" title="A bit about how I work" />
        <div className="about__grid">
          {profile.aboutParagraphs.map((paragraph, index) => (
            <p className="about__paragraph" key={index}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
