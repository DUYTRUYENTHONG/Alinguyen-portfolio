# AI engineering release gates

The avatar UI/layout is unchanged by this release's AI work. Groq remains the only production inference provider; approved records remain the factual authority.

## Implemented and exercised

- `npm --prefix visitor-api run eval:offline`: one reproducible, zero-provider-call harness with corpus/question/ranker fingerprints; authored bilingual retrieval replay; two single-variable hill-climb candidates; stable prompt-prefix assertion; current-data fine-tuning gate. GitHub Pages CI now runs it before release.
- Runtime retrieval accepts explicit internal experimental options. Existing production callers use unchanged defaults; request payloads cannot turn experiments on.
- Hill-climb: eight English/eight Vietnamese answerable development questions and two unrelated controls. Baseline top3 EN 8/8, VI 4/8; reviewed Vietnamese text candidate EN 8/8, VI 5/8; threshold candidate EN 7/8, VI 4/8. Both baseline and candidates returned evidence for one unrelated control. Threshold is rejected. Bilingual candidate is a development choice only, not promoted: independent labels remain absent. These are retrieval results, not answer-accuracy or generalization scores.
- Prompt construction already places fixed rules and sorted evidence before role/history/question. The harness checks prefix equality across reordered identical records and changed role/history. Groq documents automatic caching for `openai/gpt-oss-20b`; exact prefix matching helps eligibility but never guarantees a hit. Provider cached-token receipts retain missing values as unknown, never zero. No cache savings are claimed.
- Fine-tuning evaluation now rejects incomplete runs and mismatched train/dev/test/model fingerprints before presenting base/adapter numbers as current. Existing artifact: 18/32 updates and changed train/dev files, so the comparison is invalidated. Public action scorecard now shows unavailable learned-model results with explicit gate reasons, retaining historical update count. Rules pass 8/8 authored action cases. No trained adapter or learned lookup table is promoted.

Existing corrected-v2 LoRA preparation and training script remain runnable. A new independently reviewed final set and a declared training budget are needed for a defensible new comparison. The old v1 test outputs must not become tuning targets. This release does not claim fresh training, production fine-tuning, or universal improvements.

## Checks and release

API tests: 69/69. PostgreSQL/analytics tests: 14/14. Frontend gate, exact-revision deployment receipts, GitHub Actions and live site checks must pass before calling the release deployed. Final receipts are written to ignored `artifacts/ai-release/`; commit and URLs are reported after actual deployment, not predeclared here.

No visitor chat text is used for training or persisted by this work. No analytics consent expansion, provider migration, new model bill or secret publication.

References: [Groq prompt caching](https://console.groq.com/docs/prompt-caching), [existing action-training protocol](../visitor-api/evaluation/action-training-plan.md), [independent-review boundary](../visitor-api/evaluation/independent-review.md).
