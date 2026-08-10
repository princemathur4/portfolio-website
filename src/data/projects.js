/**
 * Personal projects. `imagePath` / `videoUrl` / `liveUrl` are optional and
 * fall back to a generated placeholder (see ui/MediaPlaceholder.jsx) when
 * not set, since no screenshots were available yet at build time.
 *
 * Each highlight is `{ text, skills }`, same reasoning as experience.js
 * bullets, so skill filters can narrow down to just the relevant lines.
 */
const projects = [
  {
    id: "livedraft",
    name: "LiveDraft",
    tagline: "Real-time collaborative markdown wiki",
    description:
      "A Google-Docs-style collaborative wiki: multiple people editing the same page at once, with a hierarchical page tree and full-text search underneath. Built to go deep on real-time systems, CRDT-based sync, and keeping a document tree consistent under concurrent edits.",
    highlights: [
      {
        text: "CRDT-based multi-user editing over WebSockets using Yjs, so concurrent edits merge without conflicts",
        skills: ["WebSockets", "Real-Time Systems"],
      },
      {
        text: "JWT authentication and a hierarchical page tree for nested wiki pages",
        skills: [],
      },
      {
        text: "PostgreSQL ts-vector full-text search across all pages",
        skills: ["PostgreSQL"],
      },
      {
        text: "XSS-safe markdown rendering, with debounced autosave and document persistence for reliability",
        skills: [],
      },
    ],
    stack: ["Python", "FastAPI", "PostgreSQL", "React", "Docker", "WebSockets", "Yjs (CRDT)", "Real-Time Systems", "Claude Code"],
    githubUrl: "https://github.com/princemathur4/LiveDraft",
    liveUrl: null,
    videoUrl: null,
    imagePath: "/images/livedraft_1.png",
  },
  {
    id: "question-answering-bot",
    name: "Question Answering Bot",
    tagline: "RAG-based PDF Q&A system",
    description:
      "A retrieval-augmented question-answering system over PDF documents. Upload a document, ask questions about it, and get answers grounded in the actual text instead of a model guessing.",
    highlights: [
      {
        text: "Flask-based RAG pipeline over PDF documents",
        skills: ["Flask"],
      },
      {
        text: "OpenAI embeddings with LangChain for orchestration",
        skills: ["LangChain", "OpenAI APIs", "RAG"],
      },
      {
        text: "Pinecone for vector storage and semantic retrieval",
        skills: [],
      },
      {
        text: "Answers stay grounded in the source document rather than the model's general knowledge",
        skills: [],
      },
    ],
    stack: ["Python", "Flask", "OpenAI APIs", "LangChain", "Pinecone", "RAG", "LLM Integration"],
    githubUrl: "https://github.com/princemathur4/question-answering-bot",
    liveUrl: null,
    videoUrl: null,
    imagePath: null,
  },
  {
    id: "labroz-denim",
    name: "Labroz Denim",
    tagline: "Freelance e-commerce web app",
    description:
      "A freelance project: an e-commerce web application front-end and admin panel for a denim brand, built end-to-end from design through deployment.",
    highlights: [
      {
        text: "Designed and developed the e-commerce front-end and admin panel using React.js, MobX for state management, and the Bulma CSS framework",
        skills: ["React", "MobX", "Bulma CSS"],
      },
      {
        text: "Used AWS Cognito for user authentication and AWS Amplify to wire up backing cloud services",
        skills: ["AWS Cognito", "AWS Amplify"],
      },
      {
        text: "Integrated the Razorpay SDK for seamless payment processing",
        skills: ["Razorpay SDK"],
      },
      {
        text: "Ensured mobile responsiveness for an optimal user experience across devices",
        skills: [],
      },
      {
        text: "Deployed the production app on AWS EC2 with Nginx as the web server, using Heroku for the testing environment",
        skills: ["EC2", "Nginx", "Heroku"],
      },
    ],
    stack: ["React", "MobX", "Bulma CSS", "Razorpay SDK", "AWS Cognito", "AWS Amplify", "AWS", "EC2", "Nginx", "Heroku"],
    githubUrl: "https://github.com/princemathur4/Lucifer",
    liveUrl: null,
    videoUrl: null,
    imagePath: null,
  },
  {
    id: "stock-market-analysis-tool",
    name: "Stock Market Analysis & Visualization Tool",
    tagline: "Python-Tkinter desktop app for stock analysis",
    description:
      "A Python-Tkinter desktop application to visualize US stock closing prices, with portfolio management features and S&P 500 comparisons, using Pandas and Scikit-learn for analytics and long-term price projections.",
    highlights: [
      {
        text: "Built a Python-Tkinter desktop app to visualize US stock closing prices with portfolio management and S&P 500 comparison features",
        skills: ["Python", "Tkinter"],
      },
      {
        text: "Used Pandas for data wrangling and Scikit-learn for machine-learning-based long-term price projections",
        skills: ["Pandas", "Scikit-learn"],
      },
    ],
    stack: ["Python", "Tkinter", "Pandas", "Scikit-learn"],
    githubUrl: "https://github.com/princemathur4/Stock-Market-Trading-Analysis-Application",
    liveUrl: null,
    videoUrl: null,
    imagePath: null,
  },
];

export default projects;