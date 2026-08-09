import React, { useEffect, useState } from "react";
import { getProfile } from "./services/contentService.js";
import { FilterProvider } from "./context/FilterContext.jsx";
import { usePointerGlow } from "./hooks/usePointerGlow.js";
import { CURSOR_EFFECT, PAGE_GLOW_RADIUS } from "./config/cursorEffect.js";

import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import FloatingFilterBar from "./components/ui/FloatingFilterBar.jsx";
import DotField from "./components/ui/DotField.jsx";
import TubesCursor from "./components/ui/TubesCursor.jsx";
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

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  if (!profile) return null;

  let backgroundEffect = <DotField />;
  if (CURSOR_EFFECT === "none") backgroundEffect = <div className="dot-grid" aria-hidden="true" />;
  else if (CURSOR_EFFECT === "tubes") backgroundEffect = <TubesCursor />;

  return (
    <FilterProvider>
      {backgroundEffect}
      <div className="page-glow" style={{ "--page-glow-radius": `${PAGE_GLOW_RADIUS}px` }} aria-hidden="true" />

      <Navbar />
      <Hero profile={profile} />
      <About profile={profile} />
      <SkillsBar />
      <Experience />
      <Projects />
      <Education />
      <Contact profile={profile} />
      <Footer profile={profile} />

      <FloatingFilterBar />
    </FilterProvider>
  );
}
