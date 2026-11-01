# Short conversational guide answers — 2026-11-01

Default factual replies use authored summaries of the existing reviewed records.
Each English summary is shorter than its source and no more than 60 words.
The evidence heading and repeated source titles were removed from answer text;
numbered citations and existing source links remain. Full detail is used for
technical, cutoff/split, privacy, contact, cost and similar explicit requests.
The exact recommendation privacy policy is unchanged.

Project summaries retain live/planned distinctions, measurement limits, KKBox's
local evaluation boundary, marketplace manual-operation limits and Career Agent
Kit acceptance/offer/throughput boundaries. Reviewed Vietnamese project summaries
are included; records without Vietnamese copy retain the approved source text.
There is no new model paraphrasing or automatic factual truncation.

QA: 35 API tests and 40 guide tests passed, including summary length, unchanged
citation objects, planned-feature limits, detailed-answer fallback and complete
project lists. Lint, production static build and production smoke passed.

Chromium browser checks at 320x568, 390x844, 440x956 and 956x440 found no document
horizontal overflow; input, send and close bounds stayed inside the viewport.
The live STOS answer displayed the shorter copy and its source link. Screenshot
and bounds: ignored `artifacts/guide-short-answers-2026-11-01/`.

No frontend, layout or CSS changes. Physical iPhone/Safari and native keyboard
behavior were not tested. Full inventories and requests for details can remain
longer than a single-source summary to preserve evidence coverage.
