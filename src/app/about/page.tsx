import type { Metadata } from "next";
import Link from "next/link";
import { cvTracks, identity } from "@/data/portfolio";
import { SiteHeader } from "../experience";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "About Ali Nguyen",
  description: "Ali Nguyen works across sales, digital marketing, e-commerce, and applied AI.",
};

export default function AboutPage() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader inner />
    <main id="main" className="about-page">
      <section className="about-page-hero section-shell" aria-labelledby="about-page-title">
        <div className="about-page-copy"><h1 id="about-page-title">About Ali</h1><p className="about-page-lead">I build sales, marketing, and e-commerce systems that help businesses create clearer funnels and more qualified leads.</p><p>As founder and builder of DUYTRUYENTHONG, I work from customer discovery through websites, content, commerce workflows, and analytics. I also explore applied AI and data tools where they help a real decision.</p><p className="about-page-name">Ali Nguyen <span>· DUYTRUYENTHONG</span></p><Link className="about-page-start" href="/work">Start with selected work →</Link></div>
        <figure className="about-page-portrait"><img src={`${basePath}/ali-nguyen-portrait.png`} alt="Portrait of Ali Nguyen wearing a black suit" width="1064" height="1536" /><figcaption>Founder &amp; builder</figcaption></figure>
      </section>
      <section className="about-page-path section-shell" aria-labelledby="path-title"><p className="eyebrow">The route so far</p><h2 id="path-title">Where the work connects.</h2><div className="about-page-path-grid"><article><span>01 / SALES</span><h3>Understand the offer and the buyer.</h3><p>Client discovery, positioning, content, and lead paths.</p></article><article><span>02 / COMMERCE</span><h3>Build a useful journey.</h3><p>Service sites, product pages, and digital marketplace workflows.</p></article><article><span>03 / DATA</span><h3>Learn from the signals.</h3><p>Analytics, customer data, and cautious AI prototypes.</p></article></div></section>
      <section className="about-page-cvs" aria-labelledby="about-cv-title"><div className="section-shell"><p className="eyebrow">CVs</p><h2 id="about-cv-title">Choose the version for your conversation.</h2><div className="about-page-cv-list">{cvTracks.map((track) => <article key={track.title}><h3>{track.title}</h3><p>{track.detail}</p><div>{track.downloads.map((file) => <a key={file.path} href={`${basePath}/${file.path}`} download>{file.label} ↓</a>)}</div></article>)}</div></div></section>
      <section className="about-page-contact section-shell"><h2>Have a project in mind?</h2><a href={`mailto:${identity.email}`}>Get in touch ↗</a></section>
    </main>
    <footer className="site-footer"><span>Ali Nguyen · DUYTRUYENTHONG</span><Link href="/">Home ↑</Link></footer>
  </>;
}
