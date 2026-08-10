import React from "react";
import { scrollToId } from "../../utils/scrollTo.js";
import Icon from "../ui/Icon.jsx";

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export default function Hero({ profile }) {
  return (
    <header id="hero" className="hero">
      <div className="container">
        <div className="hero__top">
          {profile.hasPhoto ? (
            <img className="avatar" src={profile.photoPath} alt={profile.name} />
          ) : (
            <div className="avatar-fallback" aria-hidden="true">
              {initials(profile.name)}
            </div>
          )}
          <div>
            <div className="hero__status">
              <span className="hero__status-dot" aria-hidden="true">
                &#9679;
              </span>
              {profile.availability}
              <span className="hero__divider">|</span>
              {profile.location}
            </div>
          </div>
        </div>

        <div className="hero__kicker">{profile.heroKicker}</div>
        <h1 className="hero__name">{profile.name}</h1>
        <p className="hero__title">{profile.title}</p>
        <p className="hero__tagline">{profile.heroTagline}</p>

        <div className="hero__actions">
          <button type="button" className="btn btn-primary" onClick={() => scrollToId("contact")}>
            <Icon name="email" /> Get in touch
          </button>
          <a href={profile.resumeUrl} target="_blank" rel="noreferrer noopener" className="btn btn-secondary">
            <Icon name="download" /> Download resume
          </a>
        </div>
      </div>
    </header>
  );
}
