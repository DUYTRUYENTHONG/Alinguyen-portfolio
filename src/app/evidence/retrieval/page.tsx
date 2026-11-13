import type { Metadata } from "next";
import { SiteHeader } from "../../experience";
import { PortfolioLink as Link } from "../../portfolio-link";
import styles from "../page.module.css";
import study from "../../../../public/retrieval-study-status.json";
const source =
	"https://github.com/DUYTRUYENTHONG/Alinguyen-portfolio/blob/codex/deepseek-evidence";
export const metadata: Metadata = {
	title: "Retrieval and evidence selection — Ali Nguyen",
	description:
		"An inspectable DeepSeek migration candidate, offline verification boundary and retrieval release decision.",
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
					<p className="eyebrow">Applied AI · migration candidate</p>
					<h1>
						From a question
						<br />
						to inspectable evidence.
					</h1>
					<p>
						The guide retrieves approved public records. DeepSeek selects record
						IDs; the server assembles the visible answer and links. Local code
						tests, real-provider selection and a deployed revision are three
						separate claims.
					</p>
					<nav className={styles.links} aria-label="Review path">
						<a href="#decision">Release decision ↓</a>
						<a href="#comparison">Retrieval comparison ↓</a>
						<a href="#boundary">Request boundary ↓</a>
					</nav>
				</header>
				<section id="decision" className={styles.section}>
					<h2>Why keep the keyword retriever?</h2>
					<p>
						The migration changes evidence selection, not production ranking.
						The original bilingual replay questions, E5 pin and ranking
						artifacts are missing. Without reproducible per-question results or
						independent labels, there is no evidence here to promote vector
						retrieval or an abstention threshold.
					</p>
					<p>
						<strong>Branch candidate:</strong> DeepSeek request construction and
						fake-transport tests. <strong>Pending:</strong> successful DeepSeek
						selection, full Preview acceptance and exact-revision Production
						receipt. The existing production service has not been replaced by
						this branch.
					</p>
					<p>
						Observed on 13 November 2026: the first live probe reached DeepSeek
						and returned HTTP 402 (insufficient balance). It stopped after one
						call. No selected model, cache usage or answer-quality result is
						claimed. The Preview API separately returned the deterministic STOS
						answer with a revision-bound receipt; that does not pass the
						provider gate.
					</p>
				</section>
				<section id="comparison" className={styles.section}>
					<h2>A win matters. So does a regression.</h2>
					<p>
						The handoff reports that indexing reviewed Vietnamese text raised
						top-three hits from 4/8 to 5/8 while first-place hits fell from 3/8
						to 2/8. It also reports an abstention threshold declining both
						unrelated questions and 11/16 answerable questions. These are{" "}
						<strong>
							unverified handoff figures, not reproduced measurements
						</strong>
						. They must not be treated as this branch’s results.
					</p>
					<p>
						No winning or regressing question is invented here. Source-level
						comparisons remain pending the original intent pairs and ranked
						lists. The two unrelated requests belong outside the answerable
						denominator; rank four does not pass top-three.
					</p>
					<ul>
						<li>Keyword: incumbent implementation preserved.</li>
						<li>
							Multilingual E5 with exact cosine: original model revision and
							replay pending.
						</li>
						<li>Reciprocal rank fusion: original replay pending.</li>
					</ul>
					<p>
						Corpus: {study.corpusRecords} public records. Fingerprint:{" "}
						<code style={{ overflowWrap: "anywhere" }}>
							{study.corpusSha256}
						</code>
						.
					</p>
					<div className={styles.links}>
						<Link href="/retrieval-study-status.json" download>
							Download source IDs, fingerprint and measurement status ↓
						</Link>
						<a href={`${source}/visitor-api/evaluation/RETRIEVAL_STUDY.md`}>
							Reproduction boundary ↗
						</a>
						<a href={`${source}/visitor-api/evaluation/independent-review.md`}>
							Independent review protocol ↗
						</a>
					</div>
				</section>
				<section id="boundary" className={styles.section}>
					<h2>Inspect the actual request.</h2>
					<p>
						A fixed first system message sets the citation-only contract.
						Reviewed evidence and a server-selected role follow. Visitor
						context, history and the question are last. The parser rejects
						unknown IDs, malformed shape and truncated output; an empty
						selection permits abstention. Model-written prose and URLs are not
						displayed.
					</p>
					<p>
						The offline four-fixture probe checks byte-level prefix stability
						and sends zero requests. Live mode requires a staging key and an
						explicit four-call budget. Positive cache-hit tokens establish a
						cache read; zero is a miss and missing counters remain unknown. No
						cost saving is inferred from elapsed time.
					</p>
					<pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
						node visitor-api/scripts/probe-guide-prefix.mjs
					</pre>
					<p>
						The deployment verifier requires environment, exact commit SHA and a
						real-provider receipt for the holdout question, separately from the
						deterministic STOS question. An HTTP 200 or labelled fallback
						excerpt cannot satisfy that gate.
					</p>
					<div className={styles.links}>
						<Link href="/guide-prompt-audit.md" download>
							Download prompt audit ↓
						</Link>
						<a href={`${source}/visitor-api/lib/guide-model.js`}>
							Inspect request and parser ↗
						</a>
						<a href={`${source}/visitor-api/scripts/verify-deployed-guide.mjs`}>
							Inspect deployment verifier ↗
						</a>
					</div>
				</section>
				<footer className={styles.footer}>
					<p>
						No independent answer-quality score, recruiter response rate or
						business impact is claimed.
					</p>
					<Link href="/evidence/">Back to Engineering evidence →</Link>
				</footer>
			</main>
		</>
	);
}
