import { Redis } from "@upstash/redis";
import { randomUUID } from "node:crypto";
import assert from "node:assert/strict";
import { trafficOperation, TrafficRateLimit } from "../lib/traffic-store.js";
import { readTrafficReport } from "../lib/traffic-report.js";
if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN)
	throw Error("Isolated-test connection required");
const redis = new Redis({
	url: process.env.KV_REST_API_URL,
	token: process.env.KV_REST_API_TOKEN,
	retry: false,
	signal: () => AbortSignal.timeout(5000),
});
const prefixes = new Set();
const makeProject = (
	projectId = "no-bloom",
	scope = `test-${randomUUID()}`,
) => {
	const namespace = `traffic:${projectId}:${scope}:v1`;
	prefixes.add(namespace);
	prefixes.add(`traffic:shared:${scope}:v1`);
	return {
		projectId,
		scope,
		namespace,
		minuteCap: 1000,
		dayCap: 10000,
		browserCap: 100000,
	};
};
const safe = {
	eval: async (script, keys, args) => {
		assert.ok(
			keys.every((k) => [...prefixes].some((p) => k.startsWith(`${p}:`))),
		);
		return redis.eval(script, keys, args);
	},
};
const overall = { minuteCap: 5000, dayCap: 10000 },
	time = Date.parse("2026-10-20T23:59:59Z"),
	A = "a".repeat(64),
	B = "b".repeat(64);
const event = (
	digest = A,
	eventId = randomUUID(),
	path = "/",
	country = "unknown",
) => ({ digest, eventId, path, country });
const op = (project, mode, e = null, now = time, limits = overall) =>
	trafficOperation(safe, project, mode, e, now, limits);
async function cleanup() {
	for (const prefix of prefixes) {
		let cursor = "0",
			count = 0;
		do {
			const [next, keys] = await redis.scan(cursor, {
				match: `${prefix}:*`,
				count: 200,
			});
			cursor = String(next);
			assert.ok(keys.every((k) => k.startsWith(`${prefix}:`)));
			count += keys.length;
			if (count > 5000) throw Error("Refusing unexpectedly large test cleanup");
			if (keys.length) await redis.del(...keys);
		} while (cursor !== "0");
	}
}
let failure;
try {
	const p = makeProject(),
		repeat = randomUUID();
	await op(p, "record", event(A, repeat));
	await op(p, "record", event(A, repeat));
	const duplicate = randomUUID();
	await Promise.all(
		Array.from({ length: 32 }, () => op(p, "record", event(A, duplicate))),
	);
	await Promise.all(
		Array.from({ length: 20 }, (_, i) =>
			op(
				p,
				"record",
				event(
					i % 2 ? B : A,
					randomUUID(),
					i % 2 ? "/credits" : "/",
					i % 2 ? "unknown" : "VN",
				),
			),
		),
	);
	assert.deepEqual(await op(p, "read"), { pageViews: 22, uniqueBrowsers: 2 });
	await op(p, "record", event(A, randomUUID(), "/", "VN"), time + 1000);
	assert.deepEqual(await op({ ...p }, "read"), {
		pageViews: 23,
		uniqueBrowsers: 2,
	});
	const other = makeProject("fixture-other", p.scope);
	await op(other, "record", event(A, repeat));
	assert.deepEqual(await op(other, "read"), {
		pageViews: 1,
		uniqueBrowsers: 1,
	});
	assert.deepEqual(await op(p, "read"), { pageViews: 23, uniqueBrowsers: 2 });
	const report = await readTrafficReport(safe, p.namespace, [
		"2026-10-20",
		"2026-10-21",
	]);
	assert.equal(report.intervalApproximateUniqueBrowsers, 2);
	assert.deepEqual(
		report.daily.map((d) => d.approximateUniqueBrowsers),
		[2, 1],
	);
	assert.deepEqual(report.countryPageViews, { unknown: 12, VN: 11 });
	assert.deepEqual(report.topPaths, { "/": 13, "/credits": 10 });
	assert.equal(await redis.ttl(`${p.namespace}:views`), -1);
	assert.equal(await redis.ttl(`${p.namespace}:browsers`), -1);
	assert.ok((await redis.ttl(`${p.namespace}:event:${repeat}`)) > 86300);
	assert.ok(
		(await redis.ttl(`${p.namespace}:day:2026-10-20:browsers`)) > 34559000,
	);
	await redis.del(
		`${p.namespace}:day:2026-10-20:views`,
		`${p.namespace}:day:2026-10-20:browsers`,
	);
	assert.deepEqual(await op(p, "read"), { pageViews: 23, uniqueBrowsers: 2 });
	const limited = { ...makeProject(), minuteCap: 2 };
	await op(limited, "record", event());
	await op(limited, "record", event());
	await assert.rejects(() => op(limited, "record", event(B)), TrafficRateLimit);
	const sharedA = makeProject(),
		sharedB = makeProject("fixture-other", sharedA.scope),
		sharedCap = { minuteCap: 2, dayCap: 100 };
	await op(sharedA, "record", event(), time, sharedCap);
	await op(sharedB, "record", event(), time, sharedCap);
	await assert.rejects(
		() => op(sharedB, "record", event(B), time, sharedCap),
		TrafficRateLimit,
	);
	const capacity = { ...makeProject(), browserCap: 2 };
	await op(capacity, "record", event(A));
	await op(capacity, "record", event(B));
	await assert.rejects(
		() => op(capacity, "record", event("c".repeat(64))),
		TrafficRateLimit,
	);
	await op(capacity, "record", event(A));
	const corrupt = makeProject();
	await redis.hset(`${corrupt.namespace}:paths`, { "/": "1.5" });
	await assert.rejects(() => op(corrupt, "record", event()));
	assert.equal(await redis.get(`${corrupt.namespace}:views`), null);
	console.log(
		"Actual shared Redis PASS: concurrent duplicates/unique events, project isolation, returning browsers, UTC midnight, distinct interval reporting, country/path totals, retention, per-project/shared limits and corruption guards. Only random test namespaces used.",
	);
} catch (error) {
	failure = error;
}
try {
	await cleanup();
} catch (error) {
	failure ??= error;
}
if (failure) throw failure;
