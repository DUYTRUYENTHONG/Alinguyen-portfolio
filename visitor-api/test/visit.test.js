import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import handler from "../api/visit.js";

test("existing portfolio visit endpoint preserves its role contract and original Redis keys", async () => {
	const names = ["VISITOR_HASH_SALT", "KV_REST_API_URL", "KV_REST_API_TOKEN"];
	const before = Object.fromEntries(names.map((n) => [n, process.env[n]]));
	const original = globalThis.fetch,
		calls = [];
	for (const n of names)
		process.env[n] =
			n === "KV_REST_API_URL"
				? "https://mock.upstash.io"
				: "fixture-secret-32-characters-for-legacy";
	globalThis.fetch = async (_url, init) => {
		const command = JSON.parse(String(init.body));
		calls.push(command);
		const result = {
			result: [
				1,
				1,
				1,
				["VN", "1"].map((v) => Buffer.from(v).toString("base64")),
			],
		};
		return Response.json(Array.isArray(command[0]) ? [result] : result);
	};
	const response = () => ({
		headers: {},
		statusCode: 0,
		body: null,
		setHeader(k, v) {
			this.headers[k] = v;
		},
		status(n) {
			this.statusCode = n;
			return this;
		},
		end(v) {
			this.body = JSON.parse(v);
		},
	});
	try {
		const req = {
				method: "POST",
				headers: {
					origin: "https://duytruyenthong.github.io",
					"content-type": "application/json",
					"x-vercel-ip-country": "VN",
				},
				body: { visitorId: randomUUID(), role: "Engineer" },
			},
			res = response();
		await handler(req, res);
		assert.equal(res.statusCode, 200);
		assert.deepEqual(res.body, {
			total: 1,
			ordinal: 1,
			roleCount: 1,
			countries: [{ code: "VN", count: 1 }],
		});
		const command = JSON.stringify(calls);
		assert.ok(command.includes("portfolio:visitor:total"));
		assert.ok(!command.includes("traffic:no-bloom"));
		assert.ok(!command.includes(req.body.visitorId));
		const invalid = response();
		await handler({ ...req, body: { ...req.body, role: "invented" } }, invalid);
		assert.equal(invalid.statusCode, 400);
		assert.equal(calls.length, 1);
	} finally {
		globalThis.fetch = original;
		for (const n of names) {
			if (before[n] === undefined) delete process.env[n];
			else process.env[n] = before[n];
		}
	}
});
