# Proof, motion and partner-gallery pass

## Scope and revision

Starting HEAD: `5dca188af23a352816191f9724326be644a38ea9`.
Feature branch: `codex/proof-motion-gallery`.
Local export: http://127.0.0.1:3037/Alinguyen-portfolio/

The read-only audit preceded the visual changes. It inspected the named components,
active CSS, exported routes, configuration, workflow and installed Next.js static-export
and instrumentation-client documentation. The public `main` revision still equals the
requested audit reference `8da9f0fe99de5eb65840ffdab791f46c8db2a08f`. Live HTML loads,
but does not identify an exact build SHA; a live-SHA match is not asserted.

Starting dirty work was preserved: AGENTS.md, adaptive-hero.tsx and the untracked
finder policy/component/styles/test/docs. The isolated candidate is starting HEAD
plus this CSS patch, excluding that separate finder work. Thus this is not a QA
claim about the combined dirty worktree or the current Production guide.

Only **src/app/styles.css** changes runtime behavior. No JSX, API, dependency,
workflow, content, CV, actor or tour changes were made. No production release or push.

## Three priorities and pass conditions

| Priority | Actual friction | Change | Pass condition / result |
|---|---|---|---|
| 1. Make proof and its next action readable | Mobile proof sentence was 12px; case facts 14.72px; small source action | 16px wrapping proof, 16.48px case values, clearer labels, underlined source actions and focus outlines | No clipping/overflow at 320/390/1440px; original repository/results destinations preserved: **pass** |
| 2. Confirm the selected destination and explain time | Native project hashes had no persistent card accent; existing entrance was 16px/400ms; past dots scaled and marker glowed | Static target outline, 8px/320ms Selected work settle, one short past-event highlight with fixed marker; product captures still | Target outlined without JS; observed entry trace and reduced-motion resting state: **pass** |
| 3. Connect captures to captions | Fixed-height image frames and separate captions weakened their grouping | Product-only bordered figures, natural image height, existing visible caption arrow, reserved intrinsic ratios and focus border | Single-column phone gallery, complete preview ratios, native full-size URLs and distinct live-product links retained: **pass** |

Source positions and accessible link names are in the [baseline](evidence/baseline-actions.json)
and [after](evidence/after-actions.json) receipts. Positions are viewport-relative and may
be below the fold; they are not claims that every action starts on screen.

## Baseline and repeated tasks

| Task | Baseline | After | Evidence / result |
|---|---|---|---|
| Default recruiter: top → work → Vibecode → public source | 1440×900, 12.946s, three clicks | 1440×900, 8.741s; 390×844, 6.396s; three clicks, zero role choices | [After walkthroughs](evidence/after-walkthroughs.json): role, offline decision and unmeasured-adoption limit found; correct public URL opened. **Task pass**, not uplift evidence |
| Return and finalized CV | Existing native return links and direct PDF download | Browser Back → case; Back to selected work → homepage; existing Download AI CV clicked once | Native links unchanged; finalized PDF hash below. **Pass** |
| Direct data case → safeguard → results → limit | Snapshot safeguard and source already present | Direct KKBox case → View source and verified results ↗ → public RESULTS.md | [Data journey](evidence/data-journey.json). Same-cohort and event-arrival limits visible in the source. **Pass** |
| Partner → real product capture → live flow/contact | STOS/Chợ Kênh captures and live links existed; source followed captures | Grouped captures; Visit Chợ Kênh ↗ opened the live catalog, whose existing Liên hệ Zalo starts an intermediary inquiry | Catalog inspected read-only; no inquiry sent. Footer Get in touch ↗ remains `mailto:nquangd1510@gmail.com`. **Pass**, with source-location obstacle retained |
| Skim technical decision | Omitted | Still omitted | Keyboard Home selected Skim; decision absent. **Proposal only**, not shipped |
| Source earlier than gallery | No | No | No visual or DOM reordering. **Proposal only**, not shipped |

Times are engineer-operated, selector-assisted walkthroughs, including navigation and
tool pauses. Browser locators scrolled links into view: three clicks are measured,
not three total human actions or zero physical scrolls. The mobile earlier manual-scroll
walkthrough was 25.846s, but is not a controlled pair. These runs establish that the
route is executable under 60 seconds with operator knowledge; they do not establish
first-time recruiter comprehension, engagement, adoption or conversion improvement.

**Hesitation:** the source action still follows the full narrative/captures. Reading
depth can also hide a decision in Skim. The optional patch below addresses both using
server-rendered semantics; CSS does not pretend those improvements have shipped.

## References checked in the rendered browser

| Reference | Useful observation | Ali already has | Transfer in this pass |
|---|---|---|---|
| [Brittany Chiang](https://brittanychiang.com/) | Explicit section jump links, concise engineering identity and contextual project links | Project indexes, role and proof | Strengthen the existing destination and proof action; retain native links |
| [Adham Dannaway](https://www.adhamdannaway.com/) | Distinct designer/developer entry choices lead to concrete work | Optional role selector | Leave the choice and hero composition alone; clarify downstream evidence |
| [Zangwei Zheng](https://www.zangwei.dev/) | CV and project artifacts have direct links | One-click CV and case source links | Keep CV direct; propose moving the existing source beside facts |
| [Aanand Madhav](https://aanandmadhav.com/) | Product summaries connect decisions to work/contact paths | Product cases, captures and footer contact | Visually group captures and retain existing inquiry/contact routes; borrow no outcome numbers |
| [Lee Robinson](https://leerob.com/) | Short/long biography control offers reading depth | Skim/Read/Deep dive | Propose preserving the technical decision in the short view |
| [Bruno Simon](https://bruno-simon.com/) | Optional exploration has explicit controls and recovery | Optional guide with close/Escape | Leave the guide alone; make native, API-independent evidence paths sufficient |

One interaction worth leaving alone: the role-driven project index. Its stable project
IDs, native hash links and actual DOM reorder are more useful here than a new 3D
navigation layer. Reference text/assets/metrics were not copied into the portfolio.

## Motion ownership and runtime observation

- PortraitReveal owns portrait blur/scroll; unchanged.
- HighlightFeatureArt owns its observer and HUD reveal; unchanged.
- useOnceVisible owns existing `data-entered` illustrations; unchanged.
- `src/instrumentation-client.js` mounts `startHomeMotion` after hydration. The existing
  played-ID set, observer, jump/focus settling and cleanup still own work entrances.
  No hook integration or new scroll listener is needed.
- Scoped CSS only adjusts that existing state: heading `home-heading-enter`, 0.32s,
  8px; timeline `home-past-event`, no positional transform; marker and future dots
  animation none. [Actual trace](evidence/motion-trace.json).
- Reduced motion was changed during the session: all past dots settled at opacity 1,
  marker and product images had animation none. [Receipt](evidence/reduced-motion.json).
- JavaScript disabled: native project target stayed outlined, text/diagrams and CV/
  image/product/contact links remained present. [Receipt](evidence/no-js.json).

## QA and boundaries

| Check | Result |
|---|---|
| 390×844, 1440×900, additional 320px | No page overflow on all five audited routes; 16px proof text wraps |
| Fresh entry / direct hash | Fresh deep hash intentionally resets to #top; after a visit the project hash is retained and heading visible. Owner policy preserved: [receipt](evidence/entry-policy.json) |
| Browser Back | Supported browser Back restored originating project hash, opacity 1 and target accent. Native scroll restoration may retain the clicked action lower in the card: [receipt](evidence/browser-back.json) |
| Role and guide dismissed | Founder moves Growth Commerce OS first, hero target remains its stable ID, active index follows that target. Dismissed tip does not prevent native links |
| Guide open/closed | Close and Escape both close the dialog and restore focus to guide-character: [receipt](evidence/guide-close.json) |
| Visitor API unavailable | Network-blocked visit endpoint produced existing unavailable message; five native case links remained usable. No live inference call made |
| Case tabs | Right → Deep dive, Home → Skim, End → Deep dive, Left → Read; focus and aria-selected agree: [receipt](evidence/depth-tabs.json) |
| Focus | Source link has visible outline and correct URL. Directly targeting the off-screen link through the automation did not prove natural tab-scroll clearance; full keyboard-only traversal remains a human check: [trace](evidence/source-focus.json) |
| Slow image network | 800ms latency / 128,000 bytes/s scenario loaded all STOS captures; final captions/links remained usable. Exact preview aspect ratios reserved in CSS. Initial-frame CLS not measured: [receipt](evidence/slow-images.json) |
| 200% zoom | 720×450 CSS-pixel reflow approximation had no page overflow. Native browser 200% zoom still unverified: [receipt](evidence/zoom-equivalent.json) |
| Find-in-page / touch hardware | Native Find and real-device touch-scroll not automated; human review remains |
| LCP / CLS / transfer medians | Not measured. PerformanceTimeline was unavailable through the browser tool; no comparable three-run performance result is claimed |
| Public targets | Evidence page, finalized CV, Vibecode, KKBox results, STOS, Chợ Kênh and Growth service all HTTP 200: [receipt](evidence/public-links.json) |

Existing installed dependencies: **49 frontend, 67 visitor-api and 14 analytics tests
passed**, as did typecheck, lint and the actual base-path production export. Root and
suite lockfiles are unchanged. `npm ci` in a new isolated checkout **failed ENOSPC**.
The requested clean-install gate is therefore **not passed**. Automatic approval
rejected recursive cleanup of that partial install. Only disposable, reproducible
source archives were cleared to allow the scoped work; existing dependencies were
used for passing checks. Release acceptance remains conditional on clean CI and
the human checks above.

Finalized PDF SHA-256 remains
`01a8fbe9a35dcffcfc7cceddad99df8720a24eeb767c046c7762d5f0eeb5f391`.

Reproduce after freeing sufficient disk space, in an isolated clean checkout:

```powershell
npm ci
npm --prefix visitor-api ci
npm --prefix visitor-api test
npm --prefix analytics ci
npm --prefix analytics test
npm run typecheck
npm run lint
npm test
$env:NEXT_PUBLIC_BASE_PATH='/Alinguyen-portfolio'
$env:NEXT_PUBLIC_SITE_URL='https://duytruyenthong.github.io/Alinguyen-portfolio'
$env:NEXT_PUBLIC_VISITOR_API_URL='https://ali-portfolio-visitor-api.vercel.app/api/visit'
$env:NEXT_PUBLIC_GUIDE_API_URL='https://ali-portfolio-visitor-api.vercel.app/api/guide'
npm run build
```

Serve `out/` mounted at `/Alinguyen-portfolio/`; do not test from an unprefixed root.
The Pages workflow's production-guide smoke command was deliberately not run: no
public provider call is needed for this front-end pass.

## Before / after and rollback

| Subject | Before | After |
|---|---|---|
| Mobile project | [Before](evidence/before-390-_project_vibecode_kit.jpg) | [After](evidence/after-390-_project_vibecode_kit.jpg) |
| Mobile case entry (composition unchanged) | [Before](evidence/before-390-work_vibecode_kit_.jpg) | [After](evidence/after-390-work_vibecode_kit_.jpg) |
| Mobile STOS gallery | [Before](evidence/before-390-work_stos__case_media_title.jpg) | [After](evidence/after-390-work_stos__case_media_title.jpg) |
| Desktop Chợ Kênh gallery | [Before](evidence/before-1440-work_cho_kenh__case_media_title.jpg) | [After](evidence/after-1440-work_cho_kenh__case_media_title.jpg) |

Implementation is the appended scoped block in `src/app/styles.css:323–366`:
proof/source hierarchy, native target outline, product-only gallery, then motion.
Each group can be removed independently; for the whole pass reverse only this
commit's styles.css diff. Do not restore the whole file or unrelated dirty work.

Viewport sizes are measured from the live DOM. The browser transports screenshots
as JPEGs with slightly smaller encoded dimensions; the [image manifest](evidence/screenshots.json)
records their actual bytes, dimensions and hashes rather than labeling them PNGs.

The [optional semantic patch](semantic-proposals.patch) passed `git apply --check`
but **was not applied**. It keeps the decision in Skim while still omitting the longer
implementation, adds one native `project.link` anchor immediately after case facts,
and removes its redundant bottom source action. No duplicate React-owned links or
visual reading-order tricks were shipped.

**Remaining recruiter obstacle:** the primary public source is still below the
case-study narrative and product captures.
