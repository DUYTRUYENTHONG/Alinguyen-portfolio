import test from "node:test";
import assert from "node:assert/strict";
import { buildSelectionRequest, parseSelection } from "../lib/guide-model.js";
const sources = [{ id: "a", title: "A", text: "Approved public record" }];
const output = (content, finish_reason = "stop") => ({
	choices: [{ message: { content }, finish_reason }],
});
test("Groq boundary preserves fixed prefix and documented controls", () => {
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
	assert.equal(a.model, "openai/gpt-oss-20b");
	assert.equal(a.stream, false);
	assert.equal(a.max_completion_tokens, 800);
	assert.equal(a.reasoning_effort, "low");
 assert.deepEqual(a.messages[1],b.messages[1]);
	assert.equal(a.response_format.json_schema.strict, true);
 assert.deepEqual(a.response_format.json_schema.schema.required,["citations"]);
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
		'{"citations":[],"answer":"invented"}',
	])
		assert.throws(() => parseSelection(output(text), sources));
	assert.throws(() =>
		parseSelection(output('{"citations":["a"]}', "length"), sources),
	);
});

test('unknown IDs are discarded without discarding valid evidence',()=>assert.deepEqual(parseSelection(output('{"citations":["unknown","a","a"]}'),sources),sources));
