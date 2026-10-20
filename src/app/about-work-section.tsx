"use client";

import { capabilities, identity, principles } from "@/data/portfolio";
import { useOnceVisible } from "./use-once-visible";
import styles from "./about-work-section.module.css";

function PrincipleIllustration({ index }: { index: number }) {
  const detailPaths = ["M76 38h16", "M32 23h7M32 33h7M32 43h7", "M48 39h20M48 46h14", "M47 45h6M87 45h6"] as const;
  return <div className={`${styles.illustration} ${styles[`illustration${index + 1}`]}`} aria-hidden="true">
    <div className={styles.scene}>
      <svg className={styles.detail} viewBox="0 0 142 72" fill="none" aria-hidden="true" focusable="false"><path d={detailPaths[index]} /></svg>
      <span className={styles.layerA} />
      <span className={styles.layerB} />
      <span className={styles.layerC} />
      <span className={styles.node} />
    </div>
  </div>;
}

export function AboutWorkSection() {
  const sectionRef = useOnceVisible<HTMLElement>();

  return <section ref={sectionRef} className={styles.section} id="about" aria-labelledby="about-title">
    <div className="section-shell">
      <div className={styles.intro}>
        <div><p className="eyebrow">About the work</p><h2 id="about-title">Build with the evidence in view.</h2></div>
        <p>I bring {identity.experience.digitalMarketing} and {identity.experience.aiEngineering}. I founded and operate DUYTRUYENTHONG agency, combining client discovery with websites, local search, content, TikTok Shop operations, and analytics. Solution consulting and technical support experience shape how I scope, test, and explain each system.</p>
      </div>
      <div className={styles.principles}>
        {principles.map((item, index) => <article className={styles.card} key={item.title}>
          <span className={styles.index}>0{index + 1}</span>
          <PrincipleIllustration index={index} />
          <h3>{item.title}</h3>
          <p>{item.detail}</p>
        </article>)}
      </div>
      <div className={styles.capabilities}>
        {capabilities.map((group) => <div className={styles.capability} key={group.group}>
          <h3>{group.group}</h3>
          <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>)}
      </div>
    </div>
  </section>;
}
