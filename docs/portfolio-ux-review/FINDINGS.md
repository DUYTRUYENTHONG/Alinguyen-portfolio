# Evidence-backed findings

All findings below refer to baseline `6244bcd`. No P0/P1 issue was confirmed. Priorities reflect user impact, not a numeric recruiter-readiness score.

## F01 — Enlarged text creates narrow-screen overflow

- **State:** Observed; P2. Location: contact email, marketing journey, narrow layouts with 200% default text.
- **Observation:** With Chromium default text increased from 16px to 32px, measured document width was 483px at 390px and 320px viewports. The email extended horizontally; 320px also exposed marketing heading/paragraph overflow. Normal 320–1440px text layouts had no detected page overflow.
- **Evidence:** `evidence/enlarged-text.json`, `screenshots/text200-390.png`, `screenshots/text200-320.png`. Root text was verified at 32px, then restored to 16px.
- **Impact:** Reading/contact requires sideways movement or reduced text, undermining text-resize usability.
- **Proposed correction:** Wrap long email text safely; use min-width:0 and content-driven sizing for marketing and capability children. Do not hide overflow as a substitute for reflow.
- **Acceptance:** At 320/390/768px and 16/32px root text, document width does not exceed viewport; every essential sentence and contact action remains reachable and untruncated. Verify a real browser zoom/text setting separately.

## F02 — Guide callout covers content in mobile entry states

- **State:** Observed in captured visual states; P2. Location: selected work and contact at 390px while the callout is visible.
- **Observation:** `work-390.png` shows the guide bubble across project copy; `contact-390.png` shows it across the email area. This is a transient/hover/focus state, not a permanent opaque overlay. Later computed samples had opacity 0 despite overlapping rectangles; those invisible samples are not evidence of visible obstruction.
- **Evidence:** The two screenshots; `guide-character.tsx` and `.guide-callout` rules in `styles.css`/`funnel.css`; geometry in `mobile-guide-overlap.json` is supporting spatial data only.
- **Impact:** Visitors can temporarily lose the copy or contact detail they are trying to read. Callout pointer-events:none prevents it being a direct click interceptor, but does not prevent visual obstruction.
- **Proposed correction:** Reserve a safe location or collapse nonessential mobile speech; provide a deliberate way to reveal it. Keep the guide and chat accessible.
- **Acceptance:** Trigger introduction, section-entry speech, hover and keyboard focus at 320/390px. The bubble never covers an essential paragraph, email or download label. Check visibility over time, not just after it fades.

## F03 — Automatic rotating text ignores reduced motion

- **State:** Observed; P2. Location: hero `I build …` phrase.
- **Observation:** With reduced motion enabled, the phrase changed from `applied AI prototypes` to `developer tools` over 3.7 seconds. Source `RotatingFocus` runs an unconditional 3.2-second interval. The normal 7.5-second time series captured all three phrases. No pause control for this automatic update was found. CSS identity/proof tracks do stop under reduced motion.
- **Evidence:** `evidence/reduced-motion.json`, `evidence/motion-time-series.json`, `src/app/experience.tsx` RotatingFocus.
- **Impact:** Nonessential recurring updates remain distracting for visitors requesting less motion; auto-updating content needs an intentional pause/static treatment.
- **Proposed correction:** Use a stable phrase for reduced motion. Make other recurring visual motion finite or offer a pause control where appropriate.
- **Acceptance:** Reduced motion shows stable hero copy for at least 10 seconds and all content remains available. Standard motion can be paused or settles without losing meaning. Do not declare full WCAG compliance solely from this check.

## F04 — Unselected visitors are attributed to Recruiter

- **State:** Observed from frontend/backend contracts and default browser state; P2. Location: visitor role and recruiter counter semantics.
- **Observation:** Fresh entry preselects Recruiter and renders `THAT'S YOU` even before a choice. `VisitorStats` receives `selected` without `chosen`, so its initial POST uses Recruiter. The backend increments a non-null supplied role and already supports null/`none` for unclassified visitors. It therefore cannot distinguish these defaults from genuine recruiter selections. The amount of existing production contamination is **not assessed**; no database writes or historical query were performed.
- **Evidence:** `evidence/direct-cv-entry.json`; `PortfolioExperienceProvider` and `VisitorPicker` in `experience.tsx`; `visitor-stats.tsx`; `visitor-api/api/visit.js` Lua first-visit/role branches.
- **Impact:** Role counts may be misread as self-declared visitor segments, reducing evidence clarity.
- **Proposed correction:** Keep recommended content independent of declared role. Send null until a perspective is explicitly chosen; avoid `THAT'S YOU` before choice. Do not silently rewrite historical counters.
- **Acceptance:** A fresh intercepted visit sends role:null; selecting Data updates the same browser identity once; total is not duplicated; changing/reloading roles preserves the documented semantics. Verify with fixtures and existing API tests, never automated production writes.

## F05 — Direct-CV cold entry has unstable layout in the local baseline

- **State:** Observed measurement; cause remains a Hypothesis; P2. Location: cold `#cvs` entry under the recorded throttled conditions.
- **Observation:** Across three runs, direct-CV FCP/LCP varied from 2.684–11.388s; sum of non-input layout-shift values ranged 0.1000–0.4414. Homepage results were more consistent. One navigation API wait timed out, although the actual document completed; raw browser Navigation Timing was retained. Final direct-CV top ranged approximately 0–112px under this slow-load condition.
- **Evidence:** `PERFORMANCE.md`, six raw runs, settled anchor traces, `section-anchor-align.tsx`.
- **Impact:** A cold visitor can see movement or lose a consistent anchor position while looking for a file.
- **Hypothesis:** Deferred sections, font/image layout, and a finite anchor-alignment observer contribute. No performance trace isolated a single root cause; do not blame one module conclusively.
- **Proposed correction:** Profile layout-shift sources around hash navigation, reserve stable space, and tie final anchor alignment to relevant readiness rather than a guessed timeout.
- **Acceptance:** Repeat at least three matched cold home/CV loads on a quiet production build; report median/range; inspect shift source records and reading position. Establish a measured regression budget before optimizing. Do not report this raw shift sum as standardized CLS or real-user INP.

## Blocked / not assessed

- Fully isolated browser context, WebKit, real iPhone Safari, real keyboard and hardware orientation: Blocked by connected tooling.
- Complete assistive-technology review, all computed contrasts, every external destination, full physical touch gestures: Not assessed.
- No finding is based only on duplicate extracted text, a fetch-tool error, or an invalid screenshot. Decorative/accessible duplicate layers are not automatically duplicate visible content.
