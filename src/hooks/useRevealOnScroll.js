import { useEffect, useRef, useState } from "react";

/**
 * Returns a ref to attach to a section wrapper and a boolean that flips to
 * true the first time that element enters the viewport, for a one-time
 * scroll-reveal fade/slide-in. Stops observing after it fires once, since
 * re-triggering on every scroll up/down reads as flickery rather than
 * polished.
 */
export function useRevealOnScroll() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);

    // Mobile browsers resize the visual viewport mid-scroll as the address
    // bar/toolbar collapses, which can make IntersectionObserver miss the
    // crossing point entirely and leave a section stuck at opacity:0 forever
    // (mirrors the scroll-position fallback already used in
    // useActiveSection for this same class of observer flakiness).
    let frameId = null;
    function handleScroll() {
      if (frameId) return;
      frameId = requestAnimationFrame(() => {
        frameId = null;
        if (el.getBoundingClientRect().top < window.innerHeight) {
          setIsVisible(true);
          observer.disconnect();
          window.removeEventListener("scroll", handleScroll);
          window.removeEventListener("resize", handleScroll);
        }
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return { ref, isVisible };
}
