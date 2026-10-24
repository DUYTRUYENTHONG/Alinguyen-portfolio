# Collaboration autoplay — 2026-10-24

## Behavior

Supersedes the manual-only carousel behavior documented in the preceding collaboration-carousel report. All 15 entries, five existing destinations, original assets, order, heading and qualification remain unchanged.

- Advances one logo every four seconds and returns to the start after the final entry.
- Mouse hover stops movement, including an active smooth slide. Leaving starts a fresh four-second delay.
- Touch/pen interaction, keyboard focus within the collection, wheel scrolling and Previous/Next navigation stop autoplay until Play is selected. Logo links keep their native behavior.
- Visible Pause/Play control remains available; touch events on that control do not independently toggle playback before activation.
- Reduced-motion preference disables autoplay and uses instant manual navigation. The preference responds to changes during the session.
- No timers run while the rail is offscreen or the document is hidden. Observers, listeners and timers clean up when the effect stops.

## Actual verification

- `npm run typecheck`: passed.
- `npm run lint`: passed, 44 files.
- `npm run test:guide`: passed, 5 tests.
- `npm run build`: passed, 14 static pages generated.
- `npm --prefix visitor-api test`: passed, 17 tests.
- `npm --prefix visitor-api run smoke:production`: passed.
- `git diff --check`: passed before release.
- IAB Chromium: 1440, 1280, 1024, 768, 390 and 320px layouts; all 15 entries present, no page overflow, every control at least 46px high. At 320px the controls wrap below the collection label rather than squeezing it.
- Automatic progression observed with no control activation. Hover kept the rail at scrollLeft 874 across a wait longer than one slide interval; pointer leave resumed progression.
- Synthetic touch PointerEvent on the rail changed Pause to Play and kept scrollLeft at zero across a wait longer than one interval.
- Touch PointerEvent on the rotation control kept Pause unchanged until activation; activating the button then changed it to Play. This regression check covers the double-toggle issue found during review.
- Reduced-motion emulation displayed disabled Motion off and kept scrollLeft at zero across more than one interval. Manual navigation reached 14–15 / 15; Play after restoring normal motion looped back to the earlier entries.
- Enter and Space activate native controls. Manual Next leaves autoplay paused.
- 844 × 390 landscape: no page overflow, all three controls visible when navigating.

Evidence: responsive-checks.json, carousel-{width}.png and carousel-landscape.png beside this report. Screenshots show layout; timed observations above verify behavior.

## Limits

No physical iPhone/Safari was connected. The in-app browser does not support native touch-event injection; the touch pause handler was checked with a synthetic PointerEvent through DevTools, not a physical swipe. Offscreen/background suspension was reviewed in source; it was not separately simulated through browser visibility APIs.
