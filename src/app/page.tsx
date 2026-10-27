import type { Metadata } from "next";
import { identity, projects } from "@/data/portfolio";
import { CopyEmail, OwnerWelcome, PortfolioGuide, ScrollStatement, SiteHeader, VisitorPicker, WorkSection } from "./experience";
import { AdaptiveHero } from "./adaptive-hero";
import { FunnelExperience } from "./funnel-experience";
import { WorkingHours } from "./working-hours";
import { PortraitReveal } from "./portrait-reveal";
import { CvDownloadSection } from "./cv-download-section";
import { HighlightsSection } from "./highlights-section";
import { CommunityResourceSection } from "./community-resource-section";
import { AIExpertiseSection } from "./ai-expertise-section";
import { CustomerCollaborationSection } from "./customer-collaboration-section";
import { AboutWorkSection } from "./about-work-section";
import { BuildNotesSection, DecisionMapSection } from "./visual-communication";
import { SectionAnchorAlign } from "./section-anchor-align";
import "./funnel.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = { alternates: { canonical: siteUrl } };

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org", "@type": "Person", name: identity.name,
    alternateName: identity.brand, jobTitle: identity.title,
    description: identity.proposition, email: identity.email,
    sameAs: [identity.github, identity.service, identity.stos, identity.choKenh],
  };

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader />
    <main id="main" className="portfolio-main">
      <SectionAnchorAlign />
      <PortfolioGuide />
      <section className="hero" id="top" aria-labelledby="hero-title">
        <OwnerWelcome />
        <AdaptiveHero />
        <PortraitReveal />
      </section>

      <section className="identity-strip" aria-label="Featured work"><div className="identity-track"><span>GROWTH COMMERCE OS</span><span>STOS</span><span>CHỢ KÊNH</span><span>VIBECODE PRODUCT KIT</span><span>KKBOX CHURN BASELINE</span><span>DUYTRUYENTHONG</span><span aria-hidden="true">GROWTH COMMERCE OS</span><span aria-hidden="true">STOS</span></div></section>
      <VisitorPicker projects={projects} />
      <ScrollStatement />
      <section className="proof-ribbon" aria-label="Project status"><div className="proof-track"><span>01 LIVE SERVICE WEBSITE <small>· Growth Commerce OS</small></span><span>01 LIVE PRODUCT WEBSITE <small>· STOS</small></span><span>01 LIVE MARKETPLACE WEBSITE <small>· Chợ Kênh</small></span><span>01 PUBLIC DEVELOPER TOOL <small>· Vibecode Product Kit</small></span><span>01 AUDITED ML BASELINE <small>· KKBox baseline</small></span></div></section>

      <HighlightsSection />

      <WorkSection projects={projects} />

      <AIExpertiseSection />

      <CommunityResourceSection />

      <DecisionMapSection />

      <section className="funnel-section" id="funnel" aria-labelledby="funnel-title"><div className="section-shell"><div className="section-heading"><p className="eyebrow">What I do / sales and marketing</p><h2 id="funnel-title">From first impression to a useful conversation.</h2><p>I connect brand, content, product pages, proof, and measurement so people can understand an offer and take the next step.</p></div><FunnelExperience /></div></section>

      <CustomerCollaborationSection />

      <AboutWorkSection />

      <CvDownloadSection />

      <BuildNotesSection />
      <section className="contact-section" id="contact" aria-labelledby="contact-title"><div className="section-shell contact-shell"><p className="eyebrow">Contact</p><h2 id="contact-title">Have an engineering role or product challenge in mind? Let's talk.</h2><a className="contact-email" href={`mailto:${identity.email}`}>{identity.email} <span aria-hidden="true">↗</span></a><CopyEmail email={identity.email} /><WorkingHours variant="contact" /><div className="contact-prompts"><p>NOT SURE WHAT TO SAY? START HERE.</p><a href={`mailto:${identity.email}?subject=Engineering%20opportunity`}>Discuss an engineering role ↗</a><a href={`mailto:${identity.email}?subject=AI%20and%20commerce%20workflow`}>Ask about an AI workflow ↗</a></div><div className="social-links"><a href={identity.github}>GitHub ↗</a><a href={identity.service}>Service website ↗</a><a href="#cvs">View CVs ↗</a></div></div></section>
    </main>
    <footer className="site-footer"><span>Ali Nguyen · DUYTRUYENTHONG</span><span>© {new Date().getFullYear()}</span><a href={`${basePath}/credits/`}>Credits</a><a href="#top">Back to top ↑</a></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
  </>;
}
