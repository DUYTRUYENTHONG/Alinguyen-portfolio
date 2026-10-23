# Portfolio UX review — 22 October 2026

## Scope and release identity

Reviewed the deployed portfolio, its plain URL, the actual repository, and a local static production export. Goal: understand the work, inspect evidence, choose a CV, and contact Ali. Audit baseline: `6244bcdcb8e508cc836bbbd40bcd993d4e8437f1`; initial working tree was clean. No contact messages, production analytics writes, CV edits, or deployments were performed for this review.

- Supplied entry: <https://duytruyenthong.github.io/Alinguyen-portfolio/?release=6244bcd#cvs>
- Plain deployment: <https://duytruyenthong.github.io/Alinguyen-portfolio/>
- Repository: <https://github.com/DUYTRUYENTHONG/Alinguyen-portfolio>
- Successful workflow for baseline SHA: <https://github.com/DUYTRUYENTHONG/Alinguyen-portfolio/actions/runs/39715153126>
- The two served HTML responses had identical SHA-256 hashes. All 11 referenced public JS/CSS assets matched the local production export byte for byte. Full generated HTML did **not** match byte for byte; it is not claimed to be an identical immutable artifact. No verified public commit-metadata file was found.
- `release=6244bcd` is a cache-busting query, not a version router. The workflow and shared source fingerprints support correspondence at observation time; the URL does not remain pinned when Pages changes. Raw evidence: [release-fingerprints.json](evidence/release-fingerprints.json).

Framework: Next.js 16.4.0 App Router, React 19.3.0, TypeScript, static export, CSS Modules plus scoped/global CSS, Inter Variable and Archivo Variable. Content: `src/data/portfolio.ts`; section components in `src/app/`; original assets in `public/`. Base path: `/Alinguyen-portfolio`. `PortfolioLink` preserves base paths and trailing slashes. Root `AGENTS.md` and the installed Next CSS guide were read.

## Method and limitations

Used the dedicated in-app Chromium browser, separate from the user's authenticated Chrome work profile. New tabs and the previously unused `127.0.0.1:3022` origin provided fresh tab-session state. **A fully isolated browser context was unavailable:** `Target.createBrowserContext` is unsupported. Tabs can share origin localStorage; this is not represented as incognito isolation. WebKit, physical iPhone Safari, VoiceOver and a real mobile keyboard were unavailable. Browser keyboard wrappers were inconsistent; successful keyboard results below use the documented DOM locator `press` API instead.

Local production build used the same four public build variables as Pages. The audit server serves the existing `out/` export and sends `connect-src 'self'` before initialization. Browser network rules also blocked visitor and guide endpoints. For analytics fixtures only, scoped Fetch interception was armed before navigating `/fixture/`; CORS and POST responses were fulfilled locally. No intercepted POST was continued to production. Browser UUIDs are deliberately omitted from the persisted fixture record. A blocked counter in these runs is **not** a production outage finding.

State labels: **Observed** = reproduced or directly established from source/bytes; **Hypothesis** = plausible cause or user effect requiring further work; **Blocked** = unavailable capability; **Not assessed** = no result claimed. Screenshots alone are not motion tests. [Motion time series](evidence/motion-time-series.json) records 15 samples over 7.5 seconds; [reduced-motion observation](evidence/reduced-motion.json) records the preference and text change.

## Summary

**PASS_WITH_RISK for the audited journeys; not an accessibility certification or new release approval.** No P0/P1 defect was established. Five P2 issues deserve a focused implementation pass; see [FINDINGS.md](FINDINGS.md). Do not infer recruiter readiness from polish or from this audit.

What works:

- Direct `#cvs` entry needs no role choice. Settled CV top is approximately 112px at all six requested widths; the heading clears navigation.
- Three categories and four distinct actions remain, including the DOCX. All four public files returned the expected MIME/signature and matched repository bytes. Real browser downloads completed after bringing controls into view.
- Work directory → KKBox case study → portfolio, plus Back/Forward, preserves the base path. Case study distinguishes local holdout results, academic reference, and unmeasured business impact.
- Optional Data/Engineer perspectives change recommendations and project order and persist after reload. No role selection was made on production.
- Marketing stages activate with Enter, toggle with Space, and show explicit illustrative-data qualifications. Mobile menu Tab navigation and Escape recovery work through the DOM keyboard API.
- Copy-email writes the expected public address and briefly shows `Copied ✓`; no email was sent.
- Loading, fixture success, and simulated analytics 503 leave the portfolio usable. A role update still changes the selected perspective during an API failure.

## Verification commands

| Command | Actual result |
|---|---|
| `npm run typecheck` | Passed |
| `npm run lint` | Passed; 41 source files |
| `npm --prefix visitor-api test` | Passed; 17/17 |
| `npm run build` with Pages public variables | Passed; 14 generated outputs |
| QA preflight scanner | No conflict markers. Generic CHECK reported generated/ignored files and script logging; these are leads, not confirmed defects. No root QA script exists. |
| `check-release-files.py` using bundled Python/pypdf | Public release assets and four file identities checked |

No frontend automated test runner is configured in `package.json`. No dependency install or CV conversion was required. No Lighthouse score or field INP is claimed. Commands do not replace browser journey checks.

## Journey matrix

| ID / state | Steps and expected outcome | Observed result / recovery | Evidence |
|---|---|---|---|
| J01 Fresh direct CV | Open local fresh origin at `#cvs`, choose no role; see heading and usable links | Observed: settles below nav; default picker says Recruiter. No gate. | `direct-cv-entry.json`, `responsive-settled-matrix.json`, deployed-CV screenshot |
| J02 Navigation to CV | Open mobile menu, use Download CVs; navigate without losing access | Observed menu opens, first link receives focus; Tab reaches Highlights; Escape returns to trigger. CV anchor separately settles at all six widths. Full keyboard traversal of every nav item not assessed. | mobile-menu-focused screenshot; source `SiteHeader` |
| J03 Four CV actions | Activate each PDF/DOCX; obtain correct nonempty file | Observed: four local and four public browser downloads saved; file formats/identities checked. Initial automation timeouts are superseded by successful native actions with targets fully visible. | `native-browser-downloads.json`, `public-browser-downloads.json`, `cv-files.json` |
| J04 Project evidence | Work → KKBox → reading depth → Back to selected work; Back/Forward | Observed: correct local routes; deep-dive selection; return lands near work top (107.7px); Back returns to case, Forward to portfolio. | work directory, KKBox entry/deep-dive screenshots |
| J05 Perspective | Choose Data; inspect recommendation/order; reload; select Engineer with analytics failure | Observed: KKBox first for Data, persists; Vibecode first for Engineer. Mouse selection does not move reader to a new section. Complete arrow-key radio-group traversal not assessed. | perspective screenshot, analytics fixture record; source rolePriorities |
| J06 Marketing | Activate a stage by mouse; Enter/Space by keyboard; inspect touch layout | Observed: mouse and Enter select, two synchronized controls become pressed; Space deselects. Details and illustrative qualification remain. Coarse pointer emulated (one touch point); physical touch gestures blocked. | `keyboard-marketing.json`, selected screenshots, motion time series |
| J07 Contact | Read email, copy, inspect mailto destinations; send nothing | Observed: clipboard matched; MutationObserver captured `Copied ✓`. Email links and subjects point to Ali's public address. External mail-client launch and message delivery intentionally not tested. | `copy-email.json`, contact screenshots; source mailto links |
| J08 History/resize | Back/Forward/reload; six widths, short landscape, larger text | Observed normal-text reflow without page overflow at six widths. 200% text creates overflow on narrow screens (F01). At 956×240 close/input/send stay in bounds. Physical orientation/keyboard blocked. | responsive/enlarged-text/short-landscape JSON |
| J09 Optional API failure | Hold request, return fixture 200, update role with fixture 503 | Observed: static links remain usable; fixture counts render; unavailable message appears; role/order still update. A held request can remain `Loading…`; no timeout is implemented in `VisitorStats`. | fixture provenance and loading/success/unavailable screenshots |

## Links and file checks

See [CV_LINKS.md](CV_LINKS.md) for all four destinations, media checks, document identity, and actual browser outcome. All five public case-study routes returned HTTP 200 with the expected headings; see `evidence/case-link-checks.json`. KKBox was also exercised through the UI. Other external business/repository destinations were not all opened; no claim that every external destination is healthy is made. Network restrictions and tool failures are not classified as server failures.

## Responsive, accessibility and visual assessment

- Purpose/hierarchy: hero states applied AI and digital products, with work and CV actions. Project status and limits are visible; sculptural illustrations are conceptual, not evidence of results.
- Reading effort: highlights plus detailed work create a long mobile page. Whether this improves discovery needs user testing; no measured task-time claim is made.
- Readability: neutral palette and flat text/controls work at normal text size. At 200% text, contact and parts of the marketing layout overflow (F01).
- Mobile ergonomics: CV actions have 48px minimum heights. Three cards stack rather than leaving an orphaned two-column row. Guide callouts can obscure copy (F02).
- Names/structure: CV actions have category-specific accessible names; h2/h3 structure and decorative aria-hidden artwork are present. The full page is not certified against WCAG; no automated accessibility score was run.
- Contrast: existing colors were inspected visually; a complete computed contrast inventory is not assessed. Do not infer a pass from absence of console errors.
- Reduced motion: CSS marquees stop and portrait is sharp; JS rotating text still changes (F03).
- 320px normal-text viewport provides the requested reflow equivalent of a 1280px layout viewed at 400% zoom. This is not a physical Safari browser-zoom test. Default font size was separately changed from 16 to 32 and restored.
- Browser logs captured for the final local tab contain no error/warn records. CSP/blocked requests are intentional test conditions; this snapshot does not prove an error-free production service.

## Evidence index

- [Performance baseline](PERFORMANCE.md), raw six runs in `evidence/performance-runs.json`.
- `screenshots/`: hero, highlights, work, KKBox entry/depth, expertise, marketing, customers/about, CVs, contact, selection, menu focus, and analytics states.
- Desktop `deployed-cvs-1280.png` is the valid 1280px CV reference. Two compositor-invalid captures are quarantined under `evidence/invalid-captures/`; neither supports a visual conclusion. The short-landscape JSON supports control geometry only.
- `evidence/capture-manifest.json`: byte sizes, dimensions, SHA-256, and validity classification. Capture dimensions can differ slightly from CSS viewport because the in-app browser includes/excludes scrollbars and uses display scaling; requested and measured CSS widths are recorded separately.
- Earlier immediate-resize matrix is retained as raw transitional evidence; use the **settled** matrix for anchor conclusions.

## First implementation slice and stopping point

Recommend **F01 + F02: text resizing and unobscured mobile contact/work**. Allow email wrapping, constrain flex/grid children at enlarged text, and reserve or collapse callouts so they do not cover essential copy. Acceptance must rerun 320/390px at 16/32px root text, direct CV entry, and guide focus/visibility states.

Next: F04 role attribution; F03 optional motion; F05 direct-entry layout stability. No general audit correction was applied. Subsequent user comments separately authorize three transparent logo assets and replacement CV illustrations; those changes are tracked in `ARTWORK_CHANGES.md` and are not included in this baseline's performance or screenshots. No production deployment is authorized by this audit.

## Local implementation after this baseline review

See [LOCAL_IMPROVEMENTS.md](LOCAL_IMPROVEMENTS.md) for the three bounded implementation slices, updated verification, before/after measurements, file inventory and remaining limits. The original findings and measurements above describe the audit baseline, not the current local candidate.
