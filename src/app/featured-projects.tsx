import { projects } from "@/data/portfolio";
import { PortfolioLink } from "./portfolio-link";
import styles from "./featured-projects.module.css";

const evidence = [
  { id: "kkbox-baseline", category: "AI & data", detail: "0.217324 log loss on an official-data local holdout. Inspect the method, code, and limitations.", mark: "01" },
  { id: "vibecode-kit", category: "Developer tooling", detail: "A public CLI with agent profiles, templates, and CI checks. Inspect the source and release workflow.", mark: "02" },
  { id: "growth-commerce-os", category: "Live commerce", detail: "A working service website with public product demos. Explore the customer journey and product decisions.", mark: "03" },
];

export function FeaturedProjects() {
  return <section id="featured-work" className={`${styles.section} section-shell`} aria-labelledby="featured-work-title">
    <div className={styles.heading}><div><p className="eyebrow">Start with the evidence</p><h2 id="featured-work-title">Three builds to explore.</h2></div><PortfolioLink href="/work">View all projects <span aria-hidden="true">↗</span></PortfolioLink></div>
    <div className={styles.grid}>{evidence.map((item) => {
      const project = projects.find(({ id }) => id === item.id);
      if (!project) return null;
      return <PortfolioLink key={item.id} href={`/work/${item.id}`} className={styles.card}>
        <div className={styles.meta}><span>{item.category}</span><span aria-hidden="true">{item.mark}</span></div>
        <h3>{project.name.replace("DUYTRUYENTHONG ", "").replace("Codex ", "")}</h3>
        <p>{item.detail}</p><span className={styles.status}>{project.status}</span>
        <span className={styles.action}>Explore case study <span aria-hidden="true">↗</span></span>
      </PortfolioLink>;
    })}</div>
  </section>;
}
