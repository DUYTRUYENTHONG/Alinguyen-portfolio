# Role guide interaction review — 2026-10-31

Scope: role actor movement and bubble interaction only. The owner welcome,
section order, navigation, cards, content and backend remain unchanged.
Baseline: 86dccd64c096ccfcffce4e119582e149c5957dc3.

## Research and decisions

- [Browser animation performance](https://web.dev/articles/animations-and-performance):
  animate the shared anchor with transforms. Measure destinations after scrolling
  settles, not on every animation frame. Stop the frame loop when travel ends.
- [W3C hover/focus content guidance](https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus):
  keep reading targets stationary, provide Escape and a 44px dismiss control,
  and keep the role introduction available until dismissed or chat opens.
- [Reduced motion](https://web.dev/articles/prefers-reduced-motion):
  skip travel interpolation and retain the existing reduced-motion artwork rule.

The artwork is an animated image, not a newly rigged or photorealistic 3D model.
Adding extra idle effects would not repair the navigation and visibility bugs.

## Root causes fixed

1. The actor wrote new coordinates immediately on scroll frames. It now waits
   for a 140ms scroll pause, then uses time-based damping. DOM geometry is not
   remeasured inside the travel loop; the actor stops on pointer hold, mouse
   hover or keyboard focus. The existing right-edge placement solver is retained.
2. The collision solver could hide the complete introduction in dense content.
   Explicit role introductions and engaged tips may use a clamped adjacent
   bubble; passive context tips still require empty space. Intro text no longer
   expires after five seconds. The dismiss action keeps tips hidden until the
   next role change, while the actor remains available for chat.
3. The bubble could change sides during interaction. Its position and tail are
   retained while engaged, with a new fit check after viewport changes. It is
   temporarily hidden during unengaged travel, then revealed beside the actor.

## Verification

- Lint and TypeScript passed. Guide suite: 38 tests passed, including new
  60/120 Hz consistency, bounded travel, convergence and long-frame checks.
- Production static build passed (16 generated pages); diff whitespace check
  passed. No dependency, workflow, API, credential or analytics changes.
- Chromium viewport checks: 320x568, 390x844, 440x956, 514x652, 768x844,
  1024x768, 1440x900 and 956x440. Actor and introduction fit; no horizontal
  document overflow in sampled views.
- Scroll sample: actor remained at y=324.27 while scrolling, then progressed
  through y=393.80, 425.55, 437.45, 444.03 and 451.48 to y=452.26. Bubble
  returned after settling. No frame-rate benchmark is claimed.
- Role changes updated persona, artwork and introduction. Dismiss and Escape
  hid the bubble; Enter opened chat; closing chat returned focus to the actor.
- Reduced motion computed artwork animation as `none`.
- Chat close/input/send bounds fit at 440x956, 956x440, 440x440 and 956x220.
  The last two are short viewport simulations, not native keyboard tests.
- Missing local API configuration exercised the existing actionable error
  state. With the public endpoint configured, chat returned a response and
  source link. No API or secret configuration is committed.
- Browser console inspection found no application errors during the checks.
- Evidence: ignored `artifacts/guide-interaction-2026-10-31/` contains measured
  bounds, movement samples and the mobile introduction screenshot.

## Limits and existing issue

Physical iPhone/Safari, native keyboard, actual touch-hold behavior and hardware
frame timing remain unverified. This browser does not support touch-event
injection. Keyboard entry/exit and dismissal passed; the browser automation
could not establish focus persistence during PageDown independently of its
input behavior, so that specific check is not claimed.

An existing AI reply to “Which products are live?” incorrectly claimed only
Growth Commerce OS is live, omitting STOS and Cho Kenh. The response and source
link rendered, but answer completeness is not accepted. This actor-only change
does not alter the frozen/reverted backend answer policies. Record this as a
separate content-reliability issue, not a passing AI accuracy evaluation.

Release assessment: PASS_WITH_RISK for the scoped actor update, subject to the
existing Pages CI gates. No full-site or AI accuracy
acceptance is implied.
