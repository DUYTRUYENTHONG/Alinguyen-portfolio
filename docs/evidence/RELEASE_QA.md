# Engineering evidence release QA — 26 October 2026

## Scope and decision

**PASS WITH DOCUMENTED LIMITS** for the local analytics implementation, evidence page, AI CVs and guide failure fallback. Hosted PostgreSQL deployment and a full post-fix live guide evaluation are not part of this pass.

## Commands and observed results

| Check | Result |
| --- | --- |
| `npm --prefix analytics test` | 10 passed, including persistent PostgreSQL reopen/replay and rollback |
| `npm --prefix analytics run demo` | Synthetic load, replay, correction and stale snapshot completed; report regenerated |
| `npm --prefix visitor-api test` | 21 passed, including approved-source fallback and rate-store failure |
| `npm run test:guide` | 18 passed |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed, 48 source files |
| `npm run build` with production base path | Passed; `/evidence/` statically exported |
| `npm --prefix analytics audit --omit=dev --audit-level=high` | Zero reported vulnerabilities in production analytics dependencies |
| `git diff --check` | Passed |
| Private aggregate export and persistent local load | Seven days, one available; reopen/replay applied zero changes |
| `npm --prefix visitor-api run smoke:production` after Vercel deploy | HTTP response, approved KKBox citation, motion shape and CORS passed |

Preflight found no conflict markers. Its broad console-log flags include CLI reports and ignored QA tooling, not authorization bypasses. Changed source and generated reports were reviewed for credentials; private environments, snapshots, local warehouse files and rendering tools remain ignored. No existing application tables or Redis collection keys were modified by the analytics exporter.

The live baseline is intentionally **not** a passed benchmark: 12/16 responses, four HTTP 503 errors, nine original heuristic passes. See [the evaluation report](AI_GUIDE_EVALUATION.md) for scoring issues, review observations and limits. The deployed fallback does not prove those upstream failures have been resolved.

## Browser and document checks

- In-app Chromium: evidence page captured at 1440, 1280, 1024, 768, 440, 390 and 320 CSS pixels; no document horizontal overflow. Additional 956 × 440 landscape check also had no overflow.
- Desktop page composition and mobile guide section visually inspected. Homepage evidence links navigate correctly with `/Alinguyen-portfolio`; anchor targets stay clear of navigation. Keyboard Tab shows a solid focus outline.
- Reduced-motion emulation and JavaScript-disabled rendering preserve evidence content. No new page animation or runtime data fetching was added.
- PDF and DOCX rendered to two pages each and visually reviewed. The DOCX renderer required a local official LibreOffice extraction; inherited title borders and fallback typography were corrected. Business CV binaries were not regenerated.
- No physical iPhone, Safari, native keyboard or browser zoom test is claimed for this release. Chat layout was unchanged; existing actor/chat placement regression tests passed.

Local visual records (ignored): `artifacts/engineering-evidence-2026-10-26/`, `artifacts/cv-evidence-pdf-1.png`, `artifacts/cv-evidence-pdf-2.png`, and `artifacts/cv-evidence-docx-final/`.

## Deployment and recovery

API deployment: `dpl_FhNtLJZzadNXERRb8rhDRU5Cjbof`, production alias `ali-portfolio-visitor-api.vercel.app`, verified ready. GitHub Pages deployment runs the committed test/build gates on push. Check the workflow's final result before treating the web release as deployed.

Rollback the website through a reviewed Git revert and Pages rebuild. Restore the prior Vercel deployment if its runtime regression requires rollback. Upstash remains the operational source; no online warehouse is involved in this release. Do not delete traffic records as a rollback action.

The owner will create a new Supabase project using [the setup guide](../SUPABASE_SETUP.md). Publish a separate dated hosted verification only after connection, migration, reconciliation, replay, access and recovery checks have actually completed.
