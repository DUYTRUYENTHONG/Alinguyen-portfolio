const [endpoint, revision, environment] = process.argv.slice(2);
if (
	!endpoint ||
	!/^https:\/\//.test(endpoint) ||
	!/^[a-f0-9]{40}$/.test(revision ?? "") ||
	!["preview", "production"].includes(environment)
)
	throw Error(
		"Usage: node verify-deployed-guide.mjs HTTPS_URL EXACT_GIT_SHA preview|production",
	);
const fixtures = [
	{
		id: "deterministic",
		question: "Is STOS live?",
		source: "stos",
		provider: false,
	},
	{
		id: "provider",
		question: "What is the local holdout log loss?",
		source: "kkbox-results",
		provider: true,
	},
];
for (const f of fixtures) {
	const response = await fetch(endpoint, {
		method: "POST",
		headers: {
			Origin: "https://duytruyenthong.github.io",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			question: f.question,
			context: {
				page: "/Alinguyen-portfolio/",
				section: "Selected work",
				role: "Recruiter",
			},
			recentTurns: [],
			interests: [],
		}),
		signal: AbortSignal.timeout(20000),
	});
	const result = await response.json();
	const r = result.receipt;
	const passed =
		response.status === 200 &&
		r?.environment === environment &&
		r?.revision === revision &&
		r?.providerAttempted === f.provider &&
		result.citations?.some((c) => c.sourceId === f.source) &&
		(!f.provider ||
			(r.providerStatus === 200 &&
				typeof r.returnedModel === "string" &&
				r.returnedModel.startsWith("deepseek") &&
				r.selectedIds?.includes(f.source) &&
				result.responseMode === "reviewed-evidence" &&
				/omitted|disputed/i.test(result.answer)));
	console.log(
		JSON.stringify({
			fixture: f.id,
			passed,
			httpStatus: response.status,
			receipt: r ?? null,
		}),
	);
	if (!passed)
		throw Error(
			`Deployment verification failed: ${f.id}; retain current production.`,
		);
}
