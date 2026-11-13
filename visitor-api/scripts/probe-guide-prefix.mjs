import { createHash } from "node:crypto";
import {
	buildSelectionRequest,
	parseSelection,
	DEEPSEEK_URL,
} from "../lib/guide-model.js";
import { retrieveGuideSources } from "../lib/guide-retrieval.js";
const live = process.argv.includes("--provider");
if (
	live &&
	(!process.env.DEEPSEEK_API_KEY ||
		process.env.DEEPSEEK_PROBE_MAX_CALLS !== "4")
)
	throw Error(
		"Configure a staging DEEPSEEK_API_KEY and explicitly set DEEPSEEK_PROBE_MAX_CALLS=4 before live probing.",
	);
const fixtures = [
	{
		id: "first",
		role: "Recruiter",
		question: "What is the local holdout log loss?",
		history: [],
	},
	{
		id: "repeat",
		role: "Recruiter",
		question: "What is the local holdout log loss?",
		history: [],
	},
	{
		id: "role-change",
		role: "Engineer",
		question: "What is the local holdout log loss?",
		history: [],
	},
	{
		id: "history-change",
		role: "Recruiter",
		question: "What are its evaluation limitations?",
		history: [{ role: "user", text: "What is the local holdout log loss?" }],
	},
];
const hash = (x) => createHash("sha256").update(x).digest("hex");
const fixed = [];
const records = [];
for (const f of fixtures) {
	const sources = retrieveGuideSources(f.question, {
		role: f.role,
		section: "Selected work",
	});
	const body = buildSelectionRequest(
		sources,
		{ role: f.role, guideName: f.role === "Engineer" ? "Kai" : "Ari" },
		{
			visitorQuestion: f.question,
			recentConversation: f.history,
			currentSection: "Selected work",
		},
	);
	fixed.push(JSON.stringify(body.messages[0]));
	const record = {
		fixture: f.id,
		requestHash: hash(JSON.stringify(body)),
		fixedPrefixHash: hash(fixed.at(-1)),
		evidenceIds: sources.map((s) => s.id),
		providerCalled: false,
	};
	if (live) {
		const started = performance.now();
		record.providerCalled = true;
		try {
			const response = await fetch(DEEPSEEK_URL, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
				signal: AbortSignal.timeout(10000),
			});
			Object.assign(record, {
				providerCalled: true,
				providerStatus: response.status,
				latencyMs: Math.round(performance.now() - started),
			});
			if (!response.ok) {
				records.push(record);
				break;
			}
			const result = await response.json();
			try {
				record.selectedIds = parseSelection(result, sources).map((s) => s.id);
				record.outputMode = record.selectedIds.length
					? "reviewed-evidence"
					: "abstention";
			} catch {
				record.outputMode = "invalid-selection";
			}
			record.returnedModel =
				typeof result.model === "string" &&
				/^[a-zA-Z0-9._/-]{1,100}$/.test(result.model)
					? result.model
					: null;
			for (const key of [
				"prompt_cache_hit_tokens",
				"prompt_cache_miss_tokens",
				"completion_tokens",
			])
				record[key] =
					Number.isSafeInteger(result.usage?.[key]) && result.usage[key] >= 0
						? result.usage[key]
						: null;
		} catch {
			record.latencyMs = Math.round(performance.now() - started);
			record.outputMode = "transport-or-json-failure";
			records.push(record);
			break;
		}
	}
	records.push(record);
}
console.log(
	JSON.stringify(
		{
			mode: live ? "real-provider" : "offline-construction",
			fixedPrefixStable: new Set(fixed).size === 1,
			identicalRepeat: records[0]?.requestHash === records[1]?.requestHash,
			providerCalls: records.filter((r) => r.providerCalled).length,
			records,
			cost: "Not calculated: requires observed usage and dated rates for the returned model.",
		},
		null,
		2,
	),
);
