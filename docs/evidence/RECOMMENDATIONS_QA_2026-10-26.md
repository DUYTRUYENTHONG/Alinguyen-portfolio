# Recommendation feature QA — 26 October 2026

## Scope

Opt-in project-link interaction collection, bounded Redis-based retrieval ranking, exact recommendation-policy replies, and updated portfolio evidence. No schema migration, broader database privileges, model training or PostgreSQL export of interaction signals.

## Completed local checks

| Check | Result |
| --- | --- |
| API tests | 27 passed |
| Guide/UI policy tests | 20 passed |
| TypeScript and Biome | Passed |
| Static production-path build | Passed |
| Redis Lua integration | Concurrent deduplication, TTLs and rate denial passed in isolated disposable QA keys |
| Authored retrieval corpus | 19 labelled cases × 6 scenarios; 114/114 expected-source combinations preserved |
| Browser consent | Initially unchecked; enabling and withdrawing updated the visible checkbox |
| Narrow/short layout | Settled control geometry stayed inside 390×844, 320×568, 956×440 and 956×240 viewports; no horizontal document overflow observed |

Rapid resize measurements initially captured old animation-frame geometry at 320×568 and 956×240. Follow-up settled measurements passed; no permanent layout failure was found. Desktop screenshot: ignored `artifacts/portfolio-signals-qa/consent-desktop.png`. Mobile screenshot capture had system-pixel scaling discrepancies, so the narrow-screen evidence is geometry inspection, not a claimed visual Safari certification. Real iPhone keyboard testing remains unperformed.

## Production API verification

Vercel deployment `dpl_7ztiXXn3Wj1Gwjft2PGeEf2taw2m` became READY and was aliased to `ali-portfolio-visitor-api.vercel.app`. The production feature flag is enabled.

- Interaction preflight returned 204.
- An explicit non-consent request returned 400 without recording.
- Public count reads returned 405; a foreign origin returned 403.
- Existing guide production smoke passed its citation, response, motion-shape and CORS checks.
- A new recommendation-policy question initially returned a misleading generated statement: “no data is kept or sent to the model.” This contradicted retained aggregates and was treated as a failure despite a valid citation.
- The handler now returns exact reviewed text when recommendation policy is the top source. A fresh live call returned HTTP 200, exactly matched the source text, cited `recommendation-signals` and used motion `none`. A unit test also asserts that this path never calls the model.

No synthetic interaction was inserted into the production namespace. The collector must gather genuine opt-ins before ranking thresholds are reached. The isolated Redis integration test verifies write semantics; production checks intentionally exercise non-recording boundaries. No live quality uplift or full new answer benchmark is claimed. The existing 16-request historical baseline remains unchanged.

## Release boundaries

The API is deployed separately from GitHub Pages. The Pages workflow performs its usual API/analytics/UI tests, typecheck, lint, production smoke and build on push. Inspect the run associated with the feature commit for the final release result. CV binaries have not been regenerated. The PostgreSQL importer continues its separately verified no-bloom schedule.
