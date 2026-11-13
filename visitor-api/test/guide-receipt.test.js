import test from "node:test";
import assert from "node:assert/strict";
import { createGuideHandler } from "../api/guide.js";
const req = {
	method: "POST",
	headers: {
		origin: "https://duytruyenthong.github.io",
		"content-type": "application/json",
	},
	body: {
		question: "What is the local holdout log loss?",
		context: { role: "Recruiter", section: "Selected work" },
		recentTurns: [],
		interests: [],
	},
};
function res() {
	return {
		setHeader() {},
		status(s) {
			this.code = s;
			return this;
		},
		end(b) {
			this.body = JSON.parse(b);
		},
	};
}
async function isolated(run) {
	const keys = [
		"DEEPSEEK_API_KEY",
		"KV_REST_API_URL",
		"KV_REST_API_TOKEN",
		"GUIDE_RATE_SALT",
		"VERCEL_ENV",
		"VERCEL_GIT_COMMIT_SHA",
	];
	const before = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
	for (const k of keys) process.env[k] = "fixture";
	process.env.VERCEL_ENV = "preview";
	process.env.VERCEL_GIT_COMMIT_SHA = "a".repeat(40);
	try {
		await run();
	} finally {
		for (const k of keys) {
			if (before[k] === undefined) delete process.env[k];
			else process.env[k] = before[k];
		}
	}
}
const redis = () => ({ incr: async () => 1, expire: async () => 1 });
test("one DeepSeek POST produces a revision-bound sanitized receipt with measured zero cache hits", () =>
	isolated(async () => {
		let calls = 0;
		const h = createGuideHandler({
			makeRedis: redis,
			modelFetch: async (url, o) => {
				calls++;
				assert.equal(url, "https://api.deepseek.com/chat/completions");
				assert.equal(o.method, "POST");
				assert.equal(JSON.parse(o.body).max_tokens, 128);
				return {
					ok: true,
					status: 200,
					json: async () => ({
						model: "deepseek-flash",
						choices: [
							{
								finish_reason: "stop",
								message: { content: ' {"citations":["kkbox-results"]} ' },
							},
						],
						usage: {
							prompt_cache_hit_tokens: 0,
							prompt_cache_miss_tokens: 123,
							completion_tokens: 12,
						},
					}),
				};
			},
		});
		const r = res();
		await h(req, r);
		assert.equal(calls, 1);
		assert.equal(r.body.receipt.revision, "a".repeat(40));
		assert.equal(r.body.receipt.cacheHitTokens, 0);
		assert.equal(r.body.receipt.returnedModel, "deepseek-flash");
		assert.deepEqual(r.body.receipt.selectedIds, ["kkbox-results"]);
		assert.ok(!JSON.stringify(r.body.receipt).includes("visitorQuestion"));
	}));
for (const status of [402, 429])
	test(`provider HTTP ${status} preserves labelled excerpt with no retry`, () =>
		isolated(async () => {
			let calls = 0;
			const h = createGuideHandler({
				makeRedis: redis,
				modelFetch: async () => {
					calls++;
					return { ok: false, status };
				},
			});
			const r = res();
			await h(req, r);
			assert.equal(calls, 1);
			assert.equal(r.body.responseMode, "source-excerpt");
			assert.equal(r.body.receipt.providerStatus, status);
			assert.equal(r.body.receipt.returnedModel, null);
			assert.deepEqual(r.body.receipt.selectedIds, []);
		}));
