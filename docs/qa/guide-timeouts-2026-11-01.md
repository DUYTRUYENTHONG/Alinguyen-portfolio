# Guide request deadline and recovery repair — 2026-11-01

The observed production browser timeout could not be attributed to one dependency
from the available logs. Source inspection identified unbounded Redis admission
work and a model timer that ended before response-body reading. Regression
fixtures reproduce those stalled stages rather than claiming a captured
production trace.

## Changes

- Admission has a 2.5-second total deadline. Redis retries are disabled and HTTP
  operations receive abort signals. Failure stays closed with HTTP 503; neither
  tour nor model execution bypasses the existing counters.
- Optional ranking has a one-second deadline and keeps baseline retrieval on
  failure. Model fetch and JSON-body reading share a ten-second deadline; a
  failure returns the existing labelled, cited source excerpt.
- Browser fetch, body reading and parsing have a 16-second per-attempt deadline.
  Network/timeout and HTTP 502/503/504 failures get one retry with the same
  payload. HTTP 429, validation/permission failures and malformed successful
  responses do not retry. Two failed attempts restore the existing error state
  and editable question; worst-case waiting remains bounded. A retry may consume
  a second admission count; quotas are not bypassed.
- Manual retry reuses the pending question row and preserves prior conversational
  context. No layout, CSS, source facts, citation URLs or tour routing changes.

## QA

39 API tests and 44 guide tests pass. New tests cover hung admission, hung model
body, hung browser fetch/body, network recovery, persistent failures, malformed
JSON, validation and rate-limit non-retry behavior. Existing citation and
planned-feature regressions remain passing. Lint passes.

Production smoke now executes a tour followed by its STOS question with bounded
requests, in addition to existing evidence/inventory checks. Mobile workflow is
verified after deployment. Physical iPhone/Safari acceptance is not claimed.

This bounds failures and recovers transient requests; it cannot guarantee
availability through a persistent storage, network or provider outage.
