# Guide factual and citation audit — 2026-10-31

Scope: all approved guide knowledge records, project details, planned features,
retrieval/response assembly and citation delivery. No layout or CSS changes.

## Findings and fixes

- A valid citation URL did not prove the generated answer was supported. The
  guide now assembles factual replies from reviewed text and citations together.
  Project requests use approved records directly; other questions use model
  source selection with reviewed factual excerpts instead of generated claims.
- Comparisons could omit a named project. Named-source coverage is now explicit;
  broader project lists cover all six reviewed project/community records.
- Career Agent Kit was absent. Added a source reviewed against its current
  public README: Python/SQLite preparation, reviewed host-assisted execution,
  optional source-bound memory/RAG, experimental readers/bridges, and explicit
  acceptance limits. No job-offer or verified throughput guarantee is claimed.
- The recruiter record repeated a local-only warehouse description. Removed
  that stale status; the hosted pipeline remains documented by its own source.
- The about-page citation did not contain the education claim. Removed the
  degree from that record; education retrieval uses the academic brief, which
  describes the owner-confirmed degree and its verification limits.
- Four-citation frontend truncation could drop sources from complete lists.
  Increased the parsing cap to eight without changing the rendered components.

STOS AI suggestions remain planned. Chợ Kênh tools/courses remain planned;
manual intermediary information does not establish automated checkout, escrow,
completed transactions or measured results. KKBox remains a local same-cohort
holdout, not a leaderboard result, production deployment or retention uplift.

## Evidence review

All 12 pre-existing citation destinations returned HTTP 200. The Career Agent
Kit README and KKBox RESULTS document were read from their public repositories.
The portfolio's project records were compared with guide status and URLs.
HTTP availability alone does not certify claims: the education citation mismatch
was found by checking the about-page content, not its status code.

## QA and limits

- 32 API tests pass. The 24 authored evaluation cases exercise source coverage,
  forged history, unsupported metrics, planned features, multilingual questions
  and unknown facts using an isolated handler and deliberately fabricated model
  prose. These are deterministic regressions, not a live accuracy benchmark.
- New comparisons/plans/community/follow-up checks require complete source sets.
- Frontend parsing test requires all six project citations to survive.
- Frontend guide suite: 40 passing tests. Lint, production static build and
  whitespace checks passed.
- Production smoke checks cover KKBox, English/Vietnamese live inventories,
  STOS plans, Chợ Kênh limits and Career Agent Kit boundaries.
- Live actor comparison displayed both STOS and Chợ Kênh evidence and links.
  At 390x844 and 956x440, long replies retained close, input and send controls
  inside the viewport with no document horizontal overflow. These are Chromium
  viewport checks, not physical iPhone/Safari acceptance.
- An attempted local real-provider evaluation could not run because the local
  environment lacked GROQ_API_KEY. No secret was printed. Production smoke uses
  the configured deployed endpoint and its normal rate controls.

Reviewed text is finite and can become stale. Uncovered questions may still
have incomplete retrieval; the guide does not certify every possible question
or independently validate owner-supplied biographical claims. Some approved
records currently have English text only; Vietnamese reviewed text is provided
for STOS, Chợ Kênh and KKBox. No claim of exhaustive multilingual coverage.
