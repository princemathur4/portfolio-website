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
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}
