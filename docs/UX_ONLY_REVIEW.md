# Avatar UI — interaction fixes only

Branch: `codex/avatar-ux-only`, based on restored UI commit `218e2c9`. The exact reviewed commit is in `artifacts/ux-only-review/manifest.json`.

Preview: http://[::1]:3001/Alinguyen-portfolio/?ux=review2#top . Local exported build; not pushed or deployed. The owner must review this preview before production deployment.

## Preserved appearance

No CSS, layout structure, artwork, colors, type, copy, project destinations, CV or backend change. Existing avatar entrance, role imagery and placement policy remain. Matched 390×844 measurements of hero and portrait before/after were identical, including position, width and height. Before/after images and `before-layout.json` are in `artifacts/ux-only-review/`.

## Fixes

1. Project location: IntersectionObserver returns only changed entries. The old code could replace a more visible unchanged project with a less visible newly reported project. Keep the complete visible set, select the most visible with current role order as tie-breaker, reset after reordering, and reflect valid native project hashes immediately. Native anchors and history remain the owners of navigation.
2. Actor interaction: freeze its current active target while hovered, pressed or keyboard-focused, including a dock transition. A new selected-card docking result no longer hides the button during that interaction. The existing idle position/appearance is unchanged.
3. Mobile navigation: reveal the existing header when it receives focus; keep it visible while it contains keyboard focus, even during scrolling. The first QA attempt showed that focus reveal alone was insufficient because a later scroll callback hid it again. Added the focus guard in the scroll handler and repeated that path successfully.

## Verification

In-app Chromium browser, desktop keyboard/pointer automation and resized viewports. No physical iPhone/Safari or real on-screen keyboard was available.

- 390×844: Data recommendation → actual KKBox hash; marker KKBox, Data checked and KKBox first. Then native STOS jump → STOS marker.
- Scrolled downward, focused mobile menu button: final retest `is-hidden=false`, top=16 px, focus “Open menu”. Enter opens; Escape closes.
- Focused actor then scrolled 900 px: button remained visible, focused, with identical bounds (left=291, top=724, 68×96). Enter opened guide.
- Landscape 844×390: guide close and input visible; Escape usable.
- Compact 390×360: close at 14.7–58.7 px; input and Send at 295.3–343.3 px, all inside viewport. This is a compact-viewport simulation, not proof of Safari keyboard behavior.
- 320×844 and 1440×900: no horizontal document overflow on inspected home/work paths; existing work/CV hrefs retained.
- Live preference change to reduced motion: native KKBox jump and matching marker retained.
- Clean isolated source: typecheck, lint, **56/56 frontend tests**, production export pass. Two regression tests cover partial observer batches, removal, tie-breaking and unknown project IDs.
- No provider probe calls were made; guide network/request code is unchanged.

Actual DOM observations are in `artifacts/ux-only-review/checks.json`, including the initial failed menu-focus attempt and successful retest. Unchanged CSS/layout diff is empty. No interaction/conversion improvement is inferred from these development checks.

## Changed files

- `src/app/experience.tsx`: navigation focus and project-marker lifecycle.
- `src/app/project-location.ts`: complete-set visibility selection.
- `src/app/guide-character.tsx`: preserve engaged actor during docking.
- `test/guide-project-location.test.mjs`: regression tests.

The preview uses `artifacts/coordinated-motion-source/out`, built with the workflow's public URLs and `/Alinguyen-portfolio` base path. It excludes unrelated in-progress finder changes in the workspace. To reproduce from a clean checkout: `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test`, then build with `.github/workflows/pages.yml` public environment settings and run `node scripts/preview-export.mjs out --redirect-legacy`.
