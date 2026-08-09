import React from "react";

export default function SectionHeading({ eyebrow, title, subheading }) {
  return (
    <>
      {eyebrow && <div className="section-eyebrow">{eyebrow}</div>}
      <h2 className="section-heading">{title}</h2>
      {subheading && <p className="section-subheading">{subheading}</p>}
    </>
  );
}
