# Guide prompt audit — DeepSeek migration candidate, 2026-11-13

Scope: server request builder, evidence selector, parser, deterministic routes and output assembly. Target: official DeepSeek deepseek-flash Chat Completions. This is a branch implementation audit, not a live quality score.

Confirmed mismatch: the old prompt requested prose, suggestions and motion although the server discards model prose. Replaced with the actual consumer contract: {"citations":["record-id"]} or {"citations":[]}. No answer, URL, reasoning or motion field is accepted.

The first system message is byte-stable across roles/questions. Reviewed evidence and the trusted server role/name follow; visitor context and history are serialized as user data last. Existing evidence order is retained. This proves construction only, not a cache read.

Parser rejects missing/whitespace-only content, truncation, malformed JSON, non-object shapes, extra fields, non-string IDs and IDs outside the retrieved records. Duplicate allowed IDs are deduplicated. Empty selection abstains. The server assembles reviewed text and citations. Invalid output/provider failure produces a labelled source excerpt, never a provider-selection success.

Fake-transport tests cover one POST, the documented request controls, sanitization, measured-zero vs missing counters, and 402/429 failure without retry. Existing timeout/admission tests remain. These are local contract tests, not evidence that real DeepSeek selected relevant records.

Receipts expose environment/revision, whether the provider was attempted, HTTP status, returned model, selected IDs, output mode, latency and optional usage counters. They contain no key, header, visitor transcript or reasoning content. The verifier requires deterministic STOS and provider-backed kkbox-results on the same expected revision/environment. A HTTP 200 alone is insufficient.

Remaining: real-provider probes with staging budget, exact-revision Preview/Production receipts, original bilingual replay labels/E5 pin and independent answer-quality review. Ranking changes remain offline. No cache saving, conversion uplift or model accuracy is claimed.

Official references checked 2026-11-13:
- https://api-docs.deepseek.com/api/create-chat-completion/
- https://api-docs.deepseek.com/guides/json_mode/
- https://api-docs.deepseek.com/guides/thinking_mode/
