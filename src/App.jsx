import React, { useEffect, useState } from "react";
import { getProfile } from "./services/contentService.js";
import { FilterProvider } from "./context/FilterContext.jsx";
import { usePointerGlow } from "./hooks/usePointerGlow.js";
import { useDocumentMeta } from "./hooks/useDocumentMeta.js";
import { useCursorEffect } from "./hooks/useCursorEffect.js";
import { PAGE_GLOW_RADIUS } from "./config/cursorEffect.js";

import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import FloatingFilterBar from "./components/ui/FloatingFilterBar.jsx";
import DotField from "./components/ui/DotField.jsx";
import TubesCursor from "./components/ui/TubesCursor.jsx";
import CrosshairHUD from "./components/ui/CrosshairHUD.jsx";
import Hero from "./components/sections/Hero.jsx";
import SkillsBar from "./components/sections/SkillsBar.jsx";
import About from "./components/sections/About.jsx";
import Experience from "./components/sections/Experience.jsx";
import Projects from "./components/sections/Projects.jsx";
import Education from "./components/sections/Education.jsx";
import Contact from "./components/sections/Contact.jsx";

export default function App() {
  const [profile, setProfile] = useState(null);
  usePointerGlow();
  useDocumentMeta(profile);
  const { cursorEffect, setCursorEffect } = useCursorEffect();

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  if (!profile) return null;

  // "crosshair" isn't a DotField physics mode — the grid stays static
  // (same as "none") and CrosshairHUD renders the actual effect as a
  // separate overlay below.
  let backgroundEffect = <DotField effectName={cursorEffect} />;
  if (cursorEffect === "tubes") backgroundEffect = <TubesCursor />;
  else if (cursorEffect === "none" || cursorEffect === "crosshair") {
    backgroundEffect = <div className="dot-grid" aria-hidden="true" />;
  }

  return (
    <FilterProvider>
      {backgroundEffect}
      {cursorEffect === "crosshair" && <CrosshairHUD />}
      <div
        className={`page-glow${cursorEffect === "blackhole" ? " page-glow--blackhole" : ""}`}
        style={{ "--page-glow-radius": `${PAGE_GLOW_RADIUS}px` }}
        aria-hidden="true"
      />

      <Navbar profile={profile} />
      <Hero profile={profile} />
      <About profile={profile} />
      <SkillsBar />
      <Experience />
      <Projects />
      <Education />
      <Contact profile={profile} />
      <Footer profile={profile} cursorEffect={cursorEffect} setCursorEffect={setCursorEffect} />

      <FloatingFilterBar />
    </FilterProvider>
  );
}
