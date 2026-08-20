/**
 * Experience content, most recent first.
 *
 * `stack` mixes concrete technologies with broader system-design/delivery
 * labels so the skills bar can link a skill like "Technical Mentorship" or
 * "PCI Compliance" back to the role that actually involved it, not just
 * the literal tech tags.
 *
 * Each bullet is `{ text, skills }` rather than a plain string, so a skill
 * filter can narrow down to just the bullets that actually involved it,
 * not just the job as a whole. `skills` can be an empty array for a bullet
 * that doesn't cleanly map to anything in the skills taxonomy, that's
 * fine, it just won't be affected by bullet-level filtering.
 *
 * `builtProject` is optional on purpose (per Prince: summary + link +
 * screenshot, all optional) since most of these are internal/enterprise
 * products without a public demo.
 */
const experience = [
  {
    id: "checkmate",
    role: "Senior Software Engineer",
    company: "Checkmate",
    companyUrl: "https://www.itsacheckmate.com/",
    location: "New York, USA (Remote)",
    dateRange: "Apr 2025 \u2013 Apr 2026",
    current: false,
    summary:
      "Restaurant technology company building the POS, ordering, and loyalty infrastructure that enterprise restaurant brands run on.",
    bullets: [
      {
        text: "Recovered over $100K in inflated point balances across 1,744 users and 4 brands by re-engineering the core credit-debit transaction matching logic and building an idempotent MySQL batch-processing pipeline to restore historical integrity with zero downtime.",
        skills: ["Python", "Flask", "MySQL", "Async Processing", "Performance Optimisation", "Cross-Functional Collaboration"],
      },
      {
        text: "Contributed to the FreedomPay payment integration, implementing a PCI-compliant system that cut unknown-state payment failures and helped earn FreedomPay certification, unlocking 5+ restaurant brands.",
        skills: ["PCI Compliance", "REST API Design", "Python", "MySQL", "Performance Optimisation", "Cross-Functional Collaboration"],
      },
      {
        text: "Built a high-throughput marketing events ingestion pipeline handling up to 1,000 notification IDs per campaign, improving analytics across every brand's campaigns.",
        skills: ["Async Processing", "Event-Driven Architecture", "Celery", "Redis", "Python", "MySQL"],
      },
      {
        text: "Delivered a customer loyalty and marketing data pipeline covering 100K+ customers across 6 restaurant brands, at a 99.3% success rate over tens of thousands of records.",
        skills: ["PostgreSQL", "Async Processing", "MySQL", "Celery", "Redis"],
      },
      {
        text: "Architected an async, event-driven order-rating system for the Kiosk backend with Redis-backed queues and MySQL, containerized with Docker, decoupling rating submission from order creation so product teams could act on customer feedback directly.",
        skills: ["Event-Driven Architecture", "Async Processing", "Redis", "Python", "MySQL", "Docker", "Performance Optimisation", "Cross-Functional Collaboration"],
      },
      {
        text: "Developed a dual-mode surcharge calculation feature with MySQL and a React-based store-level admin toggle, for accurate tax and fee reporting across brands and revenue centres.",
        skills: ["Python", "Flask", "MySQL", "JavaScript", "React", "Unit Testing", "Cross-Functional Collaboration"],
      },
      {
        text: "Set up AI-assisted development workflows (Cursor, Windsurf) with structured context files for session consistency, speeding up boilerplate, test generation, and PR reviews across the team.",
        skills: ["Windsurf", "Code Reviews"],
      },
    ],
    stack: [
      "Python",
      "Flask",
      "PostgreSQL",
      "MySQL",
      "Redis",
      "Celery",
      "JavaScript",
      "React",
      "Ruby on Rails",
      "PCI Compliance",
      "Event-Driven Architecture",
      "Async Processing",
      "Docker",
      "REST API Design",
      "Windsurf",
      "Code Reviews",
      "Cross-Functional Collaboration",
      "Performance Optimisation",
      "Unit Testing",
    ],
    builtProject: {
      name: "Checkmate direct ordering & loyalty platform",
      summary:
        "An ordering and loyalty platform unifying POS, loyalty, and payment integrations for multi-brand restaurant groups. Worked on the payment, loyalty, and ordering pipelines underneath it — transaction integrity, PCI-compliant payments, and event-driven order processing.",
      link: "https://web.opentender.io/",
      screenshotPath: null,
    },
  },
  {
    id: "scaler",
    role: "Senior Software Engineer (Tech Lead, Neovarsity)",
    company: "Scaler Academy",
    companyUrl: "https://www.scaler.com/",
    location: "Bengaluru, India (Hybrid)",
    dateRange: "Mar 2022 \u2013 Apr 2025",
    current: false,
    summary:
      "Education platform offering tech upskilling and postgraduate degree programs run jointly with international university partners.",
    bullets: [
      {
        text: "Served as Tech Lead for Scaler Neovarsity for 2.5 years, managing a team of 5 engineers and owning system design, architecture decisions, sprint planning, standups, and retrospectives. Acted as the primary technical point of contact for the product manager, program manager, and engineering manager.",
        skills: ["Technical Mentorship", "Cross-Functional Collaboration"],
      },
      {
        text: "Led cross-functional collaboration with Woolf University, an external partner, from integration through platform launch, running weekly requirement and alignment calls and coordinating internally to resolve dependency blockers and align on shared API contracts.",
        skills: ["Cross-Functional Collaboration", "REST API Design", "Ruby on Rails"],
      },
      {
        text: "Architected a scalable data sync framework in Ruby on Rails and Sidekiq with idempotent job design, processing 40M+ jobs and enabling real-time sync for 55K+ users, which eliminated the manual overhead of CSV exports.",
        skills: ["Ruby on Rails", "Sidekiq", "Distributed Systems", "Async Processing", "Event-Driven Architecture", "Redis"],
      },
      {
        text: "Engineered high-throughput job processing at 500+ jobs/min using Sidekiq queue throttling, circuit breakers, and idempotent batch processing, handling 3M+ activities within 10 days.",
        skills: ["Sidekiq", "Async Processing", "Distributed Systems", "Redis", "Ruby on Rails"],
      },
      {
        text: "Designed the database schema and systems for automated grading, credit reconciliation, and curriculum redesign, directly contributing to the graduation of 300+ degree students.",
        skills: ["MySQL", "REST API Design", "Ruby on Rails"],
      },
      {
        text: "Eliminated instructor no-shows for 3+ years by building a multi-channel alerting system (Kaleyra voice calls and Slack) with layered escalation across 50+ daily classes, guaranteeing 100% class coverage every day.",
        skills: ["Ruby on Rails"],
      },
      {
        text: "Drove SQL query performance optimisation across the system and built Metabase dashboards with automated alerts for real-time system and business monitoring.",
        skills: ["Performance Optimisation", "MySQL", "Ruby on Rails"],
      },
      {
        text: "Served as rotating on-call system admin, monitoring Jenkins and AWS Elastic Beanstalk deployments, triaging queue flooding and slow-query spikes via Sentry and DB CPU metrics, and using AWS Auto Scaling Groups and load balancing for traffic reliability.",
        skills: ["AWS", "Performance Optimisation", "CI/CD"],
      },
      {
        text: "Led the migration from mentor-based mock interviews to an AI-driven mock interview microservice for 40K+ learners, saving \u20b930L to date with \u20b91.25Cr projected annually.",
        skills: ["Microservices", "LLM Integration", "REST API Design"],
      },
      {
        text: "Used Cursor as an AI pair-programmer across the codebase, from scaffolding new features and Sidekiq jobs to diagnosing and fixing production bugs, speeding up delivery while keeping RSpec coverage and PR review standards high.",
        skills: ["Cursor", "REST API Design", "Ruby on Rails"],
      },
      {
        text: "Mentored 5 engineers through PR reviews, low-level design critiques, and 1:1s, conducted intern hiring interviews, and kept RSpec test coverage at 100% across all backend features.",
        skills: ["Technical Mentorship", "Unit Testing", "Code Reviews", "REST API Design", "Ruby on Rails"],
      },
    ],
    stack: [
      "Ruby on Rails",
      "Sidekiq",
      "MySQL",
      "Redis",
      "AWS",
      "Distributed Systems",
      "Event-Driven Architecture",
      "Async Processing",
      "Performance Optimisation",
      "Technical Mentorship",
      "Cross-Functional Collaboration",
      "CI/CD",
      "Unit Testing",
      "Cursor",
      "LLM Integration",
      "REST API Design",
      "Code Reviews",
    ],
    builtProject: {
      name: "Scaler Neovarsity",
      summary:
        "A Master's in Computer Science program delivered jointly by Scaler and Woolf University. Served as Tech Lead for 2.5 years, leading a team of 5 engineers and owning the system design, data-sync framework, grading systems, and dashboards that ran the program at scale.",
      link: "https://www.scaler.com/neovarsity/v2/",
      screenshotPath: null,
    },
  },
  {
    id: "egregore",
    role: "Full Stack Developer, Level 2",
    company: "Egregore Labs",
    companyUrl: "https://www.linkedin.com/company/egregore-labs/",
    location: "New Delhi, India (Hybrid)",
    dateRange: "Apr 2019 \u2013 Feb 2022",
    current: false,
    summary:
      "AI-driven fintech company building document intelligence and financial data products.",
    bullets: [
      {
        text: "Led backend development for Romulus, a trade finance proof of concept that won Finastra's #HackToTheFuture hackathon and reached the finals across 3 categories internationally.",
        skills: [],
      },
      {
        text: "Engineered multi-source document ingestion pipelines using AWS Textract, Azure Text Extractor, OpenCV, spaCy, and AWS Comprehend, supporting 50+ document templates across 10,000+ samples with provider-level abstraction and improved checkbox detection via OpenCV.",
        skills: ["AWS", "NLP", "Azure"],
      },
      {
        text: "Built an automated regression test suite for the multi-source document ingestion pipeline, validating extraction outputs across document templates so that extractor logic changes for new document types couldn't silently break documents that were already parsing correctly.",
        skills: ["Unit Testing"],
      },
      {
        text: "Developed an internal Python package abstracting commonly needed utilities like Database connection handling, logging, exception handling and cloud service integrations across AWS, Azure, and GCP, improving consistency and reusability across all microservices.",
        skills: ["Python", "AWS", "Microservices"],
      },
      {
        text: "Implemented keyword-based filtering with Elasticsearch and designed a Maker-Checker document review flow with a git-inspired version control system for audit traceability.",
        skills: ["Elasticsearch"],
      },
      {
        text: "Built periodic web scrapers for financial data (stock news, reports) in Node.js/Puppeteer and Python (BeautifulSoup, Selenium), using Pandas to clean and structure the results before persisting them to MongoDB.",
        skills: ["Node.js", "Python", "MongoDB", "Puppeteer", "BeautifulSoup", "Selenium", "Web Scraping", "Pandas", "Redis", "Event-Driven Architecture"],
      },
      {
        text: "Built a React frontend from scratch giving Spark Capital search capabilities over financial documents, including audio streaming for conference call recordings via AWS S3.",
        skills: ["React", "AWS", "JavaScript"],
      },
      {
        text: "Shipped 6+ backend microservices (Flask, AWS Cognito, S3) and 4+ React.js frontend MVPs, including a serverless AWS Chalice app, owning end-to-end REST API design and frontend-backend integration.",
        skills: ["Flask", "React", "Microservices", "AWS", "REST API Design", "JavaScript", "Redis", "Docker", "Event-Driven Architecture"],
      },
      {
        text: "Mentored a team of 4 interns, running code reviews and giving structured guidance on engineering practices.",
        skills: ["Technical Mentorship", "Code Reviews"],
      },
    ],
    stack: [
      "Python",
      "Flask",
      "AWS",
      "Azure",
      "Elasticsearch",
      "MongoDB",
      "Redis",
      "React",
      "Node.js",
      "JavaScript",
      "Docker",
      "REST API Design",
      "Microservices",
      "Event-Driven Architecture",
      "Technical Mentorship",
      "Unit Testing",
      "NLP",
      "Code Reviews",
      "Puppeteer",
      "BeautifulSoup",
      "Selenium",
      "Web Scraping",
      "Pandas",
    ],
    builtProject: {
      name: "Romulus and Robana",
      summary:
        "Romulus, a stock market data search & aggregation and document intelligence system, and Robana, a corporate expense validation platform — both built to pull structured insights out of unstructured documents like US tax forms, trade merchant documents, and corporate expense receipts. Built the ingestion pipelines, review workflows, and APIs behind them from the ground up as a founding-team-adjacent engineer.",
      link: null,
      screenshotPath: null,
    },
  },
  {
    id: "redcarpetup",
    role: "Engineering Intern",
    company: "Redcarpetup",
    companyUrl: "https://www.ycombinator.com/companies/redcarpetup",
    location: "New Delhi, India (On-site)",
    dateRange: "Sep 2018 \u2013 Mar 2019",
    current: false,
    summary:
      "YC-funded credit and lending startup (YC S15) building card issuance and lending products for India's new-to-credit segment.",
    bullets: [
      {
        text: "Delivered REST APIs and frontends for user onboarding flows, card delivery tracking, and admin portal features using Flask, Postgres, and React.",
        skills: ["Flask", "PostgreSQL", "React", "REST API Design", "Python", "JavaScript", "Redis"],
      },
      {
        text: "Integrated BookMyPacket for real-time delivery tracking on physical card shipments.",
        skills: ["Redis"],
      },
    ],
    stack: ["Flask", "Python", "PostgreSQL", "Redis", "React", "JavaScript", "REST API Design"],
    builtProject: {
      name: "RedCarpet onboarding & card delivery",
      summary:
        "Card issuance and lending product handling onboarding, delivery tracking, and account management for new cardholders. Built the onboarding flows, card delivery tracking, and admin portal features behind it in a first engineering role.",
      link: null,
      screenshotPath: null,
    },
  },
  {
    id: "cetpa",
    role: "Python Programming Instructor",
    company: "Cetpa Infotech",
    companyUrl: "https://www.cetpainfotech.com/",
    location: "Noida, India (On-site)",
    dateRange: "May 2018 \u2013 Jul 2018",
    current: false,
    summary:
      "Technical training institute",
    bullets: [
      {
        text: "Facilitated 3 summer training programs, each spanning 2 weeks, on foundational Python programming and IoT for 30+ students across two engineering colleges, equipping them with practical programming skills.",
        skills: ["Python", "Technical Mentorship"],
      },
      {
        text: "Gave lectures on how to build GUI desktop application projects using Python and Tkinter.",
        skills: ["Python"],
      },
    ],
    stack: ["Python", "Technical Mentorship"],
  },
];

export default experience;