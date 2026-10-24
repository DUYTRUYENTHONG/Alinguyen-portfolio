# Guide keyboard/orientation follow-up — 2026-10-24

## Scope and device limitation

PASS_WITH_RISK for Chromium viewport checks and the source repair. **Physical iPhone 17 Pro Max Safari with its native keyboard is NOT_TESTED:** no connected iPhone or Safari session is available. Reduced viewport heights approximate available keyboard space; they do not emulate iOS browser chrome, native keyboard animation or its scrolling engine.

## Reproduced issue

On the deployed prior version, rotating a real two-answer conversation into a 956 × 200 viewport left the latest reply entirely below the transcript. The transcript occupied y=71–127 while the latest bubble occupied y=508–788. Input, send and close were visible, but the conversation position was stale.

## Repair

- `guide-assistant-panel.tsx`: follows the active reply, pending status or error, rather than scrolling to preferences below the messages. A ResizeObserver realigns it when the visible transcript changes size. Long replies align at their beginning so they can be read and scrolled; short replies fit in view.
- Touch/wheel/history-key interaction suspends automatic resize following while a visitor reads older messages. Focusing the composer or receiving a new turn restores following.
- `guide-conversation-scroll.ts`: viewport-coordinate calculation handles panning offsets and clamps to the actual scroll range.
- `guide-assistant.css`: short landscape mode uses available width; compact header and bubble spacing reserve room for content while maintaining 44px close and 48px input/send controls.
- `test/guide-conversation-scroll.test.mjs`: five regression scenarios. `npm run test:guide` now includes them in the existing CI gate.

## Actual checks

- `npm run test:guide`: 10 passed (five existing placement tests, five new scroll tests).
- `npm run typecheck`: passed.
- `npm run lint`: passed, 45 files.
- `npm run build`: passed, 14 static pages.
- `npm --prefix visitor-api test`: 17 passed.
- `npm --prefix visitor-api run smoke:production`: passed.
- IAB Chromium candidate: 440×956, 440×420, 956×440, 956×200 and 320×360, with composer focused and containing a question. Greeting bubble intersected the transcript in every case; input, send and close stayed inside the viewport; no page overflow.
- 956×200: compact full-width conversation showed the greeting text above the composer, not an empty transcript strip. Longer replies remain scrollable; fitting an entire long reply into that height is not claimed.
- Escape closed the modal and returned focus to the actor.
- Screenshots `keyboard-{width}x{height}.png` and `viewport-checks.json` contain local geometry evidence. They use a real input field but no native phone keyboard.

## Release follow-up

After deployment, verify a real AI reply through the public interface, then rotate/shrink the viewport while the composer is focused. Store live screenshots and measurements in the ignored artifacts directory. Native Safari keyboard acceptance still requires a connected physical-device session.
