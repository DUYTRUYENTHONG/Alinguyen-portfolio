import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { knowledge } from "../lib/guide-knowledge.js";
const hash = (x) => createHash("sha256").update(x).digest("hex");
const observed = JSON.parse(
	readFileSync(
		new URL(
			"../../docs/evidence/deepseek-preview-status.json",
			import.meta.url,
		),
		"utf8",
	),
);
const result = {
	status: "pending-reproduction",
	corpusRecords: knowledge.length,
	corpusSha256: hash(JSON.stringify(knowledge)),
	sources: knowledge.map(({ id, url }) => ({ id, url })),
	approvedReplayQuestionsAvailable: false,
	keyword: null,
	e5: null,
	rrf: null,
	independentHoldout: "pending",
	providerCallsMeasured: observed.providerCallsMeasured,
	providerStatus: observed.providerStatus,
	providerAcceptancePassed: observed.providerAcceptancePassed,
	previewDeterministicReceipt: observed.deterministicReceipt,
	productionRevisionVerified: null,
	reason:
		"Original bilingual replay labels, pinned E5 configuration and rankings are unavailable; no numerical retrieval results are fabricated.",
};
writeFileSync(
	new URL("../../public/retrieval-study-status.json", import.meta.url),
	JSON.stringify(result, null, 2) + "\n",
);
console.log(
	JSON.stringify({
		records: result.corpusRecords,
		fingerprint: result.corpusSha256,
		status: result.status,
	}),
);
