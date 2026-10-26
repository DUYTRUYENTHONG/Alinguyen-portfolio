import type { Metadata } from "next";
import demo from "../../../docs/evidence/traffic-analytics-demo.json";
import evaluation from "../../../docs/evidence/guide-evaluation-live.json";
import { SiteHeader } from "../experience";
import { PortfolioLink as Link } from "../portfolio-link";
import styles from "./page.module.css";

const source = "https://github.com/DUYTRUYENTHONG/Alinguyen-portfolio/blob/main";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const metadata: Metadata = {
  title: "Engineering evidence — Ali Nguyen",
  description: "A private PostgreSQL pipeline, AI guide evaluation and consent-based recommendation signals, with reproducible checks and limitations.",
  alternates: { canonical: `${siteUrl}/evidence/` },
};

export default function EvidencePage() {
  const result = evaluation.summary;
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader inner />
    <main id="main" className={`${styles.main} section-shell`}>
      <header className={styles.hero}>
        <p className="eyebrow">Engineering evidence · 26 October 2026</p>
        <h1>Built. Tested.<br />Open to inspection.</h1>
        <p>Inspectable code and recorded checks: a restricted hosted warehouse, an AI guide baseline that keeps the failures, and optional project recommendation signals.</p>
        <nav className={styles.links} aria-label="Evidence sections"><a href="#analytics">Traffic analytics ↓</a><a href="#guide-evaluation">AI guide evaluation ↓</a><a href="#recommendations">Recommendation signals ↓</a></nav>
      </header>
      <section id="analytics" className={styles.section} aria-labelledby="analytics-title">
        <div className={styles.intro}><div><p className="eyebrow">01 / Data engineering</p><h2 id="analytics-title">Traffic into an auditable report.</h2></div><p>Upstash remains the operational store. A batch exporter reads daily aggregates into PostgreSQL tables and SQL reporting views. Browser identifiers and chat conversations stay out of the warehouse.</p></div>
        <ol className={styles.flow}><li><span>Collect</span><strong>Upstash Redis</strong><p>Existing recorded traffic, isolated by project and environment.</p></li><li><span>Validate &amp; load</span><strong>PostgreSQL</strong><p>Transactions, replay protection, corrections and coverage checks.</p></li><li><span>Explain</span><strong>Daily &amp; weekly SQL views</strong><p>Missing data stays unknown. Partial days stay visible.</p></li></ol>
        <div className={styles.twoColumns}>
          <article className={styles.panel}><p className={styles.label}>Synthetic demonstration · not customer traffic</p><h3>Four days, with their limits.</h3><ul className={styles.chart}>{demo.result.daily.map((day) => <li key={day.day}><div><time dateTime={day.day}>{day.day.slice(5)}</time><strong>{day.page_views ?? "Unavailable"}{!day.closed_day && " · partial"}</strong></div><div className={styles.track} aria-hidden="true"><span style={{ width: `${Number(day.page_views ?? 0) / 23 * 100}%` }} /></div></li>)}</ul><p>35 recorded views across two available closed days in this fixture. One day is unavailable; the five partial-day views are excluded. Daily unique browsers are never added into weekly unique people.</p></article>
          <article className={styles.panel}><p className={styles.label}>Verification boundary</p><h3>Private hosted PostgreSQL.</h3><p>Fourteen analytics tests cover replay, corrections, rollback, isolation and restricted permissions. Live Supabase TLS, row reconciliation and replay checks passed.</p><p>The first manually dispatched production import passed. Daily scheduling is enabled; the first clock-triggered execution remains unobserved in this report. Real counts stay private and belong to the separate no-bloom project.</p><p><strong>Remaining:</strong> backup restoration, load testing and external stale-import alerts. These checks do not establish customer impact.</p><a href={`${source}/docs/evidence/SUPABASE_WAREHOUSE_QA.md`}>Inspect hosted verification ↗</a></article>
        </div>
      </section>
      <section id="guide-evaluation" className={styles.section} aria-labelledby="guide-title">
        <div className={styles.intro}><div><p className="eyebrow">02 / Applied AI</p><h2 id="guide-title">Evaluate the answers.<br />Keep the failures.</h2></div><p>The live portfolio guide retrieves approved public sources before requesting an AI answer. A baseline run tested factual questions, unsupported requests, injection attempts and Vietnamese questions.</p></div>
        <dl className={styles.metrics}><div><dt>Requests returning HTTP 200</dt><dd>{result.responseSuccesses}<span> / {result.cases}</span></dd></div><div><dt>Original heuristic checks passed</dt><dd>{result.passed}<span> / {result.cases}</span></dd></div><div><dt>Service-unavailable responses</dt><dd>{result.cases - result.responseSuccesses}</dd></div></dl>
        <div className={styles.twoColumns}><article><h3>What the run establishes</h3><p>One pass, no retries. Nine citation-bearing responses used approved URLs. Median latency was {(result.p50LatencyMs / 1000).toFixed(3)} seconds; p95 was {(result.p95LatencyMs / 1000).toFixed(3)} seconds, including failed requests.</p><p>The 16 questions came from a 24-case authored development set. URL and phrase checks are regression signals, not a factual-accuracy score. Token usage and cost were unavailable.</p></article><article><h3>What changed afterward</h3><p>When generation fails after validation and rate checks, the guide can show a clearly labelled source excerpt with a citation. Failure tests cover that behavior; rate-store outages still fail closed.</p><p>The published baseline predates this fix. A complete post-release live evaluation is pending. The report preserves scoring limitations and all four failed requests.</p></article></div>
        <div className={styles.links}><a href={`${source}/docs/evidence/AI_GUIDE_EVALUATION.md`}>Read the evaluation report ↗</a><a href={`${source}/docs/evidence/guide-evaluation-live.json`}>Inspect the original run ↗</a></div>
      </section>
      <section id="recommendations" className={styles.section} aria-labelledby="recommendations-title">
        <div className={styles.intro}><div><p className="eyebrow">03 / Recommendation engineering</p><h2 id="recommendations-title">Relevant evidence first.</h2></div><p>Visitors can choose to share project-link interactions from the guide’s “Help improve project recommendations” settings. Collection starts off and can be stopped at any time.</p></div>
        <div className={styles.twoColumns}><article><h3>A small, bounded signal</h3><p>Recent aggregate counts can break close relevance ties. Explicit project questions keep their original retrieval order. Sparse, stale or unavailable signals leave ordinary retrieval unchanged.</p><p>The language model receives approved evidence, never private counts. This is aggregate ranking, not a profile of an individual visitor.</p></article><article><h3>Checks and limits</h3><p>Tests cover consent, expiry, allowlisted destinations, storage failures and ranking boundaries. An isolated Redis check verifies concurrent deduplication and rate limits without creating production engagement.</p><p>No recommendation-quality uplift is claimed. Redis interaction signals are separate from the PostgreSQL traffic warehouse. Neither vector search nor model training is used.</p></article></div>
        <div className={styles.links}><a href={`${source}/docs/PORTFOLIO_RECOMMENDATIONS.md`}>Implementation, privacy and QA ↗</a></div>
      </section>
      <footer className={styles.footer}><p>Evidence supports engineering work. It does not establish customer adoption or business impact.</p><Link href="/#cvs">Explore the CVs →</Link></footer>
    </main>
  </>;
}
