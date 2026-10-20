import { identity } from "@/data/portfolio";
import styles from "./highlights-section.module.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const cards = [
  { id: "growth", title: "Growth Commerce OS", description: "A live service website for the DUYTRUYENTHONG brand.", href: identity.service, action: "Visit site", logo: "duytruyenthong-logo.png" },
  { id: "vibecode", title: "Vibecode Product Kit", description: "A public developer tool with an offline CLI and CI checks.", href: "https://github.com/DUYTRUYENTHONG/vibecode-product-kit", action: "View source", logo: "vibecode-product-kit-logo.svg" },
  { id: "kkbox", title: "KKBox baseline", description: "An audited churn holdout on official data with a snapshot-date leakage check.", href: "#project-kkbox-baseline", action: "See project", logo: "kkbox-logo.png" },
  { id: "stos", title: "STOS", description: "A live sales page product for independent sellers and small businesses.", href: identity.stos, action: "Visit product", logo: "stos-logo-dark.png" },
  { id: "chokenh", title: "Chợ Kênh", description: "A live TikTok channel catalog with manual intermediary inquiries.", href: identity.choKenh, action: "Visit marketplace", logo: "cho-kenh-logo.png" },
  { id: "process", title: "Open process", description: "Reproducible baselines, readable code, and explicit limits.", href: "#about", action: "Read approach", logo: null },
] as const;

function FeatureArtwork() {
  return <div className={styles.featureArt} aria-hidden="true">
    <span className={`${styles.goldPlate} ${styles.goldPlateBack}`}><span className={styles.routeGlyph}>↗</span></span>
    <span className={`${styles.goldPlate} ${styles.goldPlateMiddle}`}><span className={styles.bagGlyph}>▢</span></span>
    <span className={`${styles.goldPlate} ${styles.goldPlateFront}`}><span className={styles.barGlyph}><i /><i /><i /></span></span>
    <span className={styles.goldFloor} />
  </div>;
}

function CardArtwork({ id }: { id: typeof cards[number]["id"] }) {
  if (id === "growth") return <div className={`${styles.art} ${styles.growthArt}`} aria-hidden="true">
    <div className={styles.laptop}><div className={styles.laptopScreen}><img src={`${basePath}/duytruyenthong-site-2026-preview.webp`} alt="" width="1100" height="523" /></div><span className={styles.laptopBase} /></div>
  </div>;
  if (id === "vibecode") return <div className={`${styles.art} ${styles.vibecodeArt}`} aria-hidden="true">
    <div className={styles.terminal}><span className={styles.terminalDots}><i /><i /><i /></span><div className={styles.terminalLines}><span><b>✓</b> Templates ready</span><span><b>✓</b> Offline CLI enabled</span><span><b>✓</b> CI checks configured</span></div></div><span className={styles.commandTile}>&gt;_</span>
  </div>;
  if (id === "kkbox") return <div className={`${styles.art} ${styles.kkboxArt}`} aria-hidden="true">
    <div className={styles.signalCard}><span className={styles.signalHeading}>Customer signals</span><svg viewBox="0 0 180 65" fill="none" aria-hidden="true"><path d="M0 49 27 43 48 51 72 26 96 36 120 19 143 27 163 9 180 13" stroke="#218bfa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg><span className={styles.signalBars}><i /><i /><i /><i /><i /></span></div>
    <div className={styles.snapshotCard}><strong>Snapshot check</strong><span>Train <b>✓</b></span><span>Validation <b>✓</b></span><span>Test <b>✓</b></span></div>
  </div>;
  if (id === "stos") return <div className={`${styles.art} ${styles.stosArt}`} aria-hidden="true"><div className={styles.stosDevice}><img src={`${basePath}/stos-home-mobile-2026-preview.webp`} alt="" width="382" height="288" /></div><span className={styles.stosAccent} /></div>;
  if (id === "chokenh") return <div className={`${styles.art} ${styles.chokenhArt}`} aria-hidden="true"><div className={styles.marketDevice}><img src={`${basePath}/cho-kenh-home-2026-preview.webp`} alt="" width="1100" height="523" /></div></div>;
  return <div className={`${styles.art} ${styles.processArt}`} aria-hidden="true"><div className={styles.processSheet}><strong>Project approach</strong><span><b>01</b> Reproducible baselines</span><span><b>02</b> Readable code</span><span><b>03</b> Explicit limits</span></div><div className={styles.processCode}><span>report = &#123;</span><span>&nbsp; reproducible: true,</span><span>&nbsp; readable: true,</span><span>&nbsp; limits: explicit</span><span>&#125;</span></div></div>;
}

export function HighlightsSection() {
  return <section className={styles.section} id="highlights" aria-labelledby="highlights-title">
    <div className={styles.shell}>
      <h2 id="highlights-title" className={styles.srOnly}>Highlights</h2>
      <div className={styles.grid}>
        <div className={styles.feature}>
          <span className={styles.sparkle} aria-hidden="true">✦</span>
          <FeatureArtwork />
          <div className={styles.featureCopy}><strong>5</strong><p>featured builds across commerce products, open-source tooling, and customer analytics.</p><div className={styles.featureFooter}><span>REAL PROJECTS.<br />PRACTICAL IMPACT.</span><a href="#work" aria-label="Explore selected work">→</a></div></div>
        </div>
        {cards.map((card) => <article className={`${styles.card} ${styles[card.id]}`} key={card.id}>
          <div className={styles.cardCopy}>
            {card.logo ? <img className={styles.logo} src={`${basePath}/${card.logo}`} alt="" width="64" height="64" /> : <span className={styles.processMark} aria-hidden="true">✓</span>}
            <h3>{card.title}</h3><p>{card.description}</p>
          </div>
          <CardArtwork id={card.id} />
          <a className={styles.action} href={card.href}>{card.action} <span aria-hidden="true">↗</span></a>
        </article>)}
      </div>
    </div>
  </section>;
}
