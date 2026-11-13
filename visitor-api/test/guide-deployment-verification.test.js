import test from "node:test";
import assert from "node:assert/strict";
import { verifyGuideReceipt } from "../lib/guide-deployment-verification.js";
import { evidenceReply } from "../lib/guide-evidence.js";
import { knowledge } from "../lib/guide-knowledge.js";
const revision = "a".repeat(40);
const fixture = {
	question: "What is the local holdout log loss?",
	source: "kkbox-results",
	provider: true,
};
function valid() {
	return {
		status: 200,
		fixture,
		revision,
		environment: "preview",
		result: {
			...evidenceReply(
				knowledge.filter((s) => s.id === "kkbox-results"),
				fixture.question,
			),
			receipt: {
				revision,
				environment: "preview",
				providerAttempted: true,
				providerStatus: 200,
				returnedModel: "deepseek-flash",
				selectedIds: ["kkbox-results"],
			},
		},
	};
}
test("deployment gate validates full reviewed answer and citation mapping", () => {
	assert.equal(verifyGuideReceipt(valid()), true);
});
test("deployment gate rejects altered facts even with a valid source and limitation word", () => {
	const v = valid();
	v.result.answer = "Disputed: Ali won the leaderboard.";
	assert.equal(verifyGuideReceipt(v), false);
});
test("deployment gate rejects excerpt, wrong revision and forged citation URL", () => {
	for (const change of [
		(v) => (v.result.responseMode = "source-excerpt"),
		(v) => (v.result.receipt.revision = "b".repeat(40)),
		(v) => (v.result.citations[0].url = "https://example.com"),
	]) {
		const v = valid();
		change(v);
		assert.equal(verifyGuideReceipt(v), false);
	}
});
