# Chat: short landscape follow-up — 22 October 2026

## Scope and limitation

No physical iPhone, Safari session, or remote real-device testing service is connected. These checks use the in-app Chromium browser, with resized viewports approximating space remaining above a keyboard. They do not prove iPhone 17 Pro Max Safari behavior, native keyboard handling, safe-area behavior, or rotation on hardware.

## Observed issue and correction

At 956 × 200 CSS pixels, the previous privacy footer extended to y=215 beyond the dialog bottom at y=180. The footer could also push composer controls outside still shorter viewports.

The unchanged privacy notice now appears first in the scrollable transcript and remains the dialog's accessible description. The header and composer remain fixed within the flex dialog. Below 300px visual height, vertical margins shrink to 8px (or the larger safe-area inset) and transcript vertical padding is removed. Existing visualViewport resize/scroll tracking handles these rules without remounting the input.

## Checks completed

- Eight Chromium sizes: 956×160, 956×200, 956×250, 956×440, 440×300, 440×956, 320×568, 1440×900. All close/input/send rectangles fit both the dialog and visual viewport. Exact measurements: `control-matrix.json`.
- Focused input retained its text and focus across portrait-to-landscape resizing; send enabled with text; input font remained 16px.
- Close button dismissed the dialog.
- `npm run typecheck`: passed.
- `npm run lint`: passed, 41 files.
- `npm run build`: passed, 14 generated outputs.
- `git diff --check`: passed.

The extremely short 160px layout leaves only a 21px transcript; dismissing the keyboard or returning to portrait is needed for comfortable reading. Controls remain available.

Screenshot compositing did not reliably match the emulated layout dimensions, so no screenshot is presented as device evidence.

## Remaining hardware acceptance

On an iPhone 17 Pro Max in Safari, open the guide, focus the input, type a question, rotate into landscape with the keyboard open, and verify close/input/send remain visible and tappable. Send a question, scroll a long answer, dismiss/reopen the keyboard, rotate back, and close the guide. Repeat with Safari toolbar expanded/collapsed and larger text. Record iOS version and actual viewport if any clipping occurs. This check is pending device access.
