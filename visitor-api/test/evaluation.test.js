import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { retrieveGuideSources } from "../lib/guide-retrieval.js";
import { scoreReply } from "../evaluation/scoring.js";

const cases = JSON.parse(readFileSync(new URL("../evaluation/cases.json", import.meta.url), "utf8"));
test("evaluation corpus has unique IDs and retrieves expected evidence for all source-labelled cases", () => {
  assert.equal(new Set(cases.map((c) => c.id)).size, cases.length);
  for (const item of cases.filter((c) => c.sources.length)) {
    const ids = retrieveGuideSources(item.question, { role: "Recruiter", section: "Explore the portfolio" }).map((s) => s.id);
    assert.ok(item.sources.every((id) => ids.includes(id)), item.id);
  }
});
test("evaluation rejects swapped citation URLs, HTTP failures and missing substantive evidence", () => {
  const item = cases[0];
  const reply = { answer: "0.217324 and 0.819295 on a local holdout", citations: [{ sourceId: "kkbox-results", url: "https://example.com/fabricated" }] };
  assert.equal(scoreReply(item, 200, reply, ["kkbox-results"]).checks.citationProvenance, false);
  assert.equal(scoreReply(item, 503, { error: "unavailable" }, ["kkbox-results"]).passed, false);
  assert.equal(scoreReply(item, 200, { answer: "I cannot verify this", citations: [] }, ["kkbox-results"]).checks.expectedCitation, false);
});
