import test from "node:test";
import assert from "node:assert/strict";
import { buildSelectionRequest, parseSelection } from "../lib/guide-model.js";
const sources = [{ id: "a", title: "A", text: "Approved public record" }];
const output = (content, finish_reason = "stop") => ({
	choices: [{ message: { content }, finish_reason }],
});
test("DeepSeek boundary preserves fixed prefix and documented controls", () => {
	const a = buildSelectionRequest(
			sources,
			{ role: "Engineer" },
			{ question: "First" },
		),
		b = buildSelectionRequest(
			sources,
			{ role: "Recruiter" },
			{ question: "Other" },
		);
	assert.deepEqual(a.messages[0], b.messages[0]);
	assert.equal(a.model, "deepseek-flash");
	assert.equal(a.stream, false);
	assert.equal(a.max_tokens, 128);
	assert.deepEqual(a.thinking, { type: "disabled" });
	assert.deepEqual(a.response_format, { type: "json_object" });
});
test("selection tolerates surrounding whitespace, deduplicates and permits abstention", () => {
	assert.deepEqual(
		parseSelection(output(' \n{"citations":["a","a"]}\n'), sources),
		sources,
	);
	assert.deepEqual(parseSelection(output('{"citations":[]}'), sources), []);
});
test("selection rejects invalid shape, unknown IDs, malformed and truncated output", () => {
	for (const text of [
		"   ",
		"no JSON",
		"null",
		"[]",
		"{}",
		'{"citations":"a"}',
		'{"citations":[3]}',
		'{"citations":["unknown"]}',
		'{"citations":[],"answer":"invented"}',
	])
		assert.throws(() => parseSelection(output(text), sources));
	assert.throws(() =>
		parseSelection(output('{"citations":["a"]}', "length"), sources),
	);
});
