import type { Metadata } from "next";
import { SiteHeader } from "../../experience";
import { PortfolioLink as Link } from "../../portfolio-link";
import { RetrievalComparison } from "./comparison";
import styles from "../page.module.css";
export const metadata: Metadata = {
	title: "Retrieval decisions — Ali Nguyen",
	description:
		"Inspect an offline bilingual retrieval experiment, its misses and the decision to keep production ranking unchanged.",
};
export default function RetrievalEvidence() {
	return (
		<>
			<a className="skip-link" href="#retrieval-main">
				Skip to content
			</a>
			<SiteHeader inner />
			<main id="retrieval-main" className={`${styles.main} section-shell`}>
				<header className={styles.hero}>
					<p className="eyebrow">
						Applied AI · authored development experiment
					</p>
					<h1>
						A retrieval change.
						<br />A decision you can inspect.
					</h1>
					<p>
						Keep the production keyword retriever. This experiment compares a
						pinned multilingual model with exact cosine search, one Vietnamese
						passage-enrichment candidate, and reciprocal rank fusion. Small
						development results do not justify a production promotion.
					</p>
					<Link href="/evidence/">← Engineering evidence</Link>
				</header>
				<section className={styles.section}>
					<h2>One improvement. A larger regression.</h2>
					<p>
						In this new Vietnamese development replay, passage enrichment moved
						leakage evidence from rank 14 to 2, but the published guide-failure
						report fell from rank 1 to 5. Top-three hits fell from 7/8 to 5/8
						and first-place hits from 5/8 to 3/8. Keep the candidate offline.
					</p>
					<h2>Compare the evidence, in either language.</h2>
					<p>
						Select a question, inspect its expected source and open the returned
						evidence. These recorded rankings run entirely in the static export.
						No model is downloaded in your browser.
					</p>
					<RetrievalComparison />
				</section>
				<section className={styles.section}>
					<h2>What this experiment does not reproduce.</h2>
					<p>
						The original replay questions, model pin and corpus snapshot were
						unavailable. This is a new set of eight authored bilingual intent
						pairs plus two unrelated controls, not an independent benchmark. The
						historical claims—Vietnamese top-three 4/8 → 5/8, first-place 3/8 →
						2/8 and a threshold rejecting 11/16 answerable questions—have not
						been reproduced here.
					</p>
					<p>
						The future-data leakage and published-guide-failure questions are
						visible in the selector. Their actual ranks, including regressions
						or unchanged results, are recorded without forcing the historical
						outcome. No abstention threshold is promoted. Independent recruiter,
						academic and product questions remain pending.
					</p>
					<div className={styles.links}>
						<Link href="/recruiter-retrieval.json" download>
							Download every ranking and fingerprint ↓
						</Link>
						<a
							href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/recruiter-study-plan.md`}
						>
							Frozen development plan ↗
						</a>
					</div>
				</section>
				<section className={styles.section}>
					<h2>One model job. Reviewed answers.</h2>
					<p>
						Groq selects public record IDs. The server validates the selection
						and assembles approved text and links. A valid citation alone never
						establishes that a model-written claim is true. Known projects,
						tours and policy routes avoid inference; timeout or quota failures
						retain a labelled source excerpt.
					</p>
<p>The strict-schema contract passed local tests. Four real Groq calls were recorded: two requests for an omitted metric abstained without the expected source, while a supported question about published guide failures and its identical repeat selected the correct record. Preview revision <code>04a318e</code> returned the exact reviewed answer and citation for that supported question. The omitted-metric checks remain failed. Cache-read counters were absent; production is unchanged.</p>
					<pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
						node visitor-api/scripts/recruiter-retrieval.mjs --prepare
						<br />
						python visitor-api/scripts/embed-recruiter-study.py
						<br />
						node visitor-api/scripts/recruiter-retrieval.mjs
					</pre>
					<Link href="/guide-prompt-audit.md" download>
						Prompt audit and regression evidence ↓
					</Link>
				</section>
				<footer className={styles.footer}>
					<Link href="/work/kkbox-baseline/#cutoff-title">
						Try the prediction cutoff →
					</Link>
					<Link href="/cv-applied-ai-engineer.pdf" download>
						Download master CV ↓
					</Link>
				</footer>
			</main>
		</>
	);
}
