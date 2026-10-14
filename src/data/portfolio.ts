export type Project = {
  id: string;
  name: string;
  status: string;
  problem: string;
  users: string;
  role: string;
  approach: string;
  outcome: string;
  technologies: string[];
  link?: { label: string; href: string };
};

export const identity = {
  name: "Ali Nguyen",
  brand: "DUYTRUYENTHONG",
  title: "AI & Data Engineer for E-commerce",
  proposition:
    "I build AI and data systems that help e-commerce businesses understand customers, automate decisions, optimize operations and grow revenue.",
  email: "nquangd1510@gmail.com",
  github: "https://github.com/DUYTRUYENTHONG",
  service: "https://growth-commerce-os.vercel.app/",
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
    status: "Live service website",
    problem: "Commerce teams need a clearer path from content and channels to leads.",
    users: "Businesses exploring digital growth services.",
    role: "Founder and product operator.",
    approach: "A public service site presents CMS, landing, portfolio and channel workflows with working demo links.",
    outcome: "Live service pages and demo links are available. Adoption and business impact are not independently measured here.",
    technologies: ["Web products", "CMS workflows", "Analytics"],
    link: { label: "Visit service site", href: "https://growth-commerce-os.vercel.app/" },
  },
  {
    id: "vibecode-kit",
    name: "Codex Vibecode Pro Max Kit",
    status: "Public open-source tool",
    problem: "Small product teams need traceable planning, QA and release records.",
    users: "Developers and product teams using Codex.",
    role: "Maintainer of the public DUYTRUYENTHONG repository.",
    approach: "An offline JavaScript CLI, agent profiles, skills, templates and CI checks.",
    outcome: "Version 0.2.0 is public with successful GitHub Actions checks; adoption metrics are not claimed.",
    technologies: ["JavaScript", "Node.js", "GitHub Actions", "Codex"],
    link: { label: "View repository", href: "https://github.com/DUYTRUYENTHONG/vibecode-product-kit" },
  },
  {
    id: "kkbox-baseline",
    name: "KKBox customer churn baseline",
    status: "Local prototype · publication pending",
    problem: "Subscription churn decisions require customer-level features without future-data leakage.",
    users: "Analysts exploring retention models.",
    role: "Project owner; baseline developed with Codex assistance. The academic reference is credited separately.",
    approach: "A snapshot-date feature pipeline and a logistic-regression holdout evaluation.",
    outcome: "Synthetic-fixture checks cover future-event exclusion. Real KKBox model performance has not been measured.",
    technologies: ["Python", "Pandas", "scikit-learn", "CSV"],
  },
];

export const capabilities = [
  { group: "Languages & data", items: ["Python", "SQL", "JavaScript", "TypeScript", "Pandas"] },
  { group: "Applications", items: ["React", "Next.js", "APIs", "LLM and RAG prototypes"] },
  { group: "Analytics", items: ["PostgreSQL", "Power BI", "DAX", "scikit-learn"] },
  { group: "Delivery", items: ["GitHub Actions", "Testing", "Documentation", "Cloud deployment"] },
] as const;

export const principles = [
  "Make data ownership explicit",
  "Measure before claiming impact",
  "Protect customer information",
  "Build for reliability and speed",
] as const;
