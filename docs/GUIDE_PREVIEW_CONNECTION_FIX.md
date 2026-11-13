# Local guide connection repair — 13 November 2026

## Cause and correction

The static preview at `http://127.0.0.1:3037` called the existing production visitor
API. Its CORS preflight returned HTTP 403 without an allowed-origin header. The
frontend consequently displayed its normal unavailable message. The old 3034
address also served an older preview, obscuring the recent UX work.

The approved API origins include `http://[::1]:3001`; its preflight returned 204.
The dependency-free `scripts/preview-export.mjs` now serves the exported build on
that exact loopback interface. It can redirect the two old preview addresses to
the canonical preview, preserving path/query and native fragment handling.

No production CORS allowlist, key, quota, model, API handler, frontend layout or
answer policy was changed. There is no API proxy or forged Origin header. An
unrelated STOS process on IPv4 port 3000 was explicitly left untouched. Only the
two verified portfolio preview processes on 3034 and 3037 were replaced.

Current preview:
http://[::1]:3001/Alinguyen-portfolio/?for=recruiter#top

From the repository root, after building with the Pages public environment values:

```powershell
node scripts/preview-export.mjs out
```

For the isolated, reviewed export used in this chat:

```powershell
node scripts/preview-export.mjs artifacts/actor-candidate-source/out --redirect-legacy
```

`--redirect-legacy` owns IPv4 ports 3034 and 3037. Stop only the old portfolio preview
processes before using it. Port conflicts fail rather than silently selecting a new
origin the API rejects. Use the exact printed URL; do not substitute an arbitrary
port. The server serves only the base-path export, handles HEAD/missing files, rejects
path escape and uses no-store to avoid stale local builds. It is not a production server.

## Verification

- Before: `OPTIONS /api/guide`, Origin `http://127.0.0.1:3037` → 403.
- After: Origin `http://[::1]:3001` → 204; browser POST → 200, no CORS failure.
- In the real browser chat, “Which products are live?” returned all three live
  sites with citations. “What does STOS do?” returned the reviewed STOS answer
  and citation, retaining the planned-AI and unmeasured-impact limitations.
- These are existing deterministic reviewed-answer routes, not new free-form
  model probes or a broad model-quality evaluation.
- Two new preview-server regression tests passed; the isolated frontend suite
  now passes 51/51. An additional cross-contract preflight test verifies that the
  canonical preview is admitted while the arbitrary old origin stays rejected,
  with no storage call. The API suite passes 68/68. No API or bundle code changed, so no new production deployment
  or API-key changes were needed.

## Scroll animation and UX visibility

The old preview addresses now show the current QA export containing the UX pass
`e27c276`. The Selected work heading was observed in the corrected preview as
`home-heading-enter`, duration `0.32s`, opacity `.718352`, transform translateY
`6.43767px` during its 8px entrance. Reduced motion was false in that check.

This effect runs once on ordinary entry. Native project jumps, fast scrolling,
keyboard focus and browser Back intentionally settle content immediately. Reload
at `#top` and scroll naturally to see it again; clicking Explore jumps straight
there and therefore skips the entrance. No extra animation or layout change was
introduced to hide the stale-preview problem.

Evidence: `docs/evidence/guide-preview-connection.json`,
`docs/evidence/canonical-scroll-animation.json`.

Rollback: stop this local preview process and run the previous static helper if
needed; reverse only this commit's preview script/test/docs. This does not undo
the UX styles or affect any production deployment. Returning to an unapproved
origin will reproduce the CORS failure until the correct preview URL is restored.
