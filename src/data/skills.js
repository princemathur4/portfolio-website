/**
 * Skills content.
 *
 * Deliberately just a flat, categorised list of labels with no manual
 * "where is this used" mapping. contentService.getReferencesForSkill()
 * derives that at runtime by scanning each experience/project's `stack`
 * array for a matching label. That keeps this file the single place to
 * edit when a skill is added or renamed, instead of two places falling
 * out of sync.
 */
const skillCategories = [
  {
    id: "languages-frameworks",
    label: "Languages & Frameworks",
    skills: [
      "Python",
      "Flask",
      "FastAPI",
      "Celery",
      "Ruby on Rails",
      "Sidekiq",
      "JavaScript",
      "React",
      "Node.js",
    ],
  },
  {
    id: "databases-cloud",
    label: "Databases & Cloud",
    skills: [
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Elasticsearch",
      "AWS",
      "Azure",
      "Docker",
    ],
  },
  {
    id: "system-design",
    label: "System Design",
    skills: [
      "REST API Design",
      "Distributed Systems",
      "Event-Driven Architecture",
      "Async Processing",
      "Microservices",
      "WebSockets",
      "Real-Time Systems",
      "PCI Compliance",
    ],
  },
  {
    id: "ai-automation",
    label: "AI & Automation",
    skills: [
      "LLM Integration",
      "RAG",
      "LangChain",
      "NLP",
      "OpenAI APIs",
      "AWS Comprehend",
      "Cursor",
      "Windsurf",
      "Claude Code",
    ],
  },
  {
    id: "delivery-collaboration",
    label: "Delivery & Collaboration",
    skills: [
      "Unit Testing",
      "Performance Optimisation",
      "Code Reviews",
      "CI/CD",
      "Technical Mentorship",
      "Cross-Functional Collaboration",
    ],
  },
];

export default skillCategories;
