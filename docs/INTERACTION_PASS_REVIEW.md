# Focused scroll / hover / keyboard UX pass

Local preview: http://[::1]:3001/Alinguyen-portfolio/?interaction=final#top

Branch: `codex/avatar-ux-only`, based on `d93239e`. Exact candidate SHA is recorded in `artifacts/interaction-pass/manifest.json`. Not pushed or deployed.

## Changes

- `src/lib/home-motion.js`: reuse the existing mounted, post-hydration work observer. Cue the existing decorative heading rule first; artwork entering in the same beat waits only for the remainder of its 160 ms cue. Later artwork has no extra delay. Existing fast-scroll, focus, hash, reverse-scroll completion and played-ID behavior remain. Portrait caption's previous 40 ms delay, Highlights and portrait effects are preserved.
- `src/app/styles.css`: existing work schematics settle 8 px over 280 ms. Heading rule draws over 160 ms. Override the older waiting/running copy rule so project titles and problem text remain opacity 1, untransformed and readable throughout. Product screenshots remain still with their existing frame accent. No composition, content, route, artwork, dimensions, color or resting-state redesign.

No new JS mount, library, scroll listener or React state. All behavior is in loaded CSS/JS. No CSS view-timeline or reverse-scroll replay was added. Existing radios, current-location markers, tabs, native dialogs and real guide/copy status owners remain authoritative.

## Browser checks

In-app Chromium on Windows; 1440×900 mouse/keyboard and 390×844 resized viewport. Exact browser version is not exposed. Native touch dispatch and screen recording are unavailable in this browser contract; no physical phone/Safari result is claimed.

| Check | Status | Observed result |
|---|---|---|
| Work entry, fast scrolling, reverse | Pass for usability/end states; timing source-verified | Heading opacity 1. Landing project text opacity 1/transform none. Artwork moves waiting → complete and stays complete on reverse. Existing one-time/fast-scroll owner retained. Frame sequence does not establish frame rate or prove intermediate 280 ms smoothness. |
| Project jump and Back | Pass | Data recommendation reached `#project-kkbox-baseline`, matching current marker. Jump three cards ahead to STOS, then native Back returned to KKBox with its marker. |
| Hero repeated hover | Pass | Fine-pointer arrow matrix translated x=2 px. Link rectangle identical before/after. Repeated enter/leave did not move target. |
| Role hover | Pass | Founder tile truly `:hover`, whole-card transform none and identical bounds; decorative icon translated y=-2 px. |
| Rapid roles | Pass | Data → Investor → Student: focused/checked Student; KKBox recommendation; order KKBox, Vibecode, Growth, STOS, Chợ Kênh; current marker KKBox. Then selected Data and followed its actual recommendation. |
| KKBox resting explanation | Pass | Snapshot transform none; future-event borders rgb(174,184,200). Existing conceptual explanation and limits retained; no score added. |
| Gallery mouse hover | Pass | Actual hover=true, same page scroll and identical image/link rectangles before/after; image transform none. Caption/frame response uses existing focus/hover rules. |
| 390 px first activation | Pass for pointer click only | One click on “Open full screenshot: STOS landing page on desktop” opened `/Alinguyen-portfolio/stos-home-desktop-2026.png` in a native new tab. This is not a real-touch claim. |
| Case tabs | Pass | End selected Deep dive; focus remained on Deep dive. Existing arrow/Home/End owner unchanged. |
| Menu/guide Escape | Pass | Enter followed by Escape closed both native dialogs under reduced motion. No dialog remained open. Earlier normal-motion UX pass verified restored opener focus; controller unchanged here. |
| Reduced preference changed mid-session | Pass | Work heading opacity 1; all five artwork transforms/animation names none. Selection/current state remained. Preference restored after test. |
| Real touch, swipe momentum, Safari first tap | Untested | Raw touch dispatch is unsupported. Test on a physical phone before release; pointer activation does not prove touch behavior. |
| Clipboard denial / real guide pending→error | Not rerun in this patch | These state owners are unchanged. Prior fixture feedback checks and regression tests remain; this pass makes no provider calls and does not claim OS clipboard permission verification. |

## Evidence and failures

`artifacts/interaction-pass/trace.json` records actual routes, current markers, motion metadata, viewport/scroll positions, computed text styles and timestamps. Matching JPEG sequences:

1. `scroll-start`, `scroll-middle`, `scroll-art`, `scroll-reverse`: heading entry, first artwork and reverse resting state. A preliminary overshoot was discarded; final named frames have matching last receipts in the trace.
2. `gallery-start`, `gallery-hover`, `gallery-phone-before`, `gallery-open-image`: desktop actual hover and subsequent phone-sized pointer activation. Screenshots and traces explicitly distinguish these inputs.
3. `data-selected`, `data-kkbox`, with rapid-radio state receipt: Data selection and native recommendation destination.

Normal-speed clips were unavailable, so these are time-ordered frames plus real input/state/destination observations, not recordings. No hiring, conversion, engagement or frame-rate claim is made.

Confirmed issue fixed: on `#work`, the older `[data-home-motion-kind=copy]` waiting/running rules could dim/translate project text. Replaced only that interaction state with immediate resting text. Browser computed check after native Data navigation: all mounted project-copy nodes opacity 1 and transform none. An initial lint error for a value-returning forEach callback was corrected; final lint passes.

## Build and preview

Typecheck, lint, **56/56 frontend tests** and production export pass. Dependencies/backend unchanged. Served export is `artifacts/coordinated-motion-source/out`, using the workflow's `/Alinguyen-portfolio` and public API settings, excluding unrelated workspace finder changes.

From a clean checkout, run `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test`; set the public variables from `.github/workflows/pages.yml`, run `npm run build`, then:

```powershell
node scripts/preview-export.mjs out --redirect-legacy
```

The current review server uses:

```powershell
node scripts/preview-export.mjs artifacts/coordinated-motion-source/out --redirect-legacy
```
