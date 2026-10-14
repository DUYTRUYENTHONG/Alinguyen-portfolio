import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { identity, projects } from "@/data/portfolio";
import { CaseDepth, type CaseDetail } from "@/app/case-depth";
import { ProjectVisual, SiteHeader } from "@/app/experience";

export const dynamicParams = false;
export function generateStaticParams() { return projects.map((project) => ({ slug: project.id })); }

const details: Record<string, CaseDetail> = {
  stos: {
    context: "Independent sellers and small businesses need a shareable page that introduces their offer and gives visitors a way to make contact.",
    decision: "Bring the seller's story, products, inquiry path, and basic funnel visibility into one product journey.",
    implementation: "The public STOS site presents templates, a Studio for page personalization, inquiry capture, and an Insights dashboard for page views, CTA actions, and leads.",
    evidence: "The product site, template pages, and feature descriptions are publicly accessible. Ali Nguyen identifies his role as founder and builder.",
    limits: "The site's displayed analytics figures are labeled illustrative. Customer adoption and business outcomes are not claimed. AI recommendations are described as planned, not live.",
    next: "Add documented usage or outcome measures when their period, source, and method are available.",
  },
  "growth-commerce-os": {
    context: "Commerce teams need a clearer path from content and channels to leads. The public DUYTRUYENTHONG service site presents that journey and links to related demos.",
    decision: "Put the service journey in one place so a visitor can move from an offer to a relevant product or demo.",
    implementation: "The live site presents CMS, landing, portfolio, and channel workflows. This case study describes the public site and the owner's product role; it does not claim private usage data.",
    evidence: "The service website is publicly reachable. Its pages and demo links can be reviewed directly.",
    limits: "Customer adoption, revenue impact, and operational usage are not independently verified in this portfolio.",
    next: "Add source-backed usage or outcome data only when the owner can document the measure, period, and method.",
  },
  "vibecode-kit": {
    context: "Small product teams need planning and release evidence that can be inspected after a change ships.",
    decision: "Keep the tool usable offline and make the workflow legible through a CLI, profiles, skills, and templates.",
    implementation: "The public repository contains a JavaScript CLI, Codex profiles and skills, templates, tests, and GitHub Actions checks.",
    evidence: "Version 0.2.0 and passing GitHub Actions checks are visible in the public repository.",
    limits: "Downloads, adoption, and team productivity effects are not claimed.",
    next: "Publish a source-backed usage example and a reproducible before-and-after workflow when available.",
  },
  "kkbox-baseline": {
    context: "A churn model can look strong for the wrong reason if its features include events that happened after the prediction date.",
    decision: "Start with a snapshot-date baseline before comparing more complex models.",
    implementation: "The local Python prototype aggregates transaction and listening events through a selected snapshot date, then defines a logistic-regression holdout evaluation.",
    evidence: "A synthetic fixture checks that future events are excluded. The third-party academic reference is credited separately.",
    limits: "No real KKBox dataset score or business outcome is claimed. The raw competition data is not redistributed.",
    next: "Run the pipeline on eligible data, record reproducible holdout metrics, and document the evaluation period and leakage checks.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.id === slug);
  if (!project) return {};
  return { title: `${project.name} case study | ${identity.name}`, description: project.problem };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.id === slug);
  const detail = details[slug];
  if (!project || !detail) notFound();
  return <>
    <a className="skip-link" href="#case-main">Skip to content</a>
    <SiteHeader inner />
    <main id="case-main" className="case-page">
      <section className={`case-hero case-hero-${slug}`}>
        <div className="case-hero-inner section-shell"><Link className="case-back" href="/#work">← Back to selected work</Link><p className="case-status">{project.status}</p><h1>{project.headline}</h1><p>{project.problem}</p><ProjectVisual id={project.id} /></div>
      </section>
      <div className="case-body section-shell">
        <div className="case-facts"><div><span>PROJECT</span><strong>{project.name}</strong></div><div><span>ROLE</span><strong>{project.role}</strong></div><div><span>STATUS</span><strong>{project.status}</strong></div><div><span>PROOF</span><strong>{project.proof}</strong></div></div>
        <CaseDepth detail={detail} />
        <div className="case-links">{project.link && <a href={project.link.href}>{project.link.label} ↗</a>}<Link href="/#work">Back to all work ↑</Link></div>
      </div>
    </main>
    <footer className="site-footer"><span>Ali Nguyen · DUYTRUYENTHONG</span><a href={`mailto:${identity.email}`}>Get in touch ↗</a></footer>
  </>;
}
