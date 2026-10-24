"use client";

import { capabilities, identity, principles } from "@/data/portfolio";
import { useOnceVisible } from "./use-once-visible";
import styles from "./about-work-section.module.css";

function PrincipleIllustration({ index }: { index: number }) {
  return <div className={styles.illustration} aria-hidden="true">
    <div className={styles.floor} />
    <div className={styles.scene}>
      {index === 0 && <>
        <div className={`${styles.sheet} ${styles.sourceBack}`} />
        <div className={`${styles.sheet} ${styles.source}`}><span className={styles.microLabel}>SOURCE</span><i /><i /><i /><span className={styles.sourceDot} /></div>
        <div className={styles.boundary}><span>BOUNDARY</span><span className={styles.boundaryCorner} /></div>
        <svg className={styles.connector} viewBox="0 0 320 170" fill="none" aria-hidden="true" focusable="false"><path d="M100 88H162V75H218" /><circle cx="162" cy="88" r="4" /></svg>
        <div className={styles.owner}><svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false"><circle cx="16" cy="11" r="5" /><path d="M7 27v-3a9 9 0 0 1 18 0v3" /></svg><span>OWNER</span></div>
      </>}
      {index === 1 && <>
        <div className={styles.ruler}><i /><i /><i /><i /><i /><i /></div>
        <div className={`${styles.sheet} ${styles.technical}`}><span className={styles.microLabel}>TECHNICAL</span><svg viewBox="0 0 60 36" fill="none" aria-hidden="true" focusable="false"><path d="m18 7-10 11 10 11m24-22 10 11-10 11M34 3l-8 30" /></svg><i /><i /></div>
        <div className={`${styles.sheet} ${styles.outcome}`}><span className={styles.microLabel}>OUTCOME</span><span className={styles.evidenceFrame}><i /><i /></span><i /><i /></div>
        <span className={styles.separation} />
      </>}
      {index === 2 && <>
        <div className={`${styles.sheet} ${styles.privateBack}`} />
        <div className={`${styles.sheet} ${styles.privateDocument}`}><span className={styles.microLabel}>INFORMATION</span><i /><i /><i /><i /></div>
        <div className={styles.cover}><svg viewBox="0 0 64 76" fill="none" aria-hidden="true" focusable="false"><path d="M32 5 56 15v21c0 16-12 28-24 35C20 64 8 52 8 36V15L32 5Z" /><rect x="23" y="32" width="18" height="16" rx="3" /><path d="M26 32v-7a6 6 0 0 1 12 0v7" /></svg></div>
        <span className={styles.coverEdge} />
      </>}
      {index === 3 && <>
        <div className={styles.basePlate} />
        <div className={`${styles.module} ${styles.moduleOne}`}><i /><i /></div>
        <div className={`${styles.module} ${styles.moduleTwo}`}><i /><i /><i /></div>
        <div className={`${styles.module} ${styles.moduleThree}`}><i /><i /></div>
        <div className={styles.inspection}><svg viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false"><circle cx="26" cy="26" r="18" /><path d="m40 40 17 17M19 26h14M26 19v14" /></svg></div>
      </>}
    </div>
  </div>;
}

export function AboutWorkSection() {
  const sectionRef = useOnceVisible<HTMLElement>();

  return <section ref={sectionRef} className={styles.section} id="about" aria-labelledby="about-title">
    <div className="section-shell">
      <div className={styles.intro}>
        <div><p className="eyebrow">About the work</p><h2 id="about-title">Build with the evidence in view.</h2><div className={styles.introGraphic} aria-hidden="true"><span>Scope</span><i /><span>Test</span><i /><span>Explain</span></div></div>
        <p>I bring {identity.experience.digitalMarketing} and {identity.experience.aiEngineering}. I founded and operate DUYTRUYENTHONG agency, combining client discovery with websites, local search, content, TikTok Shop operations, and analytics. Solution consulting and technical support experience shape how I scope, test, and explain each system.</p>
      </div>
      <div className={styles.principles}>
        {principles.map((item, index) => <article className={styles.card} key={item.title}>
          <div className={styles.cardTop}><span className={styles.index}>0{index + 1}</span><span className={styles.topRule} /></div>
          <PrincipleIllustration index={index} />
          <h3>{item.title}</h3>
          <p>{item.detail}</p>
        </article>)}
      </div>
      <div className={styles.capabilities}>
        {capabilities.map((group, index) => <div className={styles.capability} key={group.group}>
          <svg className={styles.capabilityIcon} viewBox="0 0 28 28" fill="none" aria-hidden="true" focusable="false"><path d={index === 0 ? "m9 6-7 8 7 8m10-16 7 8-7 8M16 3l-4 22" : index === 1 ? "M3 3h9v9H3zm13 0h9v9h-9zM3 16h9v9H3zm13 0h9v9h-9z" : index === 2 ? "M3 5h22L17 15v9l-6-3v-6L3 5Z" : "M4 24V13m10 11V4m10 20V9M1 25h26"} /></svg>
          <h3>{group.group}</h3>
          <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>)}
      </div>
    </div>
  </section>;
}
