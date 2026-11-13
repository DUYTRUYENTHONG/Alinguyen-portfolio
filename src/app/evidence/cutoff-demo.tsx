"use client";
import { useState } from "react";
import { cutoffDates, listeningEvents, snapshot } from "./cutoff-model";
import styles from "./demo.module.css";

export function CutoffDemo() {
	const [index, setIndex] = useState(2);
	const cutoff = cutoffDates[index];
	const result = snapshot(listeningEvents, cutoff);
	const withFuture = snapshot(
		[...listeningEvents, { id: "future", date: "2017-03-03", seconds: 9999 }],
		cutoff,
	);
	return (
		<section className={styles.demo} aria-labelledby="cutoff-title">
			<p className="eyebrow">Synthetic data · zero API calls</p>
			<h2 id="cutoff-title">Move the prediction cutoff.</h2>
			<p>
				A feature can only use what was available when the prediction was made.
				This date-only example includes events exactly at the cutoff, matching
				the project’s inclusive rule.
			</p>
			<label htmlFor="prediction-cutoff">
				Prediction date: <strong>{cutoff}</strong>
			</label>
			<input
				id="prediction-cutoff"
				type="range"
				min="0"
				max={cutoffDates.length - 1}
				step="1"
				value={index}
				aria-valuetext={cutoff}
				onChange={(e) => setIndex(Number(e.target.value))}
			/>
			<p className={styles.hint}>
				Use the slider or arrow keys. 26 February – 2 March 2017.
			</p>
			<ul className={styles.events}>
				{listeningEvents.map((event) => (
					<li key={event.id} data-eligible={event.date <= cutoff}>
						<time dateTime={event.date}>{event.date}</time>
						<span>{event.seconds} listening seconds</span>
						<strong>
							{event.date <= cutoff
								? "Included · on/before cutoff"
								: "Excluded · after cutoff"}
						</strong>
					</li>
				))}
			</ul>
			<div role="status" aria-live="polite">
				<strong>{result.count} eligible listening events</strong>
				<p>
					{listeningEvents
						.filter((e) => e.date <= cutoff)
						.map((e) => e.seconds)
						.join(" + ") || "0"}{" "}
					= {result.seconds} seconds.
				</p>
			</div>
			<details>
				<summary>Check: can a future event change this snapshot?</summary>
				<p>
					Add 9,999 seconds dated 2017-03-03. Count: {result.count} →{" "}
					{withFuture.count}. Seconds: {result.seconds} → {withFuture.seconds}.{" "}
					<strong>
						{JSON.stringify(result) === JSON.stringify(withFuture)
							? "Unchanged: pass."
							: "Failed."}
					</strong>{" "}
					This is an executable synthetic check, not a model performance score.
				</p>
			</details>
			<p>
				A local within-cohort holdout does not establish future-cohort
				performance. Disputed scores remain omitted.
			</p>
			<a href="https://github.com/DUYTRUYENTHONG/kkbox-customer-churn-prediction/blob/main/tests/test_features.py#L16-L34">
				Inspect the real future-event exclusion test ↗
			</a>
		</section>
	);
}
