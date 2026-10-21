import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID, createHmac } from "node:crypto";
import { createTrafficHandler } from "../api/traffic.js";
import {
	getTrafficProject,
	projectDefinitions,
} from "../lib/traffic-projects.js";
import { trafficOperation, TrafficRateLimit } from "../lib/traffic-store.js";
import {
	authorizedReportProject,
	reportingDays,
} from "../lib/traffic-report.js";

const origin = "https://duytruyenthong.github.io";
const env = {
	VERCEL: "1",
	VERCEL_ENV: "production",
	KV_REST_API_URL: "https://mock.upstash.io",
	KV_REST_API_TOKEN: "fixture",
	TRAFFIC_NO_BLOOM_HASH_SALT: "a".repeat(40),
};
const body = () => ({
	projectId: "no-bloom",
	visitorId: randomUUID(),
	eventId: randomUUID(),
	path: "/",
});
function request(
	payload = body(),
	{ method = "POST", headers = {}, query = "" } = {},
) {
	return new Request(`https://example.test/api/traffic${query}`, {
		method,
		headers: { Origin: origin, "Content-Type": "application/json", ...headers },
		...(method === "POST"
			? {
					body: typeof payload === "string" ? payload : JSON.stringify(payload),
				}
			: {}),
	});
}
function fixture(options = {}) {
	const calls = [];
	return {
		calls,
		handler: createTrafficHandler({
			env,
			makeRedis: () => ({}),
			operation: async (...args) => {
				calls.push(args);
				return args[2] === "read" ? { pageViews: 7, uniqueBrowsers: 2 } : null;
			},
			...options,
		}),
	};
}

test("registered project records minimal ack, project-specific HMAC, trusted country and UTC server time", async () => {
	const now = Date.parse("2026-10-21T00:00:00Z"),
		f = fixture({ now: () => now }),
		p = body();
	const r = await f.handler(
		request(p, { headers: { "x-vercel-ip-country": "VN" } }),
	);
	assert.equal(r.status, 200);
	assert.deepEqual(await r.json(), { recorded: true });
	assert.equal(r.headers.get("cache-control"), "no-store");
	const [, project, mode, event, time] = f.calls[0];
	assert.equal(project.namespace, "traffic:no-bloom:production:v1");
	assert.equal(mode, "record");
	assert.equal(time, now);
	assert.equal(event.country, "VN");
	assert.equal(
		event.digest,
		createHmac("sha256", env.TRAFFIC_NO_BLOOM_HASH_SALT)
			.update(`traffic:no-bloom:browser:v1:${p.visitorId}`)
			.digest("hex"),
	);
	assert.ok(!JSON.stringify(event).includes(p.visitorId));
	assert.deepEqual(Object.keys(event).sort(), [
		"country",
		"digest",
		"eventId",
		"path",
	]);
});
test("unknown projects, project/origin mismatches and private paths never reach storage", async () => {
	const f = fixture(),
		other = {
			...projectDefinitions,
			other: {
				...projectDefinitions["no-bloom"],
				origins: ["https://other.example"],
				secretEnv: "OTHER_SECRET",
			},
		};
	const mismatch = fixture({ definitions: other });
	assert.equal(
		(await mismatch.handler(request({ ...body(), projectId: "other" }))).status,
		403,
	);
	assert.equal(mismatch.calls.length, 0);
	for (const p of [
		{ ...body(), projectId: "unknown" },
		{ ...body(), projectId: "__proto__" },
		{ ...body(), path: "/?for=Private" },
		{ ...body(), path: "/card/private-token" },
		{ ...body(), role: "none" },
		{ ...body(), name: "Private" },
		{ ...body(), visitorId: "bad" },
		null,
	])
		assert.equal((await f.handler(request(p))).status, 400);
	assert.equal(
		(
			await f.handler(
				request(body(), { headers: { Origin: "https://evil.example" } }),
			)
		).status,
		403,
	);
	assert.equal(f.calls.length, 0);
});
test("body/media/method boundaries, preflight and GPC are enforced", async () => {
	const f = fixture();
	assert.equal((await f.handler(request("{broken"))).status, 400);
	assert.equal((await f.handler(request("x".repeat(4097)))).status, 413);
	assert.equal(
		(
			await f.handler(
				request(body(), { headers: { "Content-Type": "text/plain" } }),
			)
		).status,
		415,
	);
	assert.equal(
		(await f.handler(request(body(), { headers: { "Sec-GPC": "1" } }))).status,
		403,
	);
	assert.equal((await f.handler(request(null, { method: "PUT" }))).status, 405);
	assert.equal(
		(await f.handler(request(null, { method: "OPTIONS" }))).status,
		204,
	);
	assert.equal(
		(
			await f.handler(
				request(null, { method: "OPTIONS", query: "?projectId=unknown" }),
			)
		).status,
		403,
	);
	assert.equal(f.calls.length, 0);
});
test("public reads are limited to one approved project aggregate; detailed/unknown queries refused", async () => {
	const f = fixture(),
		r = await f.handler(
			request(null, { method: "GET", query: "?projectId=no-bloom" }),
		);
	assert.deepEqual(await r.json(), { pageViews: 7, uniqueBrowsers: 2 });
	for (const query of [
		"",
		"?projectId=unknown",
		"?projectId=no-bloom&raw=true",
		"?projectId=no-bloom&projectId=no-bloom",
	])
		assert.equal(
			(await f.handler(request(null, { method: "GET", query }))).status,
			400,
		);
	assert.equal(f.calls.length, 1);
});
test("local enablement is explicit and cannot enable localhost in production; preview data isolated", () => {
	assert.equal(
		getTrafficProject("no-bloom", "http://localhost:3100", env),
		null,
	);
	assert.equal(
		getTrafficProject("no-bloom", "http://localhost:3100", {
			...env,
			TRAFFIC_ALLOW_LOCAL: "true",
		}),
		null,
	);
	const development = {
		...env,
		VERCEL_ENV: "development",
		TRAFFIC_ALLOW_LOCAL: "true",
	};
	assert.equal(
		getTrafficProject("no-bloom", "http://localhost:3100", development)
			.namespace,
		"traffic:no-bloom:development:v1",
	);
	assert.equal(
		getTrafficProject("no-bloom", "http://localhost:3101", development),
		null,
	);
	assert.equal(
		getTrafficProject("no-bloom", origin, { ...env, VERCEL_ENV: "preview" })
			.namespace,
		"traffic:no-bloom:staging:v1",
	);
});
test("missing config and storage failure return unavailable; rate limiting includes retry guidance", async () => {
	const missing = fixture({ env: { ...env, TRAFFIC_NO_BLOOM_HASH_SALT: "" } });
	assert.equal((await missing.handler(request())).status, 503);
	assert.equal(missing.calls.length, 0);
	const failed = fixture({
			operation: async () => {
				throw Error("private database failure");
			},
		}),
		r = await failed.handler(request());
	assert.equal(r.status, 503);
	assert.equal(await r.text(), '{"error":"temporarily_unavailable"}');
	const limited = fixture({
			operation: async () => {
				throw new TrafficRateLimit();
			},
		}),
		retry = await limited.handler(request());
	assert.equal(retry.status, 429);
	assert.equal(retry.headers.get("retry-after"), "60");
});
test("non-Vercel country metadata cannot be fabricated", async () => {
	const f = fixture({ env: { ...env, VERCEL: undefined } });
	await f.handler(
		request(body(), { headers: { "x-vercel-ip-country": "VN" } }),
	);
	assert.equal(f.calls[0][3].country, "unknown");
});
test("Redis uses one atomic EVAL, isolated project and shared keys and UTC midnight", async () => {
	const calls = [],
		redis = {
			eval: async (...args) => {
				calls.push(args);
				return [1];
			},
		},
		project = getTrafficProject("no-bloom", origin, env),
		event = {
			digest: "a".repeat(64),
			eventId: randomUUID(),
			path: "/",
			country: "unknown",
		};
	await trafficOperation(
		redis,
		project,
		"record",
		event,
		Date.parse("2026-10-20T23:59:59Z"),
		{ minuteCap: 120, dayCap: 1000 },
	);
	await trafficOperation(
		redis,
		project,
		"record",
		event,
		Date.parse("2026-10-21T00:00:00Z"),
		{ minuteCap: 120, dayCap: 1000 },
	);
	assert.equal(calls.length, 2);
	assert.equal(calls[0][1].length, 12);
	assert.ok(
		calls[0][1]
			.slice(0, 10)
			.every((k) => k.startsWith(`${project.namespace}:`)),
	);
	assert.ok(
		calls[0][1]
			.slice(10)
			.every((k) => k.startsWith("traffic:shared:production:v1:")),
	);
	assert.ok(calls[0][1].some((k) => k.includes("day:2026-10-20:views")));
	assert.ok(calls[1][1].some((k) => k.includes("day:2026-10-21:views")));
});
test("project hashing and report authorization remain separate even for the same origin and UUID", async () => {
	const definitions = {
		...projectDefinitions,
		other: { ...projectDefinitions["no-bloom"], secretEnv: "OTHER_SECRET" },
	};
	const f = fixture({
			definitions,
			env: { ...env, OTHER_SECRET: "b".repeat(40) },
		}),
		p = body();
	await f.handler(request(p));
	await f.handler(request({ ...p, projectId: "other" }));
	assert.notEqual(f.calls[0][3].digest, f.calls[1][3].digest);
	assert.notEqual(f.calls[0][1].namespace, f.calls[1][1].namespace);
	assert.throws(() => authorizedReportProject("no-bloom", env));
	assert.throws(() =>
		authorizedReportProject("other", {
			...env,
			TRAFFIC_REPORT_PROJECTS: "no-bloom",
		}),
	);
	assert.equal(
		authorizedReportProject("no-bloom", {
			...env,
			TRAFFIC_REPORT_PROJECTS: "no-bloom",
		}),
		"traffic:no-bloom:production:v1",
	);
	assert.deepEqual(
		reportingDays(
			"2026-10-20",
			"2026-10-22",
			Date.parse("2026-10-21T17:00:00Z"),
		),
		["2026-10-20", "2026-10-21"],
	);
	assert.throws(() => reportingDays("2026-02-30", "2026-03-01"));
	assert.throws(() => reportingDays("2026-01-01", "2026-03-01"));
});
