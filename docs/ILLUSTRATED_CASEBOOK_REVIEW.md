# Illustrated engineering casebook — local review

## Candidate and scope

Base: `3e656bf88dcd0207b132a3010d5bd9a883bfc4a4`; branch: `codex/illustrated-casebook`. This report is included in the casebook commit. The exact tested SHA and source/export equality are recorded in `artifacts/casebook-review/manifest.json` after commit.

Preview: http://[::1]:3001/Alinguyen-portfolio/?casebook=fixed#top . This is a local Pages-format production export, **not a verified production deployment**. Source: `artifacts/coordinated-motion-source`; served export: `out-casebook-final` within that source. The export excludes unrelated uncommitted project-finder work. No push, production promotion, backend, dependency, data or CV change is included.

Only `src/app/casebook.css`, its actually loaded import in `src/app/layout.tsx`, and this report change. All rendered facts, destinations, radio/recommendation owners, tab owners, guide request logic, consent and tour controllers remain existing code. The owner's explicit casebook instruction authorizes this layout exception.

## Reference review before designing

- [Brittany Chiang](https://brittanychiang.com/): inspected the Projects hierarchy and the distinct “View Full Project Archive” link. Applied scan-first reading order to the existing index and project list; did not copy content or artwork.
- [Zangwei Zheng](https://zangwei.dev/): inspected CAME Optimizer's distinct evidence destinations. Applied destination precision rather than a generic demo action. Ali's current labels and URLs remain unchanged.
- [Aanand Madhav](https://aanandmadhav.com/): used the fermentation control “Preview day 5”; observed the change from Day 3 / Fermenting to Day 5 / Active. Applied the explanatory principle to Ali's existing snapshot diagram and existing cutoff demo, without creating a fake result or new score.
- Opened the [reference collection](https://github.com/emmabostian/developer-portfolios). No template or external imagery was imported.

## Design and render-driven corrections

Warm paper, dark ink, deep teal; existing Archivo/Inter retained. Desktop hero is a copy/portrait spread, with the face fully visible. Phone actions precede the portrait. Owner welcome remains below the spread. Five native project rows pair claim/problem/proof/action with the existing distinct artwork. The teal proof rule repeats at ROLE/PROOF and becomes the snapshot boundary.

After inspecting the first desktop render, moved the retained desktop index to the right so project copy shares the hero headline's left edge. After inspecting the KKBox row, found its conceptual footer clipped by a fixed-height frame. Changed that schematic to intrinsic height. The phone case inspection found the corresponding case frame issue; fixed it too and repeated the route. Final phone measurement: conceptual footer bottom 718.68 px, frame bottom 765.17 px; no clipping or document overflow. Product screenshots remain stationary and use their real supplied captures.

Existing motion remains bounded by actual state and visibility owners. No listener, per-frame state, library or JS module was added. No new CSS scroll-driven animation was introduced. Reduced motion retains selected/current/busy/focus states and static explanatory art.

## Acceptance observations

Browser: Codex in-app Chromium browser on Windows; exact browser version was not exposed by the available browser contract. Keyboard and pointer automation; phone-sized desktop browser, **not physical Safari**. Normal and reduced motion. Viewports: 1440×900, 390×844, 320×844 and 720×450 reflow equivalent. Guide closed on project journeys.

| Journey | Observed actions and destination | Result / friction |
|---|---|---|
| Fresh, no role → work → Vibecode → repository | Three keyboard activations: native hero work link; Vibecode case link; “View repository”. Arrived at `https://github.com/DUYTRUYENTHONG/vibecode-product-kit`; repository title observed. | Pass. Measured walkthrough **19,885 ms**, including development tool overhead. This is not a usability or hiring-impact metric. |
| Finalized CV from home | Native download URL `/Alinguyen-portfolio/cv-applied-ai-engineer.pdf`; HTTP HEAD 200. Both actions visible and clear of actor at 1440 and 390. | Link/served bytes verified. OS download receipt not captured. Master SHA256 remains `01a8fbe9a35dcffcfc7cceddad99df8720a24eeb767c046c7762d5f0eeb5f391`. |
| Data → recommendation → KKBox case → results | Select Data, activate actual `.visitor-result a` (`#project-kkbox-baseline`), case link, then “View source and verified results”. Four activations after entering the role picker. Arrived at `https://github.com/DUYTRUYENTHONG/kkbox-customer-churn-prediction/blob/main/docs/RESULTS.md`. | Pass. Decision and limitation visible in existing Read content. Index marker settled on KKBox after native jump. |
| Explain eligible events | Existing implementation and cutoff demo say transactions/listening events **on or before 2017-02-28** are eligible; later events are excluded to avoid future-data leakage. | Static diagram remains conceptual; no disputed score or future-cohort validation claim added. |
| Rapid role change | Native Space on Data, Right → Investor, Right → Student. Final checked radio and focused input: Student. Recommendation KKBox; order KKBox, Vibecode, Growth, STOS, Chợ Kênh. | Pass, exact final state saved in `rapid-role-result.json`. |
| Phone menu interruption | Open then Escape during entrance; native dialog closed, body overflow lock cleared, focus restored to Open menu. | Pass in keyboard-controlled phone viewport. Actual touch event dispatch unsupported; physical touch untested. |
| STOS case → screenshot → live product → contact | “Open full screenshot: STOS landing page on mobile” opens native new tab `/Alinguyen-portfolio/stos-home-mobile-2026.png` (390×7507). Existing “Visit STOS” action opens `https://stosvn.vercel.app/stos`; observed title “STOS | Sales Traffic Operating System”. Back returned to case; footer contact remains `mailto:nquangd1510@gmail.com`. | Pass for native image/product/Back destinations. Screenshot section explicitly says select a screenshot to view full size; underlined caption and live-product action do not require hover. No email was sent. |
| Guide focus/request feedback | Shift+Tab from Close remained inside native dialog. Escape during pending request closed immediately and restored `.guide-character`. Reopening showed completed result. | Pass in local deterministic responder export. Fast success, 5-second delayed success and bounded 503 failure tested. After failure busy markup absent, real error and fallback links present; no surviving spinner. Zero provider calls. |
| Reduced motion | Changed preference during session and repeated Data jump. All three past-event dot animation names `none`; Snapshot transform `none`; actual selected/recommendation state retained. | Pass for representative state/motion behavior. |
| Before hydration | Disabled script execution, loaded exported homepage. Hero opacity 1; native `#work` and master PDF hrefs present, menu and guide closed. | Pass for static actions. JavaScript role adaptation, dialogs and recommendation reordering are not claimed before hydration. |

## Confirmed issues and retests

| Route / steps | Observed vs expected | Fix and retest evidence |
|---|---|---|
| `#project-kkbox-baseline`, desktop Data recommendation | Fixed-height new row frame clipped “Conceptual diagram…”; expected entire explanation visible. | Intrinsic `.mock-churn`/body height. Final work capture shows full caption. |
| `/work/kkbox-baseline/`, 390 px | Case frame also clipped conceptual label; expected static explanation wholly visible. | Intrinsic case schematic frame/body height; repeated route and measured caption inside frame, `after-390-case.jpg`. |

A guide-launch activation during the role transition was not reliably reproducible with the browser controls; the settled `#top` launcher opened normally. No change was made to actor placement/tour behavior in this CSS pass. Treat as a follow-up observation, not a confirmed new regression.

## Verification limits and performance

Clean isolated-source typecheck, lint and **54/54 frontend tests** pass. Production export built with workflow public settings and `/Alinguyen-portfolio`. API/analytics code and dependencies are untouched; their previously passing 68/14 checks were not rerun for this CSS-only change. Framework emits existing nested-lockfile and module-type warnings; these are not new application failures.

No horizontal document overflow observed on tested home/case routes at 320/390/1440 or 720×450. **720×450 is a reflow approximation, not verified native 200% browser zoom.** Physical phone touch, real iPhone Safari, native zoom, clipboard permission denial and OS-level copy success remain untested. Browser permission mutation and raw touch input were explicitly unsupported. Manual contact href remains present; no false Copied state was observed, but this does not establish the denied-permission path.

Attempted a real scrolling/tab performance recording via Tracing; the browser contract did not expose the completed trace stream. `performance-counters.json` contains actual CDP aggregate samples for the same role/scroll actions against baseline and candidate. Their elapsed observation windows differed (7.73 s vs 0.34 s), so they are **not a valid regression comparison**. Do not attribute a new long task, repeated layout regression, or a performance improvement from these counters. Per-task trace attribution remains untested; capture equal-duration traces in Chrome DevTools before release. No performance or engagement uplift is claimed.

## Evidence

`artifacts/casebook-review/` contains:

- Matched before/after 1440 and 390 hero, Selected work and KKBox case JPEGs. Baseline is the served `3e656bf` export on port 3042, candidate on port 3001; same routes, top/hash entry, guide closed. Role-free matched captures use fresh tabs.
- `data-start.jpg`, `data-selected.jpg`, `data-kkbox-row.jpg`, `data-kkbox-case.jpg` and `interaction-trace.json`: real Data → recommendation → case frame sequence. Early row image predates the clipping fix; final work images show its retest.
- Guide fast/delayed/failure frames and state receipts from fixture port 3041. This fixture export preceded only the final two case-caption CSS rules; guide logic and guide styles match the final candidate. It never calls an AI provider.
- Narrow and reduced-motion checks, `rapid-role-result.json`, performance counters, and manifest. Screenshots are JPEG transports and can differ slightly from CSS viewport pixel dimensions.

Normal-speed recording was unavailable. Frame sequences and actual state/destination observations are supplied instead; no claim of 60 fps smoothness is made. Captures alone are not the interaction proof: URL/state receipts and observed native navigation are recorded above.

## Minimal semantic proposal — not implemented

Move the existing `project.link` anchor in `src/app/work/[slug]/page.tsx` from the bottom `.case-links` to immediately after `.case-facts`, leaving “Back to all work” at the bottom. Keep the current labels, URLs and data binding. That would reduce the remaining keyboard/scroll distance to repository/results/live product evidence. This needs a small TSX structure edit; this pass completes the CSS design on existing rendered elements and proposes that edit separately as requested.

## Reproduce

```powershell
npm ci
npm run typecheck
npm run lint
npm run test
$env:NEXT_PUBLIC_BASE_PATH='/Alinguyen-portfolio'
$env:NEXT_PUBLIC_SITE_URL='https://duytruyenthong.github.io/Alinguyen-portfolio'
$env:NEXT_PUBLIC_VISITOR_API_URL='https://ali-portfolio-visitor-api.vercel.app/api/visit'
$env:NEXT_PUBLIC_GUIDE_API_URL='https://ali-portfolio-visitor-api.vercel.app/api/guide'
npm run build
node scripts/preview-export.mjs out --redirect-legacy
```

Use a clean checkout of the casebook commit for reproduction: the current workspace also contains unrelated owner-approved finder work, intentionally excluded from this export and commit.
