> Historical candidate. Superseded by the Groq-only recruiter RAG implementation on13 November2026. Do not use these migration instructions as current setup or acceptance.

# DeepSeek candidate verification — 2026-11-13

Goal: make public-evidence selection inspectable, then prove local execution, real-provider selection and exact-revision deployment separately. Preserve the approved homepage, tour and finalized CV.

Baseline: `8da9f0fe99de5eb65840ffdab791f46c8db2a08f`. Candidate branch: `codex/deepseek-evidence`.

## Verified locally

- Dependency installs: `npm ci`, `npm --prefix visitor-api ci`, `npm --prefix analytics ci`.
- `npm run typecheck` and `npm run lint`: pass.
- `npm run test`: 51 passing in the current working tree, including four pre-existing project-finder tests outside this change. The migration does not include that finder work.
- `npm --prefix visitor-api test`: 57 passing, fake transport only; not a provider quality score.
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

## Release-gate hardening

The deployment gate now compares the complete visitor-visible provider answer and citation mapping with reviewed evidence. A valid citation plus a limitation keyword cannot pass an altered answer. Three additional synthetic tests reject altered facts, fallback mode, wrong revision and a forged URL. This is a contract check, not independent answer-quality measurement.

## Live Preview setup — 2026-11-13 (supersedes the earlier authorization blocker)

Vercel CLI now authenticates as the owner. `DEEPSEEK_API_KEY` is stored as a Secret for Preview only. With the owner's explicit deletion confirmation, the unintended Production key and Preview DEEPSEEK_API_KEY1 entry were removed. Preview has KV_REST_API_URL, KV_REST_API_TOKEN and a separately generated GUIDE_RATE_SALT. No secret value is included here.

The owner approved at most four probe calls. One live build-time call reached the official DeepSeek endpoint and returned HTTP 402 after 686 ms. The script stopped on that first failure. Three approved calls remain unused. DeepSeek documents 402 as insufficient balance: https://api-docs.deepseek.com/quick_start/error_codes/. No returned model, selected IDs, token usage, positive cache read, cost or answer-quality result was available.

The temporary probe build ran on deployment 44sc7hKkESgWH7HVebjaLnvzy6D9. Its sanitized output is docs/evidence/deepseek-prefix-live.json. It was followed by a normal Preview deployment (6zK2wC5rXzkiM4jBxM9x29H7nAjB) using the regular vercel.json, with no paid probe build command. Do not rerun the temporary probe deployment while balance remains insufficient.

The normal Preview returned a deterministic STOS answer and source ID with environment=preview, providerAttempted=false and revision=c16d9d86dbf00b502db85500c90b4a0b5bd40b4b. The CLI revision environment value and deployment metadata were populated from git rev-parse HEAD after checking that the API files matched committed source. This proves that deterministic route on the specified Preview, not provider selection or production migration. See docs/evidence/deepseek-preview-status.json.

The full two-fixture provider acceptance verifier was deliberately not run after 402; it would make another model call. Production was not promoted or redeployed by this setup. The old API remains the production baseline. Missing original replay/E5 artifacts and independent labels remain unresolved.
