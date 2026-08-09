import { useEffect, useState } from "react";

/**
 * Tracks which of the given section IDs is currently most visible in the
 * viewport, so the navbar can highlight the right link as the person
 * scrolls. Pure UI concern, kept out of the components themselves.
 */
export function useActiveSection(sectionIds) {
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // The observer's shrunk rootMargin band can miss the last section once
    // the page hits its true max scroll — especially here, where the fixed
    // footer covers part of the viewport — so back it up with an explicit
    // "scrolled to the bottom" check that forces the last section active.
    const lastId = sectionIds[sectionIds.length - 1];
    let frameId = null;

    function handleScroll() {
      if (frameId) return;
      frameId = requestAnimationFrame(() => {
        frameId = null;
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        if (atBottom) setActiveId(lastId);
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      if (frameId) cancelAnimationFrame(frameId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join(",")]);

  return activeId;
}
