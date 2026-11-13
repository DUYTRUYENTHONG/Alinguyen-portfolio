"use client";
import { useState } from "react";
import study from "../../../../public/recruiter-retrieval.json";
import styles from "../demo.module.css";
const methods = {
	keyword: "Production keyword",
	e5: "E5 exact cosine",
	enriched: "E5 + reviewed Vietnamese",
	rrf: "RRF (keyword + E5)",
};
type Method = keyof typeof methods;
export function RetrievalComparison() {
	const [language, setLanguage] = useState("vi");
	const [family, setFamily] = useState("leakage");
	const row =
		study.rows.find((r) => r.language === language && r.family === family) ??
		study.rows.find((r) => r.language === language) ??
		study.rows[0];
	const source = study.corpus.find((s) => s.id === row.expected);
	return (
		<div className={styles.demo}>
			<p className="eyebrow">Recorded offline · zero provider calls</p>
			<label htmlFor="retrieval-language">Question language</label>
			<select
				id="retrieval-language"
				value={language}
				onChange={(e) => setLanguage(e.target.value)}
			>
				<option value="vi">Tiếng Việt</option>
				<option value="en">English</option>
			</select>
			<label htmlFor="retrieval-question">Authored development question</label>
			<select
				id="retrieval-question"
				value={row.family}
				onChange={(e) => setFamily(e.target.value)}
			>
				{study.rows
					.filter((r) => r.language === language)
					.map((r) => (
						<option key={r.id} value={r.family}>
							{r.question}
						</option>
					))}
			</select>
			<p>
				<strong>{row.question}</strong>
			</p>
			<p>
				Expected:{" "}
				{source ? (
					<a href={source.url}>{source.title} ↗</a>
				) : (
					"No supported source · unrelated control"
				)}
				.
			</p>
			<div className={styles.methods}>
				{(Object.keys(methods) as Method[]).map((method) => {
					const ids: string[] = row.methods[method];
					const rank = row.expected ? ids.indexOf(row.expected) + 1 : 0;
					return (
						<article key={method}>
							<h3>{methods[method]}</h3>
							<p>
								{row.expected
									? `Expected source rank: ${rank || "not returned"}. ${rank > 0 && rank <= 3 ? "Top-three hit." : "Top-three miss."}`
									: `${ids.length} results returned; ${ids.length ? "not an appropriate abstention." : "appropriate abstention."}`}
							</p>
							<ol>
								{ids.slice(0, 3).map((id) => {
									const s = study.corpus.find((s) => s.id === id);
									return (
										<li key={id}>
											<a href={s?.url}>{s?.title ?? id} ↗</a>
										</li>
									);
								})}
							</ol>
							{!ids.length && <p>No results.</p>}
						</article>
					);
				})}
			</div>
			<details>
				<summary>All recorded ranks and metrics</summary>
				<p>
					Answerable questions only: eight per language. Rank four is a miss.
					Reciprocal rank is zero beyond three. The two unrelated controls are
					scored separately.
				</p>
				{(["en", "vi"] as const).map((lang) => (
					<div key={lang}>
						<h3>{lang === "en" ? "English" : "Vietnamese"}</h3>
						{(Object.keys(methods) as Method[]).map((method) => {
							const s = study.summary[lang][method];
							return (
								<p key={method}>
									{methods[method]}: top-1 {s.top1?.toFixed(3)}, top-3{" "}
									{s.top3?.toFixed(3)}, MRR@3 {s.mrr3?.toFixed(3)}.
								</p>
							);
						})}
					</div>
				))}
				<p className={styles.fingerprint}>
					Corpus SHA-256: {study.corpusSha256}
					<br />
					Model: {study.model.name}@{study.model.revision}
				</p>
			</details>
		</div>
	);
}
