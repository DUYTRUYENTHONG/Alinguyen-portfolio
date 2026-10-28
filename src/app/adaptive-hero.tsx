"use client";

import { identity } from "@/data/portfolio";
import { usePortfolioRole } from "./experience";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const messages = {
  general: {
    description: "I turn customer problems into testable AI prototypes, data workflows, developer tools, and live commerce products. Explore the decisions and evidence behind each build.",
    action: "Explore engineering work",
    href: "#featured-work",
  },
  recruiter: {
    description: "See the code, product decisions, and limits behind my applied AI and commerce work. Start with the projects most useful for evaluating engineering fit.",
    action: "Explore engineering work",
    href: "#featured-work",
  },
  engineering: {
    description: "Explore a public developer tool, reproducible checks, and the implementation decisions behind my applied AI and commerce projects.",
    action: "Explore the developer tool",
    href: "#project-vibecode-kit",
  },
  commerce: {
    description: "Explore live commerce products and the customer workflows behind them, from service discovery to useful conversations.",
    action: "Explore commerce work",
    href: "#project-growth-commerce-os",
  },
  data: {
    description: "See how I turn customer signals into testable features and decisions, including a churn prototype with a snapshot-date leakage check.",
    action: "Explore the data case study",
    href: "#project-kkbox-baseline",
  },
  admissions: {
    description: "Explore my applied AI and data work through reproducible methods, explicit limitations, and projects that show how I learn and build.",
    action: "Explore applied AI work",
    href: "#ai-expertise",
  },
} as const;

const roleAudience: Record<string, keyof typeof messages> = {
  Recruiter: "recruiter",
  Founder: "commerce",
  Engineer: "engineering",
  "Product designer": "commerce",
  Marketer: "commerce",
  Growth: "commerce",
  Data: "data",
  Investor: "commerce",
  Student: "admissions",
  "Fellow builder": "engineering",
  "Just curious": "general",
};

export function AdaptiveHero() {
  const { selected, chosen, entry, ready } = usePortfolioRole();
  const audience = ready ? (chosen ? roleAudience[selected] ?? "general" : entry) : "general";
  const message = messages[audience];

  return <div className="hero-copy section-shell">
    <h1 id="hero-title">Ali Nguyen builds applied AI &amp; digital products.</h1>
    <p className="hero-meta">{message.description}</p>
    <div className="hero-actions"><a className="hero-action-primary" href={message.href}>{message.action} <span aria-hidden="true">↗</span></a><a className="hero-action-secondary" href={`${basePath}/cv-applied-ai-engineer.pdf`} download>Download AI CV <span aria-hidden="true">↓</span></a></div>
    <p className="hero-experience"><span>{identity.experience.digitalMarketing}</span><span>{identity.experience.aiEngineering}</span></p>
  </div>;
}
