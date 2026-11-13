import examples from "../../../public/actor-walkthroughs.json";
import study from "../../../public/action-selector-study.json";
import regression from "../../../docs/evidence/action-negation-regression.json";
import { PortfolioLink as Link } from "../portfolio-link";
import styles from "./page.module.css";
export function ActorEvidence() {
	const training = study.trainingStatus as {
		updates: number;
		complete: boolean;
		adapterSha256: string | null;
	} | null;
	return (
		<section
			className={styles.section}
			id="actor-policy"
			aria-labelledby="actor-policy-title"
		>
			<p className="eyebrow">Recorded walkthroughs · no API quota</p>
			<h2 id="actor-policy-title">An answer. A source. A useful next step.</h2>
			<p>
				These public synthetic questions ran through the local handler with an
				isolated admission store. The outage example uses fake transport. They
				demonstrate reviewed rendering and action selection, not real Groq
				selection.
			</p>
			<div className={styles.twoColumns}>
				{examples.rows.map((row) => (
					<article className={styles.panel} key={row.audience}>
						<p className={styles.label}>{row.audience}</p>
						<h3>{row.question}</h3>
						<p>{row.answer}</p>
						<p>
							<strong>Why this next step:</strong> {row.why}
						</p>
						<p>
							Records:{" "}
							{row.citations.map((c) => c.sourceId).join(", ") ||
								"None · unsupported premise"}
						</p>
						{row.citations.map((c) => (
							<a key={c.sourceId} href={c.url}>
								{c.label} ↗
							</a>
						))}
						<p>Next action: {row.actions[0]?.label ?? "None"}</p>
						{row.actions.map((a) => (
							<a key={a.id} href={a.url}>
								{a.label} ↗
							</a>
						))}
					</article>
				))}
			</div>
			<h3>A policy failure worth keeping.</h3>
			<p>
				“{regression.question}” originally offered{" "}
				<code>{regression.before}</code>, ignoring the refusal. An explicit
				negation guard now selects <code>{regression.after}</code>. This is a
				separate authored regression replay, not a held-out model win.
			</p>
			<h3>Rules first. A learned policy must earn its place.</h3>
			<p>
				The eight authored held-out action cases contain four English and four
				Vietnamese examples. Rules select an acceptable first action in{" "}
				{study.rules.all.acceptable}/{study.rules.all.examples}; planned-feature
				demo errors: {study.rules.all.plannedFeatureCritical}. These small
				authored labels are not independent review.
			</p>
			<p>
				Untuned base:{" "}
				{study.base.all.acceptable === null
					? "not yet evaluated"
					: `${study.base.all.acceptable}/${study.base.all.examples}`}
				. LoRA:{" "}
				{study.adapter.all.acceptable === null
					? "not yet evaluated"
					: `${study.adapter.all.acceptable}/${study.adapter.all.examples}`}
				.{" "}
				{training
					? `${training.updates} updates recorded; ${training.complete ? "declared training budget completed" : "partial pipeline verification only"}.`
					: "Local training comparison pending."}{" "}
				The recorded run also crossed a CV paraphrase between training and development. The corrected split is runnable but untrained; these numbers are descriptive, not promotion evidence. No learned action table is deployed.
			</p>
			<p>
				Online: validation → deterministic route or keyword retrieval → at most
				one Groq evidence selection → reviewed answer → allowlisted action
				policy → visitor-controlled link. Offline: family split → pinned base +
				assistant-only LoRA → development checkpoint → one authored held-out
				comparison → review before any promotion.
			</p>
			<p>
				Engagement conversion is unavailable. Existing consent covers
				project-link aggregates, not eligible chat-session denominators, CV or
				contact outcomes. Collection scope remains unchanged. A link click would
				not establish a meeting or partnership.
			</p>
			<div className={styles.links}>
				<Link href="/actor-walkthroughs.json" download>
					Inspect recorded replies ↓
				</Link>
				<Link href="/action-selector-study.json" download>
					Inspect action scorecard ↓
				</Link>
				<Link href="/guide-prompt-audit.md" download>
					Inspect prompt audit ↓
				</Link>
			</div>
		</section>
	);
}
