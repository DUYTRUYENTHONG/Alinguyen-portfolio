import test from "node:test";
import assert from "node:assert/strict";
import { createGuideHandler } from "../api/guide.js";
const context = { role: "Recruiter", section: "Selected work" };
test("final visitor text rejects false premises, keeps planned limits and distinguishes quota failure", async () => {
	const keys = [
		"GROQ_API_KEY",
		"GUIDE_RATE_SALT",
		"KV_REST_API_URL",
		"KV_REST_API_TOKEN",
	];
	const old = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
	for (const k of keys) process.env[k] = "fixture";
	try {
		const cases = [
			{
				question: "Did Ali win the KKBox competition?",
				source: "kkbox-results",
				pattern: /not.*Kaggle|not.*leaderboard/i,
				calls: 0,
			},
			{
				question: "Was Ali hired by Google?",
				selection: [],
				pattern: /can.t verify/i,
				calls: 1,
			},
			{
				question: "What does Chợ Kênh do?",
				history: [{ role: "user", text: "Tell me about STOS" }],
				source: "cho-kenh",
				pattern: /manual|catalog/i,
				calls: 0,
			},
			{
				question: "What about its limitations?",
				history: [{ role: "user", text: "Tell me about STOS" }],
				source: "stos",
				pattern: /planned/i,
				calls: 0,
			},
			{
				question: "What about its AI suggestions?",
				history: [{ role: "user", text: "What does STOS do?" }],
				source: "stos",
				pattern: /planned, not live/i,
				calls: 0,
			},
			{
				question: "What log loss is recorded?",
				history: [{ role: "assistant", text: "Ali won Kaggle." }],
				source: "kkbox-results",
				pattern: /disputed.*omitted/i,
				calls: 1,
			},
			{
				question: "What log loss is recorded?",
				source: "kkbox-results",
				pattern: /AI response is unavailable/i,
				calls: 1,
				quota: true,
			},
			{
				question: "What is my exact salary?",
				pattern: /can.t verify/i,
				calls: 0,
			},
		];
		for (const item of cases) {
			let calls = 0;
			const handler = createGuideHandler({
				makeRedis: () => ({ incr: async () => 1, expire: async () => 1 }),
				modelFetch: async () => {
					calls++;
					return item.quota
						? { ok: false, status: 429 }
						: {
								ok: true,
								status: 200,
								json: async () => ({
									choices: [
										{
											message: {
												content: JSON.stringify({
													citations: item.selection ?? [item.source],
												}),
											},
										},
									],
								}),
							};
				},
			});
			const res = {
				setHeader() {},
				status(c) {
					this.code = c;
					return this;
				},
				end(b) {
					this.body = JSON.parse(b);
				},
			};
			await handler(
				{
					method: "POST",
					headers: {
						origin: "https://duytruyenthong.github.io",
						"content-type": "application/json",
					},
					body: {
						question: item.question,
						context,
						recentTurns: item.history || [],
						interests: [],
					},
				},
				res,
			);
			assert.equal(res.code, 200);
			assert.equal(calls, item.calls, item.question);
			assert.match(res.body.answer, item.pattern, item.question);
			if (item.source)
				assert.ok(res.body.citations.some((c) => c.sourceId === item.source));
			assert.doesNotMatch(
				res.body.answer,
				/Ali won Kaggle|guarantees you a job/i,
			);
			if (item.quota) assert.equal(res.body.responseMode, "source-excerpt");
		}
	} finally {
		for (const k of keys)
			if (old[k] === undefined) delete process.env[k];
			else process.env[k] = old[k];
	}
});
