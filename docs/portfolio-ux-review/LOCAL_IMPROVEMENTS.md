# Local improvements after the portfolio review

Date: 2026-10-22. Baseline: `6244bcd`. Local candidate only; no commit, push, API deployment, or public website deployment.

## Three bounded slices

### 1. CV decision, direct entry, and files

- Kept all three categories, original descriptions, four action labels, destinations and file formats. Added visible PDF/DOCX labels.
- Read the actual CV text before adding two business focus descriptions: product scoping/reviewable commerce builds versus client discovery/offer positioning/solution consulting. Both files remain equally visible. No seniority or outcomes were added.
- Preserved the existing local artwork work from the previous review. Text and links remain outside perspective transforms.
- Removed estimated layout heights from sections above the CV target. Native fragment navigation now uses immediate positioning and existing section offsets. Replaced the repeated 2.5-second resize/scroll watcher with one initial font-ready correction, cancelled by user input or a history/hash change.
- Preloaded the installed Inter and Archivo Latin files using Next's local font support and adjusted fallbacks. Existing Fontsource imports remain for the existing character subsets; no new font package or remote font service.
- Fixed-header navigation CV → home → Back → Forward returned to approximately 112px CV clearance and home scrollY 0. Footer navigation retains the browser's saved reading position; tests must not mistake scrolling a footer link into view for a history defect.

### 2. Optional perspective and reliable counter

- A fresh visitor has no checked audience radio and no “THAT'S YOU” label. The default useful recommendation is labelled “A PROJECT TO EXPLORE”. Added an explicit optional-selection explanation.
- A `?for=` entry changes the suggested perspective without saving it as a declaration. A keyboard choice does save the in-tab/session preference. Storage denial does not gate the page.
- Wait for preference initialization before recording a visit. Send `role: null` until a role is declared, using the endpoint's existing supported null contract. Hide the role statistic while unchosen. No backend schema, Redis key, or historical count was changed.
- Counter requests time out after eight seconds and show unavailable, never a fabricated zero. Abort and disposal checks prevent stale results after role changes.
- Local intercepted fixtures verified initial null role, success and stalled-request states. Engineer → Data selection sent Data, retained radio focus, reordered the same five stable project IDs and showed the Data statistic. No QA request was released to the production visitor API.
- Older session values cannot retrospectively distinguish a past explicit choice from the old query-driven save; historical attribution remains unaudited.

### 3. Reading, motion, and contact resilience

- Long headings, email addresses, capability copy, the About introduction, and working-hours controls wrap at enlarged text sizes without masking page overflow.
- Automatic guide callouts no longer cover desktop copy; they appear on deliberate hover/focus. Mobile callouts are hidden, while the guide/chat button remains available at the outer edge. Its existing conversion-link avoidance now also includes CV and contact controls.
- Hero focus wording settles after at most two transitions (4.4 seconds), stays static under reduced motion, and stops on visibility changes. Other existing animations were not comprehensively redesigned; no claim of universal motion conformance is made.
- Marked only the two repeated identity-strip spans decorative. Kept all six distinct names and the separate, legitimate project-status ribbon.
- Email copy has announced success and an actionable failure explanation pointing to the selectable address/mailto fallback. Native clipboard test returned “Email address copied.” Mailto address and percent-encoded subjects were inspected; no message was sent. Clipboard-denied behavior was source-reviewed, not exercised in a browser.
- Retained the existing funnel explorations and case-study URLs: the baseline verified keyboard stage selection, and did not establish that removing or collapsing these sections would improve discovery. No unsupported structural deletion was made.

## Verification actually completed

Commands after the final application edit:

- `npm run build` — passed, all 14 static outputs; built with `NEXT_PUBLIC_BASE_PATH=/Alinguyen-portfolio` and the existing public site URL.
- `npm run typecheck` — passed.
- `npm run lint` — passed, 43 files.
- `git diff --check` — passed; Git reports normal LF/CRLF conversion warnings.
- `npm --prefix visitor-api test` — all 17 passed during this cycle. Subsequent edits touched only guide positioning/CSS; the API remained unchanged.

Browser: Chromium in-app browser, local static export at port 3022, with external guide/counter requests blocked by the local test server CSP. The counter-specific fixture page was used only with interception armed first. Browser overrides and interception were cleared afterward. The local preview remains available.

- Six-width CV matrix: 1440, 1280, 1024, 768, 390, 320 CSS px. All three cards/four actions present, five projects retained, document width stayed inside viewport, every download control at least 48px. CV top approximately 112px. See `improvements/final-matrix.json` and `cv-final-*.png`.
- Keyboard: business PDF focus has a visible blue outline; fixed header hash links and Back/Forward checked. Explicit role keyboard selection retains focus.
- Reflow: actual root font size 32px (200% default-text setting), at widths 390 and 320. Document widths 375 and 305 respectively, accounting for the scrollbar. Baseline page width was 483px at both widths. This is enlarged-text testing, not a physical Safari browser-zoom claim.
- Reduced motion: hero phrase remained unchanged across 4.7 seconds. Coarse-pointer emulation reported hover false and all four links present. JavaScript-disabled export retained four CV links, contact mailto and native CV anchor clearance (~112px).
- Activated all four local CV links through real browser download events, then hashed the saved bytes against repository and exported assets: all identical. See `download-hashes.json`. The previous audit independently verified the same production files and response MIME; production was not re-released.
- Contact copy returned announced success; inspected the three mailto destinations without opening/sending a message.
- Post-fix enlarged-text focus clearance test found no guide intersection with the tested focused footer link. This is a bounded check, not proof of every possible focus/scroll state.

### Preserved file destinations

All paths below use `/Alinguyen-portfolio/` on the deployed host:

| Action | Filename | Verified bytes |
|---|---|---:|
| Download PDF | cv-applied-ai-engineer.pdf | 5,853 |
| Business & Product PDF | cv-business-product.pdf | 4,212 |
| Business Development PDF | cv-business-development.pdf | 3,862 |
| Download DOCX | cv-prompt-engineer.docx | 39,516 |

## Before/after measurements

`improvements/before-loads.json` and `accepted-loads.json`: two homepage loads and two direct-CV loads per candidate, cache disabled, requested CPU 4x, download 200,000 B/s, upload 93,750 B/s, latency 150ms. Observer attached after navigation returned; 30 CV-position samples at 100ms intervals. No decorative effects were disabled for these runs. Requested latency fidelity is not established on loopback.

- Before direct-CV entry: observed CV target moved from approximately 15,713/15,728px to 111px during sampling.
- Final direct-CV entry: both runs stayed at 111.74px for all 30 samples. Two final homepage runs also showed no movement of the CV target during this window.
- Eligible layout-shift entry sums: before home .03097/.09877; before CV .01520/.01505. Final samples recorded 0 for both routes. These are short observation-window sums, **not standard session-window CLS**, field metrics, or proof of zero lifetime movement.
- LCP was absent/zero in most background-browser runs and inconsistent when reported. No defensible LCP speedup, TBT, INP, or Lighthouse claim is made. The intermediate `after-loads.json` documents that removing estimated heights alone did not resolve font-loading movement; `final-loads.json` is the pre-personalization font checkpoint, superseded by `accepted-loads.json`.

## Files changed in this implementation

- `src/app/cv-download-section.tsx`, `.module.css`: format labels and contextual business download groups.
- `src/data/portfolio.ts`: supported format/focus metadata; original files/copy preserved.
- `src/app/section-anchor-align.tsx`: one cancellable initial alignment.
- `src/app/layout.tsx`: existing local font preloads/fallbacks.
- `src/app/styles.css`, `visual-communication.module.css`: layout reservation changes, text wrapping, anchor behavior and guide callouts.
- `src/app/experience.tsx`, `visitor-stats.tsx`: optional declaration, bounded counter, finite hero phrase, contact feedback.
- `src/app/about-work-section.module.css`: shrinkable/wrapping introduction.
- `src/app/guide-character.tsx`: mobile edge position and conversion-control clearance.
- `src/app/page.tsx`: decorative duplicate spans only.
- This report, README link, and `improvements/` evidence.

Pre-existing uncommitted artwork/highlight changes and transparent assets remain intact; their separate provenance is in `ARTWORK_CHANGES.md`. No CV documents, dependencies, package lock, API implementation, or deployment configuration changed.

## Screenshots and limits

Recommended final evidence: `cv-cards-final-1280.png`, `cv-final-390.png`, `cv-final-320.png`, `text200-final-320.png`, `text200-focus-final-320.png`. Baseline comparison: `before-cvs-1280.png`. Earlier `text200-contact-final-*` and pre-final `cv-*` captures are superseded by the final-named evidence; initial visual capture timing was inconsistent. Consult geometry JSON rather than treating an intermediate screenshot as final acceptance.

No physical iPhone/Safari, native virtual keyboard, screen reader, or real browser 200% zoom test was available. Coarse pointer and text enlargement are emulations. No complete WCAG certification or production AI-availability test is claimed. Existing ongoing decorative motion outside the changed hero remains a separate follow-up. Work is uncommitted and local, per the brief.
