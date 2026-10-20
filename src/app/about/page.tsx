import type { Metadata } from "next";
import { PortfolioLink as Link } from "../portfolio-link";
import { cvTracks, identity } from "@/data/portfolio";
import { SiteHeader } from "../experience";
import { WorkConnectsSection } from "./work-connects-section";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "About Ali Nguyen",
  description: "Ali Nguyen builds applied AI prototypes, developer tools, and commerce products with a background in digital marketing.",
  alternates: { canonical: `${siteUrl}/about/` },
  openGraph: { title: "About Ali Nguyen", description: "Applied AI prototypes, developer tools, and commerce products with a background in digital marketing.", images: [`${siteUrl}/opengraph-image.png`] },
};

export default function AboutPage() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader inner />
    <main id="main" className="about-page">
      <section className="about-page-hero section-shell" aria-labelledby="about-page-title">
        <div className="about-page-copy"><h1 id="about-page-title">About Ali</h1><p className="about-page-lead">I build applied AI prototypes, developer tools, and digital commerce products.</p><p>I bring {identity.experience.digitalMarketing} and {identity.experience.aiEngineering}. As founder and builder of DUYTRUYENTHONG, I work from customer discovery through websites, content, commerce workflows, and analytics.</p><p className="about-page-name">Ali Nguyen <span>· DUYTRUYENTHONG</span></p><Link className="about-page-start" href="/work">Start with selected work →</Link></div>
        <figure className="about-page-portrait"><img src={`${basePath}/ali-nguyen-portrait-960.webp`} srcSet={`${basePath}/ali-nguyen-portrait-480.webp 480w, ${basePath}/ali-nguyen-portrait-960.webp 960w`} sizes="(max-width: 767px) 380px, 440px" alt="Portrait of Ali Nguyen wearing a black suit" width="1071" height="1468" loading="lazy" decoding="async" /><figcaption>Founder &amp; builder</figcaption></figure>
      </section>
      <WorkConnectsSection />
      <section className="about-page-cvs" aria-labelledby="about-cv-title"><div className="section-shell"><p className="eyebrow">CVs</p><h2 id="about-cv-title">Choose the version for your conversation.</h2><div className="about-page-cv-list">{cvTracks.map((track) => <article key={track.title}><h3>{track.title}</h3><p>{track.detail}</p><div>{track.downloads.map((file) => <a key={file.path} href={`${basePath}/${file.path}`} download>{file.label} ↓</a>)}</div></article>)}</div></div></section>
      <section className="about-page-contact section-shell"><h2>Have a project in mind?</h2><a href={`mailto:${identity.email}`}>Get in touch ↗</a></section>
    </main>
    <footer className="site-footer"><span>Ali Nguyen · DUYTRUYENTHONG</span><Link href="/">Home ↑</Link></footer>
  </>;
}
