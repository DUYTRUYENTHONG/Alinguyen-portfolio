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
  title: "Applied AI and Product Engineer",
  experience: {
    digitalMarketing: "4+ years in digital marketing",
    aiEngineering: "2+ years in AI engineering and product building",
  },
  proposition:
    "Applied AI prototypes, developer tools, and live commerce products, built with a background in digital marketing and sales workflows.",
  email: "nquangd1510@gmail.com",
  github: "https://github.com/DUYTRUYENTHONG",
  service: "https://growth-commerce-os.vercel.app/en",
  stos: "https://stosvn.vercel.app/stos",
  choKenh: "https://growth-commerce-os.vercel.app/cho-kenh",
} as const;

export const customers = [
  { name: "Vựa Sầu Riêng Cô Ba", logo: "customer-co-ba.webp", href: "https://www.tiktok.com/@sauriengcoba206" },
  { name: "Vựa Sầu Riêng Bà Chi", logo: "customer-ba-chi.webp" },
  { name: "Vựa Sầu Riêng Đại An", logo: "customer-dai-an.png" },
  { name: "Hãng xe Toàn Thắng", logo: "customer-toan-thang.svg", href: "https://toanthangcar.com/" },
  { name: "4U Home", logo: "customer-4u-home.png" },
  { name: "Xây dựng Hưng Phú Thịnh", logo: "customer-hung-phu-thinh.png", href: "https://hungphuthinh.vn/" },
  { name: "Xây dựng Biên Lan", logo: "customer-bien-lan.png", href: "https://bienlan.vn/" },
  { name: "Hệ thống Dê Cúc Phương City", logo: "customer-de-cuc-phuong.png" },
  { name: "Bản Tôi", logo: "customer-ban-toi.png" },
  { name: "Nhà hàng tiệc cưới Pacific · Bến Cát" },
  { name: "Nhà hàng tiệc cưới Bách Việt", logo: "customer-bach-viet.png", href: "https://bachviet.com.vn/" },
  { name: "Zalo Official Account", logo: "customer-zalo-oa.webp" },
  { name: "Vantage", logo: "customer-vantage.webp" },
  { name: "Dupoin", logo: "customer-dupoin.webp" },
  { name: "DBG Markets", logo: "customer-dbg-markets.webp" },
] as const;

export const expertise = [
  {
    number: "01",
    title: "LLM and retrieval prototypes",
    detail: "Design a knowledge-assistant flow from source retrieval to a grounded answer, then review responses against representative questions. This work is a prototype, not a deployed support service.",
    linkLabel: "AI and prompt engineering CV",
    href: "#cvs",
  },
  {
    number: "02",
    title: "Evaluation before prediction",
    detail: "Build customer features through a chosen snapshot date, test that later events stay out, and audit the real-data holdout. The KKBox baseline reached 0.217324 log loss on an official-data local split.",
    linkLabel: "KKBox results",
    href: "#project-kkbox-baseline",
  },
  {
    number: "03",
    title: "AI-assisted product delivery",
    detail: "Turn an idea into a reviewable build with an offline CLI, agent profiles, templates and CI checks. Vibecode Product Kit is public; adoption is not measured here.",
    linkLabel: "Public source and CI",
    href: "https://github.com/DUYTRUYENTHONG/vibecode-product-kit",
  },
  {
    number: "04",
    title: "From signal to action",
    detail: "Connect page views, actions and leads to a seller workflow in STOS, while keeping proposed AI suggestions separate from features that are live today.",
    linkLabel: "Live STOS product",
    href: "https://stosvn.vercel.app/stos",
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
    link: { label: "Visit service site", href: "https://growth-commerce-os.vercel.app/en" },
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
    id: "cho-kenh",
    name: "Chợ Kênh",
    headline: "A clearer way to discover and discuss TikTok channel deals.",
    status: "Live marketplace website",
    problem: "A digital-products marketplace currently focused on TikTok channels, where buyers and sellers can compare listings and discuss ownership, risk, and deal terms.",
    users: "TikTok channel buyers, sellers, and small commerce operators.",
    role: "Owner and product builder.",
    approach: "The live catalog offers channel filters, visible audit and risk indicators, detail pages, and Zalo inquiry paths. A separate intermediary page explains a manual proof and deal review process. AI tools and courses are planned additions.",
    outcome: "The catalog and intermediary information pages are publicly accessible. Completed transactions, automated checkout, escrow, and business results are not claimed.",
    proof: "Live channel catalog and manual intermediary service page",
    technologies: ["Web marketplace", "Search and filtering", "Lead workflow"],
    link: { label: "Visit Chợ Kênh", href: "https://growth-commerce-os.vercel.app/cho-kenh" },
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
    status: "Public source · official-data local holdout",
    problem: "Subscription churn decisions require customer-level features without future-data leakage.",
    users: "Analysts exploring retention models.",
    role: "Project owner; baseline developed with Codex assistance. The academic reference is credited separately.",
    approach: "Snapshot-date features from transactions and listening history, a source-coverage audit, and a fixed logistic-regression holdout.",
    outcome: "On 970,960 official-data labels, the within-cohort holdout reached 0.217324 log loss and 0.819295 ROC AUC. This is not an out-of-time or business-impact result.",
    proof: "Public source, leakage tests, input hashes, and measured local holdout",
    technologies: ["Python", "DuckDB", "Pandas", "scikit-learn"],
    link: { label: "View source and verified results", href: "https://github.com/DUYTRUYENTHONG/kkbox-customer-churn-prediction/blob/main/docs/RESULTS.md" },
  },
];

export const capabilities = [
  { group: "Languages & data", items: ["Python", "SQL", "JavaScript", "TypeScript", "Pandas"] },
  { group: "Applications", items: ["React", "Next.js", "APIs", "LLM and RAG prototypes"] },
  { group: "Sales & marketing", items: ["Sales funnels", "Google Business Profile", "TikTok Shop", "Content", "Lead workflows"] },
  { group: "Analytics & delivery", items: ["PostgreSQL", "Power BI", "DAX", "GitHub Actions", "Testing"] },
] as const;

export const cvTracks = [
  { title: "Applied AI engineering", detail: "LLM applications, retrieval workflows, Python, and customer analytics prototypes.", downloads: [{ label: "Download PDF", path: "cv-applied-ai-engineer.pdf", format: "PDF" }] },
  { title: "Business and product", detail: "Digital marketing services, sales funnels, solution consulting, and commerce products.", downloads: [{ label: "Business & Product PDF", path: "cv-business-product.pdf", format: "PDF", focus: "Client needs, product scoping, and reviewable commerce builds." }, { label: "Business Development PDF", path: "cv-business-development.pdf", format: "PDF", focus: "Client discovery, offer positioning, and solution consulting." }], note: "Choose product delivery or client-facing business development." },
  { title: "AI and prompt engineering", detail: "Prompt workflows, RAG concepts, enterprise troubleshooting, and AI-assisted delivery.", downloads: [{ label: "Download DOCX", path: "cv-prompt-engineer.docx", format: "DOCX" }] },
] as const;

export const principles = [
  { title: "Make data ownership explicit", detail: "Show sources, roles, and system boundaries." },
  { title: "Measure before claiming impact", detail: "Separate technical checks from business outcomes." },
  { title: "Protect customer information", detail: "Use public evidence without exposing customer records." },
  { title: "Build for reliability and speed", detail: "Make the next change testable and understandable." },
] as const;
