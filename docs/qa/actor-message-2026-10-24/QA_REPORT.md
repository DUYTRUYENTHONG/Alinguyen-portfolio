# Actor message regression — 24 October 2026

## Cause and correction

The actor still set its `is-speaking` state, but the recent CSS change only revealed its callout on hover/focus. Mobile callouts were hidden to protect text. This made the actor appear silent. The actor's key handler also consumed Space for jumping rather than allowing the native button action.

- Added an in-flow greeting and explicit Ask button above the audience choices. Its space is reserved before hydration; it is readable on mobile and desktop and does not require hover. The actor moves to the outer edge in this section so it does not cover a role label.
- Restored timed desktop messages where a nearby bubble fits without covering headings, copy, role artwork or controls. If no clear position exists, the optional floating bubble is omitted; chat remains available.
- Space now opens the actor's chat as a normal button. Arrow Up retains the documented jump shortcut.
- Greeting Ask buttons use the same dialog handler as the actor; no fake AI answer or API behavior was introduced.

## Verification

- `npm run typecheck`, `npm run lint` (44 files), production-base-path `npm run build`: passed.
- `npm run test:guide`: five geometry regression cases passed (clear space, blocked right side, no safe area, right viewport edge, narrow/short viewport). Existing Node test runner, no added dependency. Added this command to the Pages workflow.
- `npm --prefix visitor-api test`: 17 passed.
- `npm --prefix visitor-api run smoke:production`: grounded answer, expected citation, CORS and response shape passed.
- `git diff --check`: passed.
- Chromium at 1224, 1024, 768, 390 and 320px: greeting visible, no overlap with role choices, no horizontal overflow, Ask action at least 44px. See `responsive.json` and desktop/mobile screenshots.
- Space on actor opened the dialog; Enter on the in-flow Ask button also opened it. Typed draft remained usable with close/input/send inside a 956×200 viewport. Escape closed the dialog. See `interaction.json`.
- Physical Safari keyboard testing was unavailable; short viewport checks are approximations.

The local preview deliberately blocks visitor/guide API traffic via CSP. The separate production smoke validates the API; a live browser send is checked after publication. No visitor-counter test writes or contact messages were sent. Publication follows the existing authorized GitHub Pages workflow.
