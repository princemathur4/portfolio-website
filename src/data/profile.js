/**
 * Profile content.
 *
 * This is the kind of content a future admin panel would let Prince edit
 * directly, so it's kept as plain, serializable data with no logic mixed
 * in. See src/services/contentService.js for the access layer that
 * components actually call.
 */
const profile = {
  id: "profile",
  name: "Prince Mathur",
  title: "Senior Software Engineer",
  location: "Delhi NCR, India",
  email: "princemathur.mathur4@gmail.com",
  phone: "+91-9971936873",
  availability: "Open to Senior / Staff / Forward Deployed Engineer roles \u00b7 immediate joiner",

  // Shown as the small eyebrow line above the hero heading.
  heroKicker: "Hi, I'm Prince. I write backend systems that stay calm when everything else is on fire.",

  // The big friendly-but-professional statement under the name.
  heroTagline:
    "I build the systems that sit underneath the product: async pipelines, data integrity at scale, and the APIs that hold up when a lot of people show up at once. Lately that also means wiring LLMs, RAG pipelines, and AI-powered features into production systems.",

  // Short version used in meta tags / cards.
  shortBio:
    "Senior Software Engineer with 7.5+ years designing, scaling, and owning distributed systems across Fintech, EdTech, and Restaurant Tech, with hands-on experience building LLM- and RAG-powered features.",

  // Full about-section copy. Friendly, first-person, humble about the
  // team effort behind the metrics.
  aboutParagraphs: [
    "I'm a backend-leaning engineer with 7.5+ years across Fintech, EdTech, and Restaurant Tech, building the parts of software that keep everything else running: idempotent queues, schemas that hold up under concurrent writes, pipelines quietly processing millions of jobs in the background. I've moved between individual contributor and tech lead roles, including leading a team of five and coordinating with an external university partner on a shared product, picked up hands-on experience integrating LLMs and RAG pipelines into production features along the way, and try to mentor engineers earlier in their career the way people once did for me.",
    "Right now I'm looking for a Senior or Staff backend role at a mid-to-large product company, and I'm equally open to Forward Deployed Engineer or founding engineer roles at earlier-stage, AI-forward startups (Series B\u2013D) where I can help shape the system from closer to the ground floor.",
  ],

  social: {
    // Fill these in with your real profile URLs.
    linkedin: "https://www.linkedin.com/in/princemathur",
    github: "https://github.com/princemathur4",
    hackerrank: "https://www.hackerrank.com/profile/princemathur_ma1",
  },

  // Drop your headshot at public/images/avatar.jpg and flip this to true.
  hasPhoto: true,
  photoPath: "/images/avatar.jpg",

  resumeUrl: "/resume.pdf",
};

export default profile;
