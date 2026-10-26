"use client";

import { useEffect, useRef } from "react";
import { expertise } from "@/data/portfolio";
import styles from "./ai-expertise-section.module.css";

function Rules({ count = 3 }: { count?: number }) {
  return <span className={styles.rules}>{Array.from({ length: count }, (_, index) => <i key={index} />)}</span>;
}

function ExpertiseIllustration({ number }: { number: string }) {
  return <div className={styles.stage} aria-hidden="true">
    <div className={styles.scene}>
      {number === "01" && <>
        <div className={`${styles.paper} ${styles.sourceBack}`}><Rules /></div>
        <div className={`${styles.paper} ${styles.sourceMid}`}><Rules /></div>
        <div className={`${styles.paper} ${styles.sourceFront}`}><span className={styles.blueDot} /><Rules /></div>
        <svg className={styles.route} viewBox="0 0 400 170" aria-hidden="true"><path d="M151 82 H205 Q218 82 218 70 H245" /></svg>
        <span className={styles.retrievalNode}><span /></span>
        <div className={`${styles.paper} ${styles.response}`}><span className={styles.responseHead} /><Rules count={4} /><span className={styles.referenceDots}><i /><i /></span></div>
      </>}
      {number === "02" && <>
        <div className={`${styles.paper} ${styles.featurePanel}`}><span className={styles.panelHeader} /><Rules /><span className={styles.featureSlots}><i /><i /><i /></span></div>
        <div className={styles.timeline}><span /><span /><span /><span /><span /></div>
        <span className={styles.snapshot}><i /></span>
        <svg className={styles.featureRoute} viewBox="0 0 400 170" aria-hidden="true"><path d="M75 108 V84 H107 M132 108 V84 H147 M188 108 V84 H187" /></svg>
        <span className={styles.afterBoundary}><i /><i /></span>
      </>}
      {number === "03" && <>
        <div className={`${styles.paper} ${styles.planBack}`}><Rules count={4} /></div>
        <div className={`${styles.paper} ${styles.planFront}`}><span className={styles.panelHeader} /><Rules count={4} /></div>
        <div className={styles.terminal}><span className={styles.terminalTop}><i /><i /><i /></span><Rules count={4} /></div>
        <div className={`${styles.paper} ${styles.review}`}><span className={styles.panelHeader} /><Rules count={3} /><span className={styles.reviewMarker} /></div>
      </>}
      {number === "04" && <>
        <div className={`${styles.paper} ${styles.pagePanel}`}><span className={styles.panelHeader} /><span className={styles.pageBlock} /><Rules count={3} /></div>
        <svg className={styles.signalRoute} viewBox="0 0 400 170" aria-hidden="true"><path d="M156 103 H204 Q217 103 217 91 H251" /><path d="M179 121 H220 Q232 121 232 107 H251" /></svg>
        <span className={styles.signalMarkers}><i /><i /><i /></span>
        <div className={`${styles.paper} ${styles.workflow}`}><span className={styles.workflowIcon} /><Rules count={3} /><span className={styles.workflowFooter} /></div>
        <div className={styles.suggestion}><span /><span /></div>
      </>}
    </div>
  </div>;
}

export function AIExpertiseSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        section.dataset.entered = "true";
        observer.disconnect();
      }
    }, { threshold: 0.08 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return <section ref={sectionRef} className={styles.section} id="ai-expertise" aria-labelledby="ai-expertise-title">
    <div className="section-shell">
      <div className={styles.intro}>
        <p className={`eyebrow ${styles.eyebrow}`}>Applied AI expertise</p>
        <h2 id="ai-expertise-title">What I build, and how I check it.</h2>
        <p>My work spans early AI prototypes, customer data, developer tooling, and commerce products. Each example below names the part that is working today and the part that still needs evidence.</p>
      </div>
      <div className={styles.grid}>
        {expertise.map((item) => <article className={styles.card} key={item.number}>
          <span className={styles.number}>{item.number} / 04</span>
          <ExpertiseIllustration number={item.number} />
          <h3>{item.title}</h3>
          <p>{item.detail}</p>
          <a className={styles.evidence} href={item.href.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${item.href}` : item.href}>{item.linkLabel}<span aria-hidden="true">↗</span></a>
        </article>)}
      </div>
    </div>
  </section>;
}
