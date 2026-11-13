# Recruiter evidence candidate — 13 November 2026

## Scope and decision

Groq remains sole production inference provider, existing free-plan setup unchanged. Homepage layout, CV bytes, production keyword ranker, existing tour and admission limits unchanged. Unrelated dirty project-finder work excluded from candidate QA/commit. New interactive content is limited to Engineering evidence, retrieval route and KKBox case.

PASS locally pending final export/browser checks; NOT production acceptance. Vercel production remains dpl_7EmtXF8szP9EBZUviNL74vWXp69v (5 November). Public Pages workflow revision8da9f0fe99de5eb65840ffdab791f46c8db2a08f, successful run43366084938. Checked independently.

## Claim / evidence

| Claim | Evidence | Limit |
|---|---|---|
| Groq citation-only contract works locally | visitor-api/test/guide-model.test.js, guide-receipt.test.js, guide-recruiter-answers.test.js | Fake transport is not model selection |
| Retrieval experiment ran | public/recruiter-retrieval.json; evaluation/RETRIEVAL_STUDY.md | New authored fixtures, original missing; independent review pending |
| Future event cannot alter earlier snapshot | test/guide-cutoff.test.mjs; synthetic UI | Date-only synthetic test, not future-cohort model validation |
| Four-fixture prefix stable offline | docs/evidence/groq-prefix-offline.json | No observed live cache reads |
| Final-text evaluation | docs/evidence/groq-rendering-evaluation.json,24 authored fixtures | Expected IDs supplied; no groundedness score |
| Real Groq selected expected source | Not verified | Sensitive production key unavailable locally; zero live probes |
| Named deployment served candidate | Not verified | Production unchanged; need candidate deployment and deterministic + provider receipts |

Completion cap800/low reasoning is provisional, preserving baseline; no bounded live cap test possible. Groq docs rechecked for model/strict output/cache support. Account-specific limits unverified; no plan upgrade, key mutation or quota-setting change.

One scoring false negative fixed: the existing Vibecode check did not accept “haven’t been measured”. Before23/24; after24/24 with same final answers. This is a grader correction, not an AI improvement. Regex claim checks remain incomplete heuristics.

## Commands

- npm --prefix visitor-api test
- npm --prefix analytics test
- npm run test:guide
- npm run typecheck
- npm run lint
- NEXT_PUBLIC_BASE_PATH=/Alinguyen-portfolio plus workflow site/visit/guide URLs: npm run build
- node visitor-api/scripts/evaluate-selector-rendering.mjs
- node visitor-api/scripts/probe-guide-prefix.mjs
- E5 reproduction: visitor-api/evaluation/RETRIEVAL_STUDY.md

No live Groq probe sent; key pull produced an empty sensitive value. The temporary private file was removed without printing values. GitHub CLI auth missing; public workflow status was read using the public GitHub API.

## Final local gate

Isolated indexed candidate excludes the unrelated finder:49 frontend tests,67 API tests,14 unchanged analytics tests; typecheck/lint and actual Pages base-path build passed. Master PDF SHA-256 remains01a8fbe9a35dcffcfc7cceddad99df8720a24eeb767c046c7762d5f0eeb5f391. Mobile Chromium:320px badges wrap without overflow;430x932 chat and932x430 landscape input/send/close remain visible. Native iPhone Safari is not tested. Static selection/slider interactions observed zero network requests and zero Groq calls.

Local UI uses an isolated test API (fake admission/transport), never a live-provider quality claim. Dismissed CTA remained suppressed on repeat; Vietnamese STOS answer kept planned-AI limitation; topic switch selected KKBox; quota test returned labelled source text. One generic correction contact pitch was removed. Existing motion now waits for React hydration instead of mutating server nodes before hydration; timing/appearance unchanged.

Preview scope was completed via Vercel authenticated API target-only PATCH after the dashboard still showed no saved Preview copy. No value was decrypted, sent or changed, and existing Production target remains. Preview probe budget:at most4 total actual Groq calls, no retries. Production has not been redeployed.

## Bounded live Preview evidence

Code revision04a318e1e0ab61c6e95a3cf4092296cbfb13f566 at Preview dpl_2R1ztNiWsfSGNurv9w7eRxJoQsgp. Real Groq returned openai/gpt-oss-20b. Deterministic STOS exact gate passed without inference. Supported guide-failure report question and repeat each selected guide-evaluation and passed full reviewed-text/citation verification.

Four actual Groq calls total: initial omitted-metric question abstained; a one-variable instruction revision also abstained; supported question and repeat passed. Original omitted-metric gate is NOT passed or erased. The latter two requests were byte-identical at the actual outbound boundary. Full first/repeat/isolated-role/history same-version live matrix was not completed within the four-call budget. Offline all-four fixture construction passed.

Observed prompt tokens3244, completion207; provider latency280–467ms. These are four development calls, not customer latency/accuracy/cost measurements. Cache read counters were missing in all four; aggregate cache share remains unknown, never zero. Completion cap800/low reasoning retained after observed37–84 completion tokens without truncation; broader coverage unmeasured.

A Preview upload began after a failed local commit command and therefore had wrong revision metadata (gtrmbh6lk). It was quarantined, never probed or promoted. Correct source was committed and redeployed before subsequent checks. Production alias remained dpl_7EmtXF8szP9EBZUviNL74vWXp69v throughout.

Release decision:PASS_WITH_RISK for local/Preview inspection, not production promotion. Preserve the failed source-selection checks and invalid/partial training result. Independent labels, native iPhone Safari and full live cache matrix remain unverified.

Final walkthrough: desktop reached the public Vibecode repository in three clicks (18.12 seconds, operator walkthrough); CV downloaded in one click. At 390px mobile the route reached the case study, explicit maintainer contribution, limits and public repository link. Mobile timing was not captured reliably. Overall provider release acceptance remains false: two supported-report passes and two omitted-metric failures; four-call budget exhausted.
