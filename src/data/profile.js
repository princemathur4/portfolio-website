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
  heroKicker: "Hi, I'm Prince. I love turning good ideas into products people enjoy — and systems that scale to match.",

  // The big friendly-but-professional statement under the name.
  heroTagline:
    "I build the systems that sit underneath the product: async pipelines, data integrity at scale, and the APIs that hold up when a lot of people show up at once. I specialise in backend, with the frontend chops to own a feature end-to-end when a project calls for it. Lately that also means wiring LLMs, RAG pipelines, and AI-powered features into production systems.",

  // Short version used in meta tags / cards.
  shortBio:
    "Senior Software Engineer with 7.5+ years designing, scaling, and owning distributed systems across Fintech, EdTech, and Restaurant Tech — backend-focused, full-stack when a project calls for it, with hands-on experience building LLM- and RAG-powered features.",

  // Full about-section copy. Friendly, first-person, humble about the
  // team effort behind the metrics.
  aboutParagraphs: [
    "I'm a backend-leaning engineer with 7.5+ years across Fintech, EdTech, and Restaurant Tech, building the parts of software that keeps the engine running: idempotent queues, schemas that hold up under concurrent writes, pipelines quietly processing thousands of jobs in the background. A lot of that work comes down to squeezing performance out of a slow query or wiring up a third-party system — without it becoming the thing that breaks production. I've also built production React frontend applications, both as part of the job, at Checkmate, Egregore, and RedCarpet, and also through freelance and personal projects, from e-commerce applications with admin panels to data-visualization and analytics tools. I've moved between individual contributor and tech lead roles, including leading a team of five, coordinating with an external university partner on a shared product, and driving the shift from mentor-based to AI-driven interview tooling — and I try to mentor engineers earlier in their career the way people once did for me.",
    "Right now I'm looking for a Senior or Staff backend role at a mid-to-large product company, and I'm equally open to Forward Deployed Engineer or founding engineer roles at earlier-stage, AI-forward startups (Series B\u2013D) where I can help shape the system from closer to the ground.",
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
