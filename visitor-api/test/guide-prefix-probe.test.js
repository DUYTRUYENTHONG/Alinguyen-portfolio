import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
const script = new URL("../scripts/probe-guide-prefix.mjs", import.meta.url);
function probe(transport) {
	const preload = `globalThis.fetch = async () => { ${transport} };`;
	const result = spawnSync(
		process.execPath,
		[
			"--import",
			`data:text/javascript,${encodeURIComponent(preload)}`,
			script.pathname.replace(/^\/(?=[A-Z]:)/i, ""),
			"--provider",
		],
		{
			encoding: "utf8",
			env: {
				...process.env,
				GROQ_API_KEY: "synthetic-fixture",
				GROQ_PROBE_MAX_CALLS: "4",
			},
		},
	);
	assert.equal(result.status, 0, result.stderr);
	assert.ok(!result.stdout.includes("synthetic-fixture"));
	return JSON.parse(result.stdout);
}
test("probe stops at one failed HTTP call without retries", () => {
	const r = probe("return {ok:false,status:402};");
	assert.equal(r.providerCalls, 1);
	assert.equal(r.records[0].providerStatus, 402);
});
test("probe retains sanitized timeout receipt without retrying", () => {
	const r = probe('throw Error("synthetic-fixture must not leak");');
	assert.equal(r.providerCalls, 1);
	assert.equal(r.records[0].outputMode, "transport-or-json-failure");
});
test("probe makes at most four calls and preserves missing usage as unknown", () => {
	const r = probe(
		'return {ok:true,status:200,json:async()=>({model:"openai/gpt-oss-20b",choices:[{message:{content:JSON.stringify({citations:[]})}}]})};',
	);
	assert.equal(r.providerCalls, 4);
	assert.equal(r.records[0].cachedTokens, null);
	assert.equal(r.identicalRepeat, true);
});

test('probe aggregate uses token-weighted share and preserves measured zero',()=>{const r=probe('return {ok:true,status:200,json:async()=>({model:"openai/gpt-oss-20b",usage:{prompt_tokens:100,prompt_tokens_details:{cached_tokens:0},completion_tokens:20},choices:[{message:{content:JSON.stringify({citations:[]})}}]})};');assert.equal(r.aggregateHitShare,0);assert.equal(r.records[0].cachedTokens,0);});
