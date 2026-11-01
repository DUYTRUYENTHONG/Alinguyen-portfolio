import type { Metadata } from "next";
import { identity } from "@/data/portfolio";
import { introDescription, socialImage } from "@/data/social-preview";
import { IntroBackground } from "./intro-background";
import styles from "./intro.module.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Meet Ali Nguyen | Applied AI and Product Engineer",
  description: introDescription,
  alternates: { canonical: `${siteUrl}/intro/` },
  openGraph: { title: "Meet Ali Nguyen", description: introDescription, type: "website", url: `${siteUrl}/intro/`, images: [socialImage] },
};

export default function IntroPage() {
  return <main className={styles.page}>
    <IntroBackground />
    <div className={styles.shell}>
      <header className={styles.header}>
        <a href={`${basePath}/#top`} aria-label="Ali Nguyen’s portfolio">ALI NGUYEN<span> / DUYTRUYENTHONG</span></a>
        <span className={styles.previewLabel}>A short introduction</span>
      </header>
      <section className={styles.hero} aria-labelledby="intro-title">
        <div className={styles.copy}>
          <p className={styles.eyebrow}>AI thinking. Marketing perspective.</p>
          <p className={styles.hello}>Hi, I’m</p>
          <h1 id="intro-title">Ali Nguyen<span>.</span></h1>
          <p className={styles.role}>{identity.title}</p>
          <p className={styles.description}>{introDescription}</p>
          <ul className={styles.focus} aria-label="Areas of focus">
            <li>Applied AI</li><li>Data workflows</li><li>Digital marketing</li>
          </ul>
          <nav className={styles.links} aria-label="Explore Ali’s work">
            <a className={styles.primary} href={`${basePath}/#top`}>Explore my portfolio <span aria-hidden="true">↗</span></a>
            <a className={styles.secondary} href={identity.github}>GitHub <span aria-hidden="true">↗</span></a>
          </nav>
        </div>
        <div className={styles.visual}>
          <div className={styles.halo} aria-hidden="true" />
          <div className={styles.portraitFrame}>
            <img src={`${basePath}/ali-nguyen-portrait-480.webp`} srcSet={`${basePath}/ali-nguyen-portrait-480.webp 480w, ${basePath}/ali-nguyen-portrait-960.webp 960w`} sizes="(max-width: 700px) 300px, 440px" alt="Ali Nguyen’s portrait in a black suit" width="480" height="658" fetchPriority="high" draggable="false" />
          </div>
          <span className={styles.portraitCaption}>From customer needs<br /><strong>to useful digital products.</strong></span>
        </div>
      </section>
      <footer className={styles.footer}>Explore the work. Inspect the evidence.</footer>
    </div>
  </main>;
}
