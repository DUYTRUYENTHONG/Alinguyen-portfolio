import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { knowledge } from "../lib/guide-knowledge.js";
import { retrieveGuideSources } from "../lib/guide-retrieval.js";
import { metrics, rrf, rankOf } from "../evaluation/ranking.js";
const root = new URL("../../", import.meta.url);
const questions = JSON.parse(
	await readFile(
		new URL("../evaluation/recruiter-questions.json", import.meta.url),
		"utf8",
	),
);
const hash = (s) => createHash("sha256").update(s).digest("hex");
const corpus = knowledge.map(({ id, title, text, textVi, url }) => ({
	id,
	title,
	text,
	textVi: textVi || "",
	url,
}));
if (process.argv.includes("--prepare")) {
	await mkdir(new URL("artifacts/retrieval/", root), { recursive: true });
	await writeFile(
		new URL("artifacts/retrieval/input.json", root),
		JSON.stringify({ corpus, questions }),
	);
	console.log(
		JSON.stringify({
			corpusRecords: corpus.length,
			corpusSha256: hash(JSON.stringify(corpus)),
		}),
	);
} else {
	const embedded = JSON.parse(
		await readFile(new URL("artifacts/retrieval/embedded.json", root), "utf8"),
	);
	if (
		embedded.inputSha256 !==
		hash(await readFile(new URL("artifacts/retrieval/input.json", root)))
	)
		throw Error("Embedding input mismatch");
	const rows = questions.map((q, i) => {
		const keyword = retrieveGuideSources(q.question, {
			role: "Recruiter",
			section: "Selected work",
		}).map((s) => s.id);
		const e5 = embedded.rows[i].baseline,
			enriched = embedded.rows[i].enriched;
		if (embedded.rows[i].id !== q.id) throw Error("Question mismatch");
		return {
			...q,
			methods: { keyword, e5, enriched, rrf: rrf([keyword, e5]) },
			ranks: Object.fromEntries(
				Object.entries({ keyword, e5, enriched, rrf: rrf([keyword, e5]) }).map(
					([m, ids]) => [m, q.expected ? rankOf(ids, q.expected) : null],
				),
			),
		};
	});
	const summary = Object.fromEntries(
		["en", "vi"].map((language) => [
			language,
			Object.fromEntries(
				["keyword", "e5", "enriched", "rrf"].map((method) => [
					method,
					metrics(
						rows
							.filter((r) => r.language === language)
							.map((r) => ({ ...r, ids: r.methods[method] })),
					),
				]),
			),
		]),
	);
	const result = {
		version: 1,
		dataset:
			"New authored development replay v1; NOT the missing historical replay",
		productionRanker: "keyword (unchanged)",
		independentEvaluation: "pending",
		corpusSha256: hash(JSON.stringify(corpus)),
		questionsSha256: hash(JSON.stringify(questions)),
		rankerSha256: hash(
			await readFile(new URL("../lib/guide-retrieval.js", import.meta.url)),
		),
		model: embedded.model,
		corpus,
		summary,
		rows,
		unrelated: rows
			.filter((r) => r.expected === null)
			.map((r) => ({
				id: r.id,
				returned: Object.fromEntries(
					Object.entries(r.methods).map(([m, ids]) => [m, ids.length]),
				),
				appropriateAbstention: Object.fromEntries(
					Object.entries(r.methods).map(([m, ids]) => [m, ids.length === 0]),
				),
			})),
		historicalReplay:
			"Not reproduced: original questions, pin and corpus snapshot unavailable. Do not compare denominators to the handoff.",
		providerCalls: 0,
	};
	await writeFile(
		new URL("public/recruiter-retrieval.json", root),
		JSON.stringify(result, null, 2) + "\n",
	);
	console.log(
		JSON.stringify(
			{
				summary,
				unrelated: result.unrelated,
				changes: rows
					.filter((r) => r.expected && r.ranks.e5 !== r.ranks.enriched)
					.map((r) => ({
						id: r.id,
						before: r.ranks.e5,
						after: r.ranks.enriched,
					})),
			},
			null,
			2,
		),
	);
}
