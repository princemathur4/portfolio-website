import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getReferencesForSkill } from "../../services/contentService.js";
import { useFilters } from "../../context/FilterContext.jsx";
import { getSkillColor, getSkillColorSoftBackground } from "../../utils/skillColor.js";
import { computeAnchoredPosition } from "../../utils/tooltipPosition.js";

/**
 * A skill tag in the skills bar. Hover shows a small card previewing
 * every experience/project that uses it. Click toggles it on as an
 * active filter (see FilterContext + FloatingFilterBar). Each active
 * skill gets its own color (utils/skillColor.js), reused for its chip,
 * its checkmark, and the matching keyword highlights inside cards.
 */
export default function Tag({ label }) {
  const [references, setReferences] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [cardPosition, setCardPosition] = useState(null);
  const triggerRef = useRef(null);
  const cardRef = useRef(null);
  const { activeSkills, toggleSkill } = useFilters();

  useEffect(() => {
    let isMounted = true;
    getReferencesForSkill(label).then((refs) => {
      if (isMounted) setReferences(refs);
    });
    return () => {
      isMounted = false;
    };
  }, [label]);

  // The card is portaled to document.body (see below) so it's positioned
  // in JS from the trigger's real on-screen position, clamped to the
  // viewport, instead of CSS `position: absolute` centered on the tag —
  // tags wrap across a full-width row and can sit anywhere along it,
  // including right against an edge, which routinely pushed a
  // fixed-width centered card past the screen edge on narrow viewports.
  // Portaling also sidesteps .skill-tag's own :hover/:focus-visible
  // transform, which would otherwise become the containing block for a
  // `position: fixed` descendant instead of the viewport.
  useLayoutEffect(() => {
    if (!isHovered || !triggerRef.current || !cardRef.current) return undefined;

    function reposition() {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const cardRect = cardRef.current.getBoundingClientRect();
      setCardPosition(computeAnchoredPosition(triggerRect, cardRect));
    }

    reposition();

    let frameId = null;
    function onViewportChange() {
      if (frameId) return;
      frameId = requestAnimationFrame(() => {
        frameId = null;
        reposition();
      });
    }

    window.addEventListener("scroll", onViewportChange, { passive: true });
    window.addEventListener("resize", onViewportChange);
    return () => {
      window.removeEventListener("scroll", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
      if (frameId) cancelAnimationFrame(frameId);
      setCardPosition(null);
    };
  }, [isHovered]);

  const hasReferences = references.length > 0;
  const isActive = activeSkills.includes(label);
  const color = getSkillColor(label);

  if (!hasReferences) {
    return <span className="pill">{label}</span>;
  }

  const idleStyle = { borderColor: getSkillColorSoftBackground(label, 0.55), background: getSkillColorSoftBackground(label, 0.09) };
  const activeStyle = { borderColor: color, background: getSkillColorSoftBackground(label, 0.24) };

  return (
    <button
      ref={triggerRef}
      type="button"
      className={`skill-tag ${isActive ? "is-active" : ""}`.trim()}
      style={isActive ? activeStyle : idleStyle}
      onClick={() => toggleSkill(label)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      aria-pressed={isActive}
    >
      {label}
      {isActive && (
        <span className="skill-tag__check" style={{ color }} aria-hidden="true">
          &#10003;
        </span>
      )}

      {isHovered &&
        createPortal(
          <span
            ref={cardRef}
            className="skill-tag__card"
            role="tooltip"
            style={{
              visibility: cardPosition ? "visible" : "hidden",
              top: cardPosition?.top ?? 0,
              left: cardPosition?.left ?? 0,
            }}
          >
            <span className="skill-tag__card-title">
              {label} <span className="skill-tag__card-count">&middot; {references.length} {references.length === 1 ? "place" : "places"}</span>
            </span>
            <span className="skill-tag__card-list">
              {references.slice(0, 4).map((ref) => (
                <span className="skill-tag__card-item" key={ref.anchorId} style={{ borderLeftColor: color }}>
                  <span className="skill-tag__card-item-title">{ref.title}</span>
                  <span className="skill-tag__card-item-subtitle">{ref.subtitle}</span>
                </span>
              ))}
              {references.length > 4 && (
                <span className="skill-tag__card-more">+{references.length - 4} more</span>
              )}
            </span>
            <span className="skill-tag__card-hint">Click to filter</span>
          </span>,
          document.body
        )}
    </button>
  );
}
