import { communityResource as resource } from "@/data/portfolio";
import styles from "./community-resource-section.module.css";

export function CommunityResourceSection() {
  return <section className={styles.section} id={resource.id} aria-labelledby="community-title">
    <div className="section-shell">
      <div className={styles.intro}><p className="eyebrow">{resource.eyebrow}</p><h2 id="community-title">{resource.headline}</h2></div>
      <article className={styles.resource}>
        <div className={styles.copy}>
          <p className={styles.license}>{resource.license}</p>
          <h3>{resource.name}</h3>
          <p className={styles.description}>{resource.description}</p>
          <div className={styles.links}><a className={styles.primary} href={resource.guideHref}>Start with the free kit <span aria-hidden="true">↗</span></a><a href={resource.href}>Explore the source <span aria-hidden="true">↗</span></a><a href={resource.vietnameseHref} lang="vi">Hướng dẫn tiếng Việt <span aria-hidden="true">↗</span></a></div>
          <p className={styles.setup}>{resource.setup}</p>
        </div>
        <div className={styles.workbench}>
          <div className={styles.documents} aria-hidden="true"><span className={styles.backSheet}/><span className={styles.frontSheet}><i/><i/><i/><i/></span><span className={styles.reviewMark}><svg aria-hidden="true" viewBox="0 0 32 32" focusable="false"><path d="m9 16 5 5 10-11"/></svg></span></div>
          <p className={styles.tools}>{resource.tools}</p>
          <ol className={styles.stages}>{resource.stages.map((stage,index)=><li key={stage.title}><span className={styles.index}>0{index+1}</span><div><h4>{stage.title}</h4><p>{stage.detail}</p></div></li>)}</ol>
        </div>
        <p className={styles.limits}>{resource.limits}</p>
      </article>
    </div>
  </section>;
}

