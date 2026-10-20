import type { Metadata } from "next";
import { capabilities, identity, principles, projects } from "@/data/portfolio";
import { CopyEmail, CustomerCarousel, PortfolioGuide, ScrollStatement, SiteHeader, VisitorPicker, WorkSection } from "./experience";
import { AdaptiveHero } from "./adaptive-hero";
import { FunnelExperience } from "./funnel-experience";
import { WorkingHours } from "./working-hours";
import { PortraitReveal } from "./portrait-reveal";
import { CvDownloadSection } from "./cv-download-section";
import { HighlightsSection } from "./highlights-section";
import { AIExpertiseSection } from "./ai-expertise-section";
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
      <PortfolioGuide />
      <section className="hero" id="top" aria-labelledby="hero-title">
        <AdaptiveHero />
        <PortraitReveal />
      </section>

      <section className="identity-strip" aria-label="Featured work"><div className="identity-track"><span>GROWTH COMMERCE OS</span><span>STOS</span><span>CHỢ KÊNH</span><span>VIBECODE PRODUCT KIT</span><span>KKBOX CHURN BASELINE</span><span>DUYTRUYENTHONG</span><span>GROWTH COMMERCE OS</span><span>STOS</span></div></section>
      <VisitorPicker projects={projects} />
      <ScrollStatement />
      <section className="proof-ribbon" aria-label="Verified portfolio status"><div className="proof-track"><span>01 LIVE SERVICE WEBSITE <small>· Growth Commerce OS</small></span><span>01 LIVE PRODUCT WEBSITE <small>· STOS</small></span><span>01 LIVE MARKETPLACE WEBSITE <small>· Chợ Kênh</small></span><span>01 PUBLIC DEVELOPER TOOL <small>· Vibecode Product Kit</small></span><span>01 AUDITED ML BASELINE <small>· KKBox baseline</small></span></div></section>

      <HighlightsSection />

      <AIExpertiseSection />

      <section className="decision-map-wrap" aria-labelledby="map-title"><div className="decision-map section-shell"><div className="map-graphic" aria-hidden="true"><div className="map-orbit map-one"><span className="map-node">01</span></div><div className="map-orbit map-two"><span className="map-node">02</span></div><div className="map-orbit map-three"><span className="map-node">03</span></div></div><div className="map-copy"><p className="eyebrow">Where the work connects</p><h2 id="map-title">From signal to decision.</h2><ol><li><span>01</span> Collect and understand customer signals</li><li><span>02</span> Build reliable features and workflows</li><li><span>03</span> Put useful decisions in reach</li></ol></div></div></section>
      <WorkSection projects={projects} />

      <section className="funnel-section" id="funnel" aria-labelledby="funnel-title"><div className="section-shell"><div className="section-heading"><p className="eyebrow">What I do / sales and marketing</p><h2 id="funnel-title">From first impression to a useful conversation.</h2><p>I connect brand, content, product pages, proof, and measurement so people can understand an offer and take the next step.</p></div><FunnelExperience /></div></section>

      <CustomerCarousel />

      <section className="about-section" id="about" aria-labelledby="about-title"><div className="section-shell"><div className="section-heading"><p className="eyebrow">About the work</p><h2 id="about-title">Build with the evidence in view.</h2><p>I bring {identity.experience.digitalMarketing} and {identity.experience.aiEngineering}. I founded and operate DUYTRUYENTHONG agency, combining client discovery with websites, local search, content, TikTok Shop operations, and analytics. Solution consulting and technical support experience shape how I scope, test, and explain each system.</p></div><div className="about-grid">{principles.map((item, index) => <article key={item}><span>0{index + 1}</span><h3>{item}</h3><p>{index === 0 ? "Show sources, roles, and system boundaries." : index === 1 ? "Separate technical checks from business outcomes." : index === 2 ? "Use public evidence without exposing customer records." : "Make the next change testable and understandable."}</p></article>)}</div><div className="tools-row">{capabilities.map((group) => <div key={group.group}><strong>{group.group}</strong><span>{group.items.join(" · ")}</span></div>)}</div></div></section>

      <CvDownloadSection />

      <section className="notes-section section-shell" aria-labelledby="notes-title"><div className="section-heading"><p className="eyebrow">Notes from the build</p><h2 id="notes-title">A few decisions behind the work.</h2></div><div className="notes-grid"><article><span>01 / CUSTOMER DATA</span><h3>Predict from what was known then.</h3><p>The KKBox baseline aggregates events only through a selected snapshot date, with a synthetic check for future-data leakage.</p><a href="#project-kkbox-baseline">Explore KKBox ↗</a></article><article><span>02 / PRODUCT DELIVERY</span><h3>Make quality gates visible.</h3><p>The public Vibecode kit records plans, evidence, and checks so a release can be reviewed.</p><a href="https://github.com/DUYTRUYENTHONG/vibecode-product-kit">View the kit ↗</a></article><article><span>03 / COMMERCE</span><h3>Connect the system to the decision.</h3><p>Growth Commerce OS presents service workflows around content, channels, landing pages, and leads.</p><a href={identity.service}>Visit the service site ↗</a></article></div></section>
      <section className="contact-section" id="contact" aria-labelledby="contact-title"><div className="section-shell contact-shell"><p className="eyebrow">Contact</p><h2 id="contact-title">Have an engineering role or product challenge in mind? Let's talk.</h2><a className="contact-email" href={`mailto:${identity.email}`}>{identity.email} <span aria-hidden="true">↗</span></a><CopyEmail email={identity.email} /><WorkingHours variant="contact" /><div className="contact-prompts"><p>NOT SURE WHAT TO SAY? START HERE.</p><a href={`mailto:${identity.email}?subject=Engineering%20opportunity`}>Discuss an engineering role ↗</a><a href={`mailto:${identity.email}?subject=AI%20and%20commerce%20workflow`}>Ask about an AI workflow ↗</a></div><div className="social-links"><a href={identity.github}>GitHub ↗</a><a href={identity.service}>Service website ↗</a><a href="#cvs">View CVs ↗</a></div></div></section>
    </main>
    <footer className="site-footer"><span>Ali Nguyen · DUYTRUYENTHONG</span><span>© {new Date().getFullYear()}</span><a href={`${basePath}/credits/`}>Credits</a><a href="#top">Back to top ↑</a></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
  </>;
}
