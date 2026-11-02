# Public project review — 2 November 2026

Scope: refresh project content within the existing design. No section reorder,
hero, navigation, typography, spacing or actor changes.

## Source ledger

| Repository | Reviewed revision | Portfolio treatment |
| --- | --- | --- |
| [VN AI Content Kit](https://github.com/DUYTRUYENTHONG/vn-ai-content-kit/tree/7feb78db134a580a060a318402ee09597b6842ff) | `7feb78d` | Add to Work → AI & data using the existing resource-card pattern; add a reviewed guide source and bounded English/Vietnamese summaries. |
| [Vietnam Career Agent Kit](https://github.com/DUYTRUYENTHONG/vietnam-career-agent-kit/tree/ca214362d16a6104bcc29592190200e1934e2f64) | `ca21436` | Refresh existing community copy for optional document review and bounded execution. Keep employer acceptance, unattended-operation and job-offer limits explicit. |
| KKBox, Vibecode and live commerce sites | Existing portfolio records | Retain current evidence; no new outcome claims. |
| no-bloom | Public repository metadata | Retain its existing traffic-pipeline context; no additional featured card because it is a seasonal gift rather than an AI/data case study. |
| Profile and generic skill repositories | Public repository metadata | Supporting material, not additional product cards. Do not duplicate the portfolio itself. |

Only public repository content was used. Private repositories were not copied or
published. VN AI Content Kit's default branch is `codex/public-release`, not
`main`; its latest reviewed CI run passed. A passing upstream CI run verifies
that run, not independent voice quality, model training, adoption or business
impact. Its retrieval provides evidence context without an answer-generation
LLM. Voice assets and their licenses require separate setup. Fine-tuning
preparation is not a trained model.

The homepage still has five featured builds. The Work directory has seven
entries, including both community toolkits. Filter counts are derived from the
same list. The existing grid and card styles are reused, with no new imagery or
animation dependencies.

## Implementation brief

Review public owner repositories, add only source-supported work relevant to applied AI/data/commerce, keep concise project descriptions and explicit limits, reuse the existing directory cards and filters, preserve the homepage layout, and keep the guide's facts and citations synchronized.

## QA status

- PASS: 39 API tests, including named-project retrieval, seven-project completeness and trained-model/publication limits.
- PASS: 47 frontend guide tests; the citation-parser check now expects seven reviewed project records.
- PASS: typecheck, lint (70 files), production build (16 static routes).
- NOT_TESTED: rendered directory filters, new-card wrapping and responsive previews. The in-app browser repeatedly timed out while creating or binding tabs, including the existing production tab. No responsive PASS is inferred from source inspection.
- Release held locally pending this browser gate; no production deployment of these content changes.

