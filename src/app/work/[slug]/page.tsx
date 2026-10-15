import type { Metadata } from "next";
import { PortfolioLink as Link } from "@/app/portfolio-link";
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
  "cho-kenh": {
    context: "Buyers comparing TikTok channels need useful public signals without exposing sensitive account details. Sellers need a route to discuss proof and transfer conditions.",
    decision: "Pair a searchable channel catalog with a human-reviewed intermediary inquiry path instead of presenting a transfer as a one-click purchase.",
    implementation: "The public site shows category, budget, follower, view, engagement, risk, and audit filters; listing detail pages; Zalo contact paths; and a separate page that explains the manual deal review process. The site states that automated checkout and escrow are unavailable. AI tools and courses are planned additions, not live offerings.",
    evidence: "The channel catalog and intermediary information page were reviewed on the live Chợ Kênh site. Ali Nguyen supplied the Chợ Kênh logo and identified the product as his business.",
    limits: "Listing figures are public site content and require the team's confirmation before a deal. No completed transaction count or buyer outcome is claimed. AI tools and courses are coming soon; they are not presented as live products.",
    next: "Publish AI tools or courses only when their pages and delivery are live, and add transaction outcomes only with a documented source and period.",
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

const projectMedia: Record<string, { file: string; label: string }[]> = {
  "growth-commerce-os": [
    { file: "duytruyenthong-site-2026.png", label: "DUYTRUYENTHONG service website" },
  ],
  stos: [
    { file: "stos-home-desktop-2026.png", label: "STOS landing page on desktop" },
    { file: "stos-home-mobile-2026.png", label: "STOS landing page on mobile" },
    { file: "stos-templates-desktop-2026.png", label: "STOS template gallery on desktop" },
    { file: "stos-login-2026.png", label: "STOS sign-in screen" },
    { file: "stos-signup-2026.png", label: "STOS registration screen" },
  ],
  "cho-kenh": [
    { file: "cho-kenh-home-2026.png", label: "Chợ Kênh homepage and featured channels" },
    { file: "cho-kenh-catalog-2026.png", label: "Chợ Kênh channel catalog and filters" },
    { file: "cho-kenh-buying-flow-2026.png", label: "Chợ Kênh buying steps" },
    { file: "cho-kenh-some-process-2026.png", label: "Chợ Kênh intermediary review process" },
    { file: "cho-kenh-trust-layer-2026.png", label: "Chợ Kênh transaction safeguards" },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.id === slug);
  if (!project) return {};
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return { title: `${project.name} case study | ${identity.name}`, description: project.problem, alternates: { canonical: `${siteUrl}/work/${slug}/` }, openGraph: { title: `${project.name} case study | ${identity.name}`, description: project.problem, images: [`${siteUrl}/opengraph-image.png`] } };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.id === slug);
  const detail = details[slug];
  const media = projectMedia[slug] ?? [];
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!project || !detail) notFound();
  return <>
    <a className="skip-link" href="#case-main">Skip to content</a>
    <SiteHeader inner />
    <main id="case-main" className="case-page">
      <section className={`case-hero case-hero-${slug}`}>
        <div className="case-hero-inner section-shell"><Link className="case-back" href="/#work">← Back to selected work</Link><p className="case-status">{project.status}</p><p className="case-project-name">{project.name}</p><h1>{project.headline}</h1><p>{project.problem}</p><ProjectVisual id={project.id} /></div>
      </section>
      <div className="case-body section-shell">
        <div className="case-facts"><div><span>PROJECT</span><strong>{project.name}</strong></div><div><span>ROLE</span><strong>{project.role}</strong></div><div><span>STATUS</span><strong>{project.status}</strong></div><div><span>PROOF</span><strong>{project.proof}</strong></div><div className="case-tech"><span>BUILT WITH</span><strong>{project.technologies.join(" · ")}</strong></div></div>
        <CaseDepth detail={detail} />
        {media.length > 0 && <section className="case-media" aria-labelledby="case-media-title"><div className="case-media-heading"><p className="eyebrow">Product evidence</p><h2 id="case-media-title">See the live product journey.</h2><p>Owner-supplied captures. Select a screenshot to view it at full size.</p></div><div className="case-media-grid">{media.map((item) => <figure key={item.file}><a href={`${basePath}/${item.file}`} target="_blank" rel="noopener noreferrer" aria-label={`Open full screenshot: ${item.label}`}><img src={`${basePath}/${item.file.replace(/\.png$/, "-preview.webp")}`} alt={item.label} loading="lazy" decoding="async" /></a><figcaption>{item.label} ↗</figcaption></figure>)}</div></section>}
        <div className="case-links">{project.link && <a href={project.link.href}>{project.link.label} ↗</a>}<Link href="/#work">Back to all work ↑</Link></div>
      </div>
    </main>
    <footer className="site-footer"><span>Ali Nguyen · DUYTRUYENTHONG</span><a href={`mailto:${identity.email}`}>Get in touch ↗</a></footer>
  </>;
}
