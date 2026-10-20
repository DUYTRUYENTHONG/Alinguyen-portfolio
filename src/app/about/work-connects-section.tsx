import styles from "./work-connects-section.module.css";

type Area = "sales" | "commerce" | "data";

type WorkArea = {
  area: Area;
  category: string;
  heading: string;
  description: string;
};

const areas: WorkArea[] = [
  {
    area: "sales",
    category: "01 / SALES",
    heading: "Understand the offer and the buyer.",
    description: "Client discovery, positioning, content, and lead paths.",
  },
  {
    area: "commerce",
    category: "02 / COMMERCE",
    heading: "Build a useful journey.",
    description: "Service sites, product pages, and digital marketplace workflows.",
  },
  {
    area: "data",
    category: "03 / DATA",
    heading: "Learn from the signals.",
    description: "Analytics, customer data, and cautious AI prototypes.",
  },
];

function AreaIllustration({ area }: { area: Area }) {
  const shared = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg
      className={styles.illustration}
      viewBox="0 0 168 88"
      aria-hidden="true"
      focusable="false"
      {...shared}
    >
      {area === "sales" && <>
        <rect x="9" y="22" width="54" height="44" rx="8" />
        <path d="M22 38h27M22 47h18" />
        <path d="M63 44h42" />
        <circle cx="84" cy="44" r="5" fill="var(--diagram-bg)" />
        <rect x="105" y="22" width="54" height="44" rx="8" />
        <circle cx="132" cy="36" r="6" />
        <path d="M119 54c2-8 24-8 26 0" />
      </>}
      {area === "commerce" && <>
        <rect x="8" y="26" width="38" height="38" rx="7" />
        <path d="M19 38h16M19 47h10M46 45h16" />
        <circle cx="54" cy="45" r="3" fill="var(--diagram-bg)" />
        <rect x="62" y="18" width="44" height="54" rx="7" />
        <rect x="72" y="28" width="24" height="17" rx="2" />
        <path d="M72 53h24M106 45h16" />
        <circle cx="114" cy="45" r="3" fill="var(--diagram-bg)" />
        <rect x="122" y="26" width="38" height="38" rx="7" />
        <circle cx="141" cy="45" r="7" />
        <circle cx="141" cy="45" r="2" fill="var(--diagram-bg)" />
      </>}
      {area === "data" && <>
        <path d="M18 62V46M30 62V33M42 62V50M54 62V27" />
        <circle cx="18" cy="39" r="2.5" fill="var(--diagram-bg)" />
        <circle cx="42" cy="43" r="2.5" fill="var(--diagram-bg)" />
        <path d="M64 44h35" />
        <circle cx="81" cy="44" r="4" fill="var(--diagram-bg)" />
        <rect x="99" y="23" width="60" height="43" rx="8" />
        <path d="M112 37h34M112 47h24M112 56h17" />
      </>}
    </svg>
  );
}

export function WorkConnectsSection() {
  return (
    <section className={`${styles.section} section-shell`} aria-labelledby="path-title">
      <p className="eyebrow">THE ROUTE SO FAR</p>
      <h2 id="path-title" className={styles.title}>Where the work connects.</h2>
      <div className={styles.grid}>
        {areas.map(({ area, category, heading, description }) => (
          <article className={styles.card} key={area}>
            <span className={styles.category}>{category}</span>
            <AreaIllustration area={area} />
            <h3>{heading}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
