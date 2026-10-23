# Mobile release QA — 23 October 2026

## Scope and verdict

**PASS_WITH_RISK for GitHub Pages publication.** No P0/P1 remained in the tested paths. Owner requested mobile QA, fixes, commit and deploy. This release publishes the previously local CV artwork/download improvements, transparent project logos, anchor/font stability, optional perspective/counter handling, and reading-resilience fixes documented in `docs/portfolio-ux-review/LOCAL_IMPROVEMENTS.md`.

## New findings fixed in this release

- **P2:** Work still said “You: Recruiter” without a declared role. It now says “Optional perspective · choose”; project content/order remains available without a choice.
- **P2:** Narrow audience cards hid their names and displayed only mascots. Removed the clipping rule and reflowed small-screen cards into three labelled columns. All eleven names fit at 320, 390 and 440px with root text sizes 16px and 32px. Labels remain selectable through native radio controls.
- **Dependency gate:** Next 16.4.0 build reported advisories; `npm audit --omit=dev --json` independently identified Next as affected and 16.4.2 as a non-major fix. Updated Next and its lockfile to 16.4.2. Final build passed; production dependency audit reported zero vulnerabilities. No warning was suppressed or security gate bypassed.

## Commands actually run

- QA skill preflight scan: reviewed. It flags the uncommitted work under review, archived QA files and console logging in gitignored development tools. The existing repository release checklist is under `docs/portfolio-audit/`, not a root filename. No unresolved merge state or application bypass was established.
- `npm run typecheck` — passed after final edits.
- `npm run lint` — passed, 43 files.
- `npm run build` — passed on Next 16.4.2, all 14 static outputs, production `/Alinguyen-portfolio` base path and existing public API URLs.
- `npm --prefix visitor-api test` — 17 passed; API implementation unchanged.
- `npm --prefix visitor-api run smoke:production` — passed grounded answer, approved KKBox citation, response motion shape and CORS.
- `npm audit --omit=dev` — zero vulnerabilities after patch.
- `git diff --check` — passed (normal Windows LF/CRLF notices).

## Browser checks

Chromium in-app browser against the real static export on local port 3022. Production visitor writes blocked by the test server CSP. No contact messages sent. Physical device/browser claims below are deliberately limited.

- Whole homepage at **320, 360, 390, 440, 768, 1024, 1280, 1440** CSS px: 15 sections rendered, all five projects/four CV links retained, no page-width overflow. See `home-matrix.json`.
- Eleven content sections inspected/captured at 390px: visitor selector, Highlights, Work, AI expertise, decision map, marketing funnel, collaborations, About, CVs, notes and contact. `sections-390.json` reports one expected clipped “Highlights” heading: it is intentionally screen-reader-only, not lost visible copy. The section contact sheet is a pre-final baseline for the two new fixes; use `roles-fixed-390.png` and `final-build-smoke.json` for corrected states.
- About, Work directory, KKBox case study and Vibecode case study at 320/390/440px: correct headings and no horizontal page overflow. `routes-mobile.json`.
- Chat at **440×956, 956×440, 956×200, 956×160, 320×568, 390×844**: input/send/close rectangles fit the viewport. Draft text survived resizing. Input and send were 48px high, close 44px. Escape dismissed the dialog and returned focus to the guide. `chat-matrix.json`.
- Short heights approximate space remaining above a keyboard; they are **not native Safari keyboard tests**. At 160px, reading the transcript is necessarily constrained even though controls remain available.
- Mobile-menu Tab reached Home; Download CVs closed the menu and positioned the CV section at ~112px. `menu.json`.
- All four CV anchors produced real browser download events with saved files. Local HTTP bytes matched original assets, with correct PDF/DOCX formats. Three transparent logo assets loaded and matched their original local bytes. `downloads.json`, `files.json`.
- Reduced-motion and coarse-pointer emulation retained core content/four CV links. Doubled root-text reflow passed the targeted label checks. Actual browser 200% zoom, screen reader and physical iPhone/Safari were unavailable.

## Release and rollback

Target: existing `main` branch of `DUYTRUYENTHONG/Alinguyen-portfolio`; existing Pages workflow publishes the static export. No API deployment, database schema change or historical count migration is included. The CI workflow repeats dependency installation, API tests/production smoke, typecheck, lint and build before Pages promotion.

If production regressions appear, revert this release commit on main and let the same workflow rebuild the previous source. Previous deployed source was `6244bcd`; do not force-push history. Deployment run and live result are reported in the final handoff after the workflow completes.

## Remaining limits

PASS_WITH_RISK covers sampled responsive Chromium behavior, not universal browser support or WCAG certification. Physical iPhone 17 Pro Max Safari, native keyboard/safe-area rotation, and field performance remain unmeasured. The earlier audit's inconsistent LCP samples are not used to claim a speedup. Existing decorative motion outside the changed hero is not a full motion audit. All statements of project/prototype evidence and collaboration context remain unchanged.
