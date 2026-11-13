# Prompt audit — Groq source selection, 13 November 2026

Scope: application model request, parser and renderer. Target openai/gpt-oss-20b on Groq, existing account plan. No global agent settings, private chats or secrets inspected. DeepSeek migration instructions are superseded; historical artifacts are not current acceptance.

## Confirmed mismatch at public baseline 8da9f0f

visitor-api/api/guide.js requested answer, citations, suggestions and motion; it checked generated answer length but then rendered evidenceReply(cited, question), discarding generated prose. Counterexample: a correct source selection without an answer field was rejected even though the renderer did not consume that field.

## Revised consumer contract

visitor-api/lib/guide-model.js owns a strict object: required citations array of strings, additionalProperties false. Fixed rules first, sorted evidence second, role/history/question last. Visitor input and previous assistant messages are explicitly untrusted. Empty selection abstains; unknown IDs are discarded, duplicates removed, malformed or truncated output falls back. No generated prose or URLs displayed.

visitor-api/api/guide.js retains origin/content-size/role/history validation, daily 20/client and 300/global Redis admission, deterministic project/inventory/privacy/tour routing, keyword retrieval, then at most one Groq request. No retry. parseSelection supplies reviewed records to evidenceReply, which renders text and matching public URLs. Quota/timeout returns labelled source excerpt, not a successful generated answer.

## Observable checks

visitor-api/test/guide-model.test.js: citation-only JSON succeeds without generated answer; extra prose field is rejected; role change leaves fixed and evidence messages identical; unknown IDs discarded without losing valid ones. This contract fails under the old generated-answer validation.

visitor-api/test/guide-recruiter-answers.test.js grades final visible text for false leaderboard premise, forged hiring claim, planned features, forged history, unsupported salary and quota failure. These fake transports establish rendering behavior, NOT Groq's ability to select the correct source. scoring.js reports citation relevance, claim-pattern detections, refusals and service failures separately; regex checks are not an independent groundedness score.

## Cache and release boundary

Four public fixtures captured offline at request construction: first/repeat/role/history. scripts/probe-guide-prefix.mjs uses the same builder as the handler. A real probe requires GROQ_PROBE_MAX_CALLS=4 and authorized key, stops at first failure, excludes prompts, headers, reasoning and secrets. Cached reads use usage.prompt_tokens_details.cached_tokens; aggregate share is summed observed cache reads / summed prompt tokens. Missing means unknown, reported zero remains zero.

Live probe not run: Vercel's sensitive Production key was not locally available. Completion cap800 with low reasoning preserves the baseline cap provisionally; no claimed cap optimization or cache saving. Account-specific quota was not inspected. Official model availability/strict-schema support documented at https://console.groq.com/docs/structured-outputs ; caching https://console.groq.com/docs/prompt-caching ; account limits https://console.groq.com/docs/rate-limits .

Production and Pages are unchanged. Candidate deployment requires deterministic and provider-backed answers with exact revision receipts; old baseline success is not candidate acceptance.

## Action contract audit

At8da9f0f, evidenceReply returned suggestions:[] even though guide-assistant-panel.tsx rendered follow-up questions. The candidate intentionally keeps factual rendering separate: optional actions is a server-selected registry link, while suggestions remains for an explicit clarification question. Old replies parse without actions. No model URL or generated follow-up prose is trusted.

Confirmed policy defect: negated CV request incorrectly chose master-cv. A one-hunk pre-fix replay and corrected no_action are preserved in docs/evidence/action-negation-regression.json; tests keep used/declined actions and planned destinations out. Genuine local18-update LoRA artifacts are available, but partial budget and train/dev paraphrase overlap prevent promotion. Corrected split remains untrained.

- visitor-api/lib/guide-model.js:9 — export function buildSelectionRequest

- visitor-api/lib/guide-model.js:44 — export function parseSelection

- visitor-api/api/guide.js:83 — const admitted =

- visitor-api/api/guide.js:137 — const response = await modelFetch

- visitor-api/lib/guide-evidence.js:22 — export function evidenceReply

- visitor-api/lib/guide-actions.js:31 — export function selectGuideAction

- src/app/guide-reply.ts:28 — export function parseGuideReply

## Live counterexample and one-variable revision

Preview35f7a53 deterministic STOS passed. Its first real Groq call for local holdout log loss returnedHTTP200 but no approved selected ID; the visible answer abstained without the relevant limitation citation. This failed the exact-answer/citation gate. The revised fixed instruction explicitly treats reviewed omitted/disputed/unmeasured metrics as evidence for explaining a limitation, without inventing a number. No claim is made about whether the raw selection was empty or only contained discarded IDs.

One of four authorized calls consumed. At most three remain. A complete four-fixture same-prompt cache matrix cannot be reconstructed after this revision; do not report it as completed.
