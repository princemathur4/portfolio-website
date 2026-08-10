/**
 * Skills content.
 *
 * Deliberately just a flat, categorised list with no manual "where is
 * this used" mapping. contentService.getReferencesForSkill() derives
 * that at runtime by scanning each experience/project's `stack` array
 * for a matching label. That keeps this file the single place to edit
 * when a skill is added or renamed, instead of two places falling out
 * of sync.
 *
 * Category order is deliberate: backend-heavy categories lead (matching
 * Prince's specialization), frontend/full-stack breadth comes after to
 * show range without diluting the headline, then infra/AI/practices.
 *
 * Each skill is `{ label, tier }`. This section (the skills bar) always
 * shows every skill regardless of tier. The tier instead drives the
 * per-entry "stack" pill row on individual Experience/Project cards
 * (contentService.getSkillTier()): `"primary"` is core stack (languages,
 * frameworks, database/cloud platforms, major libraries) and stays
 * visible at every viewport size; `"secondary"` covers narrower tools,
 * specific managed services, architecture/methodology concepts, and
 * process skills, and is hidden on mobile/tablet there to keep those
 * per-card tag rows scannable on small screens. See `.pill--secondary`
 * in sections.css.
 */
const skillCategories = [
  {
    id: "backend",
    label: "Backend",
    skills: [
      { label: "Python", tier: "primary" },
      { label: "Flask", tier: "primary" },
      { label: "FastAPI", tier: "primary" },
      { label: "Ruby on Rails", tier: "primary" },
      { label: "Node.js", tier: "primary" },
      { label: "Celery", tier: "primary" },
      { label: "Sidekiq", tier: "primary" },
      { label: "Selenium", tier: "secondary" },
      { label: "Puppeteer", tier: "secondary" },
      { label: "BeautifulSoup", tier: "secondary" },
    ],
  },
  {
    id: "system-design",
    label: "System Design & Architecture",
    skills: [
      { label: "REST API Design", tier: "secondary" },
      { label: "Distributed Systems", tier: "secondary" },
      { label: "Event-Driven Architecture", tier: "secondary" },
      { label: "Async Processing", tier: "secondary" },
      { label: "Microservices", tier: "secondary" },
      { label: "WebSockets", tier: "secondary" },
      { label: "Real-Time Systems", tier: "secondary" },
      { label: "PCI Compliance", tier: "secondary" },
      { label: "Web Scraping", tier: "secondary" },
    ],
  },
  {
    id: "databases-cloud",
    label: "Databases, Cloud & DevOps",
    skills: [
      { label: "MySQL", tier: "primary" },
      { label: "PostgreSQL", tier: "primary" },
      { label: "MongoDB", tier: "primary" },
      { label: "Redis", tier: "primary" },
      { label: "Elasticsearch", tier: "primary" },
      { label: "AWS", tier: "primary" },
      { label: "Azure", tier: "primary" },
      { label: "Docker", tier: "primary" },
      { label: "Nginx", tier: "secondary" },
      { label: "Heroku", tier: "secondary" },
    ],
  },
  {
    id: "frontend",
    label: "Frontend & UI",
    skills: [
      { label: "JavaScript", tier: "primary" },
      { label: "React", tier: "primary" },
      { label: "MobX", tier: "secondary" },
      { label: "Bulma CSS", tier: "secondary" },
      { label: "Tkinter", tier: "secondary" },
      { label: "Razorpay SDK", tier: "secondary" },
    ],
  },
  {
    id: "ai-automation",
    label: "AI, ML & Automation",
    skills: [
      { label: "LLM Integration", tier: "primary" },
      { label: "RAG", tier: "primary" },
      { label: "LangChain", tier: "primary" },
      { label: "OpenAI APIs", tier: "primary" },
      { label: "Pandas", tier: "primary" },
      { label: "Scikit-learn", tier: "primary" },
      { label: "NLP", tier: "secondary" },
      { label: "Cursor", tier: "secondary" },
      { label: "Windsurf", tier: "secondary" },
      { label: "Claude Code", tier: "secondary" },
    ],
  },
  {
    id: "delivery-collaboration",
    label: "Delivery & Collaboration",
    skills: [
      { label: "Unit Testing", tier: "secondary" },
      { label: "Performance Optimisation", tier: "secondary" },
      { label: "Code Reviews", tier: "secondary" },
      { label: "CI/CD", tier: "secondary" },
      { label: "Technical Mentorship", tier: "secondary" },
      { label: "Cross-Functional Collaboration", tier: "secondary" },
    ],
  },
];

export default skillCategories;
