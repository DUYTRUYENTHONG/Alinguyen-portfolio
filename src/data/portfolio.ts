export type Project = {
  id: string;
  name: string;
  headline: string;
  status: string;
  problem: string;
  users: string;
  role: string;
  approach: string;
  outcome: string;
  proof: string;
  technologies: string[];
  link?: { label: string; href: string };
};

export const identity = {
  name: "Ali Nguyen",
  brand: "DUYTRUYENTHONG",
  title: "Sales, Marketing & E-commerce Builder",
  proposition:
    "I build AI, data, and digital commerce systems that help businesses improve sales funnels and generate more qualified leads.",
  email: "nquangd1510@gmail.com",
  github: "https://github.com/DUYTRUYENTHONG",
  service: "https://growth-commerce-os.vercel.app/",
  stos: "https://stosvn.vercel.app/stos",
} as const;

export const expertise = [
  {
    number: "01",
    title: "AI engineering",
    detail: "LLM applications, retrieval workflows and decision support prototypes.",
  },
  {
    number: "02",
    title: "Data platforms",
    detail: "SQL, Python and customer-level features that make raw events useful.",
  },
  {
    number: "03",
    title: "Commerce analytics",
    detail: "Customer behavior, funnels and retention questions tied to business decisions.",
  },
  {
    number: "04",
    title: "Automation & integrations",
    detail: "Practical workflows that connect product operations, content and measurement.",
  },
] as const;

export const projects: Project[] = [
  {
    id: "growth-commerce-os",
    name: "DUYTRUYENTHONG Growth Commerce OS",
    headline: "A clearer route from commerce signals to growth.",
    status: "Live service website",
    problem: "Commerce teams need a clearer path from content and channels to leads.",
    users: "Businesses exploring digital growth services.",
    role: "Founder and product operator.",
    approach: "A public service site presents CMS, landing, portfolio and channel workflows with working demo links.",
    outcome: "Live service pages and demo links are available. Adoption and business impact are not independently measured here.",
    proof: "Public service site and demo links",
    technologies: ["Web products", "CMS workflows", "Analytics"],
    link: { label: "Visit service site", href: "https://growth-commerce-os.vercel.app/" },
  },
  {
    id: "stos",
    name: "STOS Sales Traffic Operating System",
    headline: "A personal sales page with a path to better leads.",
    status: "Live product website",
    problem: "Independent sellers and small businesses need a shareable place to present their work, products, and contact options.",
    users: "Independent sellers and small businesses.",
    role: "Founder and builder.",
    approach: "STOS presents templates, a page studio, inquiry capture, and an Insights workflow for page views, actions, and leads.",
    outcome: "The public product website and template pages are live. Customer adoption and business impact are not independently measured here; AI suggestions are planned, not live.",
    proof: "Live product site and public template pages",
    technologies: ["Web product", "Page builder", "Lead workflow", "Analytics"],
    link: { label: "Visit STOS", href: "https://stosvn.vercel.app/stos" },
  },
  {
    id: "vibecode-kit",
    name: "Codex Vibecode Pro Max Kit",
    headline: "A repeatable way to build and verify product work.",
    status: "Public open-source tool",
    problem: "Small product teams need traceable planning, QA and release records.",
    users: "Developers and product teams using Codex.",
    role: "Maintainer of the public DUYTRUYENTHONG repository.",
    approach: "An offline JavaScript CLI, agent profiles, skills, templates and CI checks.",
    outcome: "Version 0.2.0 is public with successful GitHub Actions checks; adoption metrics are not claimed.",
    proof: "Public v0.2.0 repository with passing CI",
    technologies: ["JavaScript", "Node.js", "GitHub Actions", "Codex"],
    link: { label: "View repository", href: "https://github.com/DUYTRUYENTHONG/vibecode-product-kit" },
  },
  {
    id: "kkbox-baseline",
    name: "KKBox customer churn baseline",
    headline: "Churn predictions that respect the snapshot date.",
    status: "Local prototype · publication pending",
    problem: "Subscription churn decisions require customer-level features without future-data leakage.",
    users: "Analysts exploring retention models.",
    role: "Project owner; baseline developed with Codex assistance. The academic reference is credited separately.",
    approach: "A snapshot-date feature pipeline and a logistic-regression holdout evaluation.",
    outcome: "Synthetic-fixture checks cover future-event exclusion. Real KKBox model performance has not been measured.",
    proof: "Synthetic leakage check; real scores pending",
    technologies: ["Python", "Pandas", "scikit-learn", "CSV"],
  },
];

export const capabilities = [
  { group: "Languages & data", items: ["Python", "SQL", "JavaScript", "TypeScript", "Pandas"] },
  { group: "Applications", items: ["React", "Next.js", "APIs", "LLM and RAG prototypes"] },
  { group: "Sales & marketing", items: ["Sales funnels", "Google Business Profile", "TikTok Shop", "Content", "Lead workflows"] },
  { group: "Analytics & delivery", items: ["PostgreSQL", "Power BI", "DAX", "GitHub Actions", "Testing"] },
] as const;

export const funnelStages = [
  { number: "01", title: "Attract relevant traffic", detail: "Client discovery, local search presence, content, and TikTok/Facebook assets connect an offer with the people it serves.", source: "DUYTRUYENTHONG agency experience" },
  { number: "02", title: "Make the next step clear", detail: "Sales pages, service journeys, and inquiry paths help visitors understand the offer and contact the right person.", source: "Growth Commerce OS and STOS" },
  { number: "03", title: "Learn from the funnel", detail: "Customer data, lead signals, and analytics help teams find where the journey stalls and decide what to improve.", source: "Business analysis and data work" },
] as const;

export const cvTracks = [
  { title: "Applied AI engineering", detail: "LLM applications, retrieval workflows, Python, and customer analytics prototypes.", downloads: [{ label: "Download PDF", path: "cv-applied-ai-engineer.pdf" }] },
  { title: "Business and product", detail: "Digital marketing services, sales funnels, solution consulting, and commerce products.", downloads: [{ label: "Business & Product PDF", path: "cv-business-product.pdf" }, { label: "Business Development PDF", path: "cv-business-development.pdf" }], note: "The two supplied PDFs have identical content." },
  { title: "AI and prompt engineering", detail: "Prompt workflows, RAG concepts, enterprise troubleshooting, and AI-assisted delivery.", downloads: [{ label: "Download DOCX", path: "cv-prompt-engineer.docx" }] },
] as const;

export const principles = [
  "Make data ownership explicit",
  "Measure before claiming impact",
  "Protect customer information",
  "Build for reliability and speed",
] as const;
