# Carousel orientation and interaction follow-up — 2026-10-24

## Device availability and release decision

PASS_WITH_RISK for the source repair and Chromium checks below. **Real iPhone 17 Pro Max Safari acceptance remains unverified.** Browser inventory contained Chrome, the in-app browser and MCP Apps; no Safari or physical iOS session was connected. Large-phone viewport and coarse-pointer emulation do not reproduce Safari's scrolling engine, browser chrome or physical touch momentum.

## Repair

`src/app/customer-collaboration-section.tsx`:

- Autoplay cleanup previously called scrollTo at the current position whenever playback changed. That cleanup could race a new manual smooth scroll. Cancellation now happens synchronously before interaction handlers start the next scroll; effect cleanup only cancels the timer/listeners/observer.
- Pause explicitly stops the current slide before changing playback state. Changing to reduced motion also cancels an active slide.
- Mouse hover pauses only when the device reports both hover support and a fine pointer, keeping coarse-pointer interaction independent from compatibility mouse events.
- Existing passive touchstart and pointerdown handlers, four-second cadence, native swipe surface, all 15 entries and five external links are preserved.

These are source-level interaction fixes, not a claim that a Safari-specific failure was reproduced.

## Actual checks

- Preflight: clean initial working tree, zero conflict markers. Pattern flags were generated/vendor bundles and existing development/test logging; no new bypass introduced.
- `npm run typecheck`: passed.
- `npm run lint`: passed, 44 files.
- `npm run test:guide`: passed, 5 tests.
- `npm run build`: passed, all 14 static pages.
- `npm --prefix visitor-api test`: passed, 17 tests.
- `npm --prefix visitor-api run smoke:production`: passed.
- `git diff --check`: passed before commit.
- IAB Chromium with touch/coarse-pointer emulation: 440 × 956 portrait and 956 × 440 landscape, including rotation without reloading. No page overflow; controls stay 46px high, and all three controls were visible in landscape.
- Portrait: synthetic touch PointerEvent pauses; Play resumes progression. A separate touchstart event pauses at scrollLeft 1336.67 and remains there for longer than one four-second slide interval.
- Landscape: Play resumes after rotation; synthetic touch pauses at scrollLeft 1761.33 and holds for longer than one slide interval. Play does not immediately reset the rail position and subsequent automatic progression resumes.
- Manual Next navigates to a snap-aligned position and pauses playback.
- Final reduced-motion check: Motion off displayed and autoplay disabled; manual Next remains usable.

Screenshots: portrait-touch-paused.png, landscape-touch-paused.png, landscape-play.png. Timed measurements: orientation-checks.json. Screenshots demonstrate layout, not motion timing.

## Remaining acceptance on real Safari

On a connected iPhone 17 Pro Max, open #feedback in portrait and landscape. Let at least one slide complete; touch/drag the rail and confirm it stays paused after release. Tap Play, confirm no immediate jump and smooth progression after the four-second delay. Repeat during an active slide and after changing orientation. This exact physical-device check could not be executed in this environment.
