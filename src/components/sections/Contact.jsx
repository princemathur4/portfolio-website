import React, { useState } from "react";
import Icon from "../ui/Icon.jsx";

export default function Contact({ profile }) {
  const [copied, setCopied] = useState(false);

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — the mail icon
      // next to this button still works as a fallback.
    }
  }

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="section-eyebrow">06 &middot; contact</div>
        <h2 className="contact__heading">{profile.availability}. Reach out if you'd like to chat, collaborate, or just say hello.</h2>
        <p className="contact__sub">
          The easiest way to reach me is via email.
        </p>
        <div className="contact__actions">
          <div className="contact__email">
            <a href={`mailto:${profile.email}`} className="contact__email-icon" aria-label="Send email" title="Send email">
              <Icon name="email" />
            </a>
            <span className="contact__email-divider" aria-hidden="true" />
            <button
              type="button"
              className="contact__email-text"
              onClick={handleCopyEmail}
              title={copied ? "Copied!" : "Copy email address"}
            >
              {copied ? "Copied!" : profile.email}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
