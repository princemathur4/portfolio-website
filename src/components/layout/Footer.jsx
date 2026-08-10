import React from "react";
import Icon from "../ui/Icon.jsx";

/**
 * Each footer link gets its own fixed accent color (not the deterministic
 * per-skill hash used elsewhere) so GitHub/LinkedIn/HackerRank/etc. read as
 * distinct, colorful buttons rather than one uniform grey row.
 */
function footerLinks(profile) {
  return [
    { key: "linkedin", href: profile.social.linkedin, external: true, icon: "linkedin", label: "LinkedIn", color: "#7FC4E8" },
    { key: "github", href: profile.social.github, external: true, icon: "github", label: "GitHub", color: "#B79CED" },
    { key: "hackerrank", href: profile.social.hackerrank, external: true, icon: "hackerrank", label: "HackerRank", color: "#3FA34D" },
  ];
}

export default function Footer({ profile }) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <span className="footer__copyright">
        built by {profile.name} &middot; {year}
      </span>
      <div className="footer__links">
        {footerLinks(profile).map((link) => (
          <a
            key={link.key}
            href={link.href}
            {...(link.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
            className="footer__link"
            style={{ "--link-color": link.color }}
          >
            <Icon name={link.icon} /> <span>{link.label}</span>
          </a>
        ))}
      </div>
    </footer>
  );
}
