const NAV_OFFSET_PX = 72; // keeps the sticky navbar from covering the target heading

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET_PX;
  window.scrollTo({ top, behavior: "smooth" });
}
