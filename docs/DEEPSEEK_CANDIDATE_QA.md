# DeepSeek candidate verification — 2026-11-13

Goal: make public-evidence selection inspectable, then prove local execution, real-provider selection and exact-revision deployment separately. Preserve the approved homepage, tour and finalized CV.

Baseline: `8da9f0fe99de5eb65840ffdab791f46c8db2a08f`. Candidate branch: `codex/deepseek-evidence`.

## Verified locally

- Dependency installs: `npm ci`, `npm --prefix visitor-api ci`, `npm --prefix analytics ci`.
- `npm run typecheck` and `npm run lint`: pass.
- `npm run test`: 51 passing in the current working tree, including four pre-existing project-finder tests outside this change. The migration does not include that finder work.
- `npm --prefix visitor-api test`: 54 passing, fake transport only; not a provider quality score.
- `npm --prefix analytics test`: 14 passing, including local PostgreSQL persistence.
- `npm run build`: pass, 17 generated pages, including `/evidence/retrieval/`, using the four public variables from the Pages workflow.
- Offline prefix probe: four constructed fixtures, stable fixed system prefix, identical repeat, zero provider calls. Sanitized output: `docs/evidence/deepseek-prefix-offline.json`.
- Browser geometry: 390x844, 844x390, 768x1024 and 1280x800 without horizontal overflow. Chromium emulation, not real iPhone Safari.
- Base-path download URLs corrected; exported JSON and audit downloads both return HTTP 200. Keyboard Enter activates the release-decision anchor.

## Claim-to-evidence boundary

| Claim | Evidence | State |
| --- | --- | --- |
| Request/parser and admission/fallback contracts run | API tests and source | Locally tested |
| Fixed first message is byte-stable | Offline four-fixture output | Observed, no cache read measured |
| DeepSeek selected correct evidence | Requires real provider response and final-answer review | Pending |
| Positive cache reads or cost savings | Requires returned usage and dated rates | Unmeasured |
| Exact revision served DeepSeek in Preview/Production | Deployment verifier checks environment, full SHA and provider receipt | Pending |
| E5/RRF/hill-climb beats keyword | Original replay questions, model pin, rankings and independent labels absent | Not reproduced |

## Release state and next steps

Vercel CLI currently reports `Not authorized`. No live provider call or candidate deployment was made; the current production deployment is retained. DeepSeek staging credentials and an explicit maximum-four-call budget have not been confirmed. Never use a NEXT_PUBLIC secret or transfer the old Groq key.

Restore Vercel authorization, configure `DEEPSEEK_API_KEY` only on the visitor API Preview environment, explicitly authorize the four-call probe, then run:

```sh
node visitor-api/scripts/probe-guide-prefix.mjs --provider
node visitor-api/scripts/verify-deployed-guide.mjs https://PREVIEW_HOST/api/guide FULL_40_CHARACTER_GIT_SHA preview
```

The probe additionally requires `DEEPSEEK_PROBE_MAX_CALLS=4`. Do not run a paid probe merely because a key exists. A labelled excerpt fallback does not pass the provider gate. If Preview fails, retain production. Production must separately pass the verifier with `production` and its exact revision.

Source links on the local candidate page target the unpublished feature branch and cannot be verified publicly until branch publication. The local preview is `http://127.0.0.1:3032/Alinguyen-portfolio/evidence/retrieval/`. No deployment or live migration claim is made.

The original retrieval candidate patch and 18-question replay were not found. Current 18 public records are fingerprinted, but they are not substitutes for the missing questions and labels. Reported handoff figures remain explicitly unverified. Independent labels and the sealed holdout must not be authored or scored by the implementation assistant as proof of answer quality.
