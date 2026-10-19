import type { Metadata } from "next";
import { capabilities, cvTracks, expertise, identity, principles, projects } from "@/data/portfolio";
import { CopyEmail, CustomerCarousel, PortfolioGuide, ScrollStatement, SiteHeader, VisitorPicker, WorkSection } from "./experience";
import { AdaptiveHero } from "./adaptive-hero";
import { FunnelExperience } from "./funnel-experience";
import { WorkingHours } from "./working-hours";
import { PortraitReveal } from "./portrait-reveal";
import "./funnel.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = { alternates: { canonical: siteUrl } };

const highlights = [
  { icon: "↗", title: "Growth Commerce OS", description: "A live service website for the DUYTRUYENTHONG brand.", href: identity.service, link: "Visit site" },
  { icon: "⌘", title: "Vibecode Product Kit", description: "A public developer tool with an offline CLI and CI checks.", href: "https://github.com/DUYTRUYENTHONG/vibecode-product-kit", link: "View source" },
  { icon: "◉", title: "KKBox baseline", description: "A local churn prototype with a snapshot-date leakage check.", href: "#project-kkbox-baseline", link: "See project" },
  { icon: "✦", title: "STOS", description: "A live sales page product for independent sellers and small businesses.", href: identity.stos, link: "Visit product" },
  { icon: "◇", title: "Chợ Kênh", description: "A live TikTok channel catalog with manual intermediary inquiries.", href: identity.choKenh, link: "Visit marketplace" },
  { icon: "✓", title: "Open process", description: "Reproducible baselines, readable code, and explicit limits.", href: "#about", link: "Read approach" },
];

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
      <section className="proof-ribbon" aria-label="Verified portfolio status"><div className="proof-track"><span>01 LIVE SERVICE WEBSITE <small>· Growth Commerce OS</small></span><span>01 LIVE PRODUCT WEBSITE <small>· STOS</small></span><span>01 LIVE MARKETPLACE WEBSITE <small>· Chợ Kênh</small></span><span>01 PUBLIC DEVELOPER TOOL <small>· Vibecode Product Kit</small></span><span>01 LOCAL ML PROTOTYPE <small>· KKBox baseline</small></span></div></section>

      <section className="highlights" id="highlights" aria-labelledby="highlights-title"><div className="section-shell"><h2 id="highlights-title">Highlights</h2><div className="highlight-grid"><article className="highlight-feature"><span className="highlight-icon">✦</span><div><strong>5</strong><p>featured builds across commerce products, open-source tooling, and customer analytics.</p></div></article>{highlights.map((card) => <article className="highlight-card" key={card.title}><span className={`highlight-icon${card.title === "Chợ Kênh" ? " highlight-icon-cho" : card.title === "STOS" ? " highlight-icon-stos" : card.title === "Vibecode Product Kit" ? " highlight-icon-vibecode" : ""}`}>{card.title === "Growth Commerce OS" ? <img src={`${basePath}/duytruyenthong-logo.png`} alt="" width="52" height="52" /> : card.title === "Vibecode Product Kit" ? <img src={`${basePath}/vibecode-product-kit-logo.svg`} alt="" width="52" height="52" /> : card.title === "KKBox baseline" ? <img src={`${basePath}/kkbox-logo.png`} alt="" width="52" height="52" /> : card.title === "STOS" ? <img src={`${basePath}/stos-logo-dark.png`} alt="" width="70" height="45" /> : card.title === "Chợ Kênh" ? <img src={`${basePath}/cho-kenh-logo.png`} alt="" width="109" height="79" /> : card.icon}</span><h3>{card.title}</h3><p>{card.description}</p><a href={card.href}>{card.link} <span aria-hidden="true">↗</span></a></article>)}</div></div></section>

      <section className="ai-expertise" id="ai-expertise" aria-labelledby="ai-expertise-title"><div className="section-shell"><div className="ai-expertise-intro"><p className="eyebrow">Applied AI expertise</p><h2 id="ai-expertise-title">What I build, and how I check it.</h2><p>My work spans early AI prototypes, customer data, developer tooling, and commerce products. Each example below names the part that is working today and the part that still needs evidence.</p></div><div className="ai-expertise-grid">{expertise.map((item) => <article key={item.number}><span className="ai-expertise-number">{item.number} / 04</span><h3>{item.title}</h3><p>{item.detail}</p><a href={item.href}>{item.linkLabel} <span aria-hidden="true">↗</span></a></article>)}</div></div></section>

      <section className="decision-map-wrap" aria-labelledby="map-title"><div className="decision-map section-shell"><div className="map-graphic" aria-hidden="true"><div className="map-orbit map-one"><span className="map-node">01</span></div><div className="map-orbit map-two"><span className="map-node">02</span></div><div className="map-orbit map-three"><span className="map-node">03</span></div></div><div className="map-copy"><p className="eyebrow">Where the work connects</p><h2 id="map-title">From signal to decision.</h2><ol><li><span>01</span> Collect and understand customer signals</li><li><span>02</span> Build reliable features and workflows</li><li><span>03</span> Put useful decisions in reach</li></ol></div></div></section>
      <WorkSection projects={projects} />

      <section className="funnel-section" aria-labelledby="funnel-title"><div className="section-shell"><div className="section-heading"><p className="eyebrow">What I do / sales and marketing</p><h2 id="funnel-title">From first impression to a useful conversation.</h2><p>I connect brand, content, product pages, proof, and measurement so people can understand an offer and take the next step.</p></div><FunnelExperience /></div></section>

      <CustomerCarousel />

      <section className="about-section" id="about" aria-labelledby="about-title"><div className="section-shell"><div className="section-heading"><p className="eyebrow">About the work</p><h2 id="about-title">Build with the evidence in view.</h2><p>I bring {identity.experience.digitalMarketing} and {identity.experience.aiEngineering}. I founded and operate DUYTRUYENTHONG agency, combining client discovery with websites, local search, content, TikTok Shop operations, and analytics. Solution consulting and technical support experience shape how I scope, test, and explain each system.</p></div><div className="about-grid">{principles.map((item, index) => <article key={item}><span>0{index + 1}</span><h3>{item}</h3><p>{index === 0 ? "Show sources, roles, and system boundaries." : index === 1 ? "Separate technical checks from business outcomes." : index === 2 ? "Use public evidence without exposing customer records." : "Make the next change testable and understandable."}</p></article>)}</div><div className="tools-row">{capabilities.map((group) => <div key={group.group}><strong>{group.group}</strong><span>{group.items.join(" · ")}</span></div>)}</div></div></section>

      <section className="cv-section" id="cvs" aria-labelledby="cv-title"><div className="section-shell"><div className="section-heading"><p className="eyebrow">Downloadable CVs</p><h2 id="cv-title">Different roles, one body of work.</h2><p>Choose the CV closest to your conversation with me. The supplied documents use the name Nguyen Quang Duy.</p></div><div className="cv-grid">{cvTracks.map((track, index) => <article className="cv-card" key={track.title}><span className="cv-index">0{index + 1} / CV</span><h3>{track.title}</h3><p>{track.detail}</p><div className="cv-downloads">{track.downloads.map((file) => <a key={file.path} href={`${basePath}/${file.path}`} download>{file.label} <span aria-hidden="true">↓</span></a>)}</div>{"note" in track && <small>{track.note}</small>}</article>)}</div></div></section>

      <section className="notes-section section-shell" aria-labelledby="notes-title"><div className="section-heading"><p className="eyebrow">Notes from the build</p><h2 id="notes-title">A few decisions behind the work.</h2></div><div className="notes-grid"><article><span>01 / CUSTOMER DATA</span><h3>Predict from what was known then.</h3><p>The KKBox baseline aggregates events only through a selected snapshot date, with a synthetic check for future-data leakage.</p><a href="#project-kkbox-baseline">Explore KKBox ↗</a></article><article><span>02 / PRODUCT DELIVERY</span><h3>Make quality gates visible.</h3><p>The public Vibecode kit records plans, evidence, and checks so a release can be reviewed.</p><a href="https://github.com/DUYTRUYENTHONG/vibecode-product-kit">View the kit ↗</a></article><article><span>03 / COMMERCE</span><h3>Connect the system to the decision.</h3><p>Growth Commerce OS presents service workflows around content, channels, landing pages, and leads.</p><a href={identity.service}>Visit the service site ↗</a></article></div></section>
      <section className="contact-section" id="contact" aria-labelledby="contact-title"><div className="section-shell contact-shell"><p className="eyebrow">Contact</p><h2 id="contact-title">Have an engineering role or product challenge in mind? Let's talk.</h2><a className="contact-email" href={`mailto:${identity.email}`}>{identity.email} <span aria-hidden="true">↗</span></a><CopyEmail email={identity.email} /><WorkingHours variant="contact" /><div className="contact-prompts"><p>NOT SURE WHAT TO SAY? START HERE.</p><a href={`mailto:${identity.email}?subject=Engineering%20opportunity`}>Discuss an engineering role ↗</a><a href={`mailto:${identity.email}?subject=AI%20and%20commerce%20workflow`}>Ask about an AI workflow ↗</a></div><div className="social-links"><a href={identity.github}>GitHub ↗</a><a href={identity.service}>Service website ↗</a><a href="#cvs">View CVs ↗</a></div></div></section>
    </main>
    <footer className="site-footer"><span>Ali Nguyen · DUYTRUYENTHONG</span><span>© {new Date().getFullYear()}</span><a href={`${basePath}/credits/`}>Credits</a><a href="#top">Back to top ↑</a></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
  </>;
}
