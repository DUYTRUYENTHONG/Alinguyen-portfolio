# Highlights artwork and fixed guide QA

## Scope

- Replace only the selected Highlights feature artwork with an AI-enhanced version of the owner's AI Marketing reference. It is an illustration, not product evidence.
- Preserve the surrounding cards, section order and main navigation.
- Keep the floating guide at the bottom-right with safe-area clearance. Preserve the selected-role card handoff to avoid a duplicate floating actor while its card portrait is visible.
- Give all 11 roles distinct, subtle perspective animations during scrolling. Animate the image only, keeping the chat tap target stationary. These are CSS depth effects on existing avatars, not new skeletal 3D models.
- Artwork motion has Pause/Play controls; both artwork and guide respect reduced-motion preferences.

## Verification

- Guide unit tests: 47 passed, including fixed corner, portrait, landscape, small viewport and safe-area cases.
- Lint and production build passed; all 16 static routes generated.
- Browser: Data scroll animation resolved to `guide-scroll-data`; button bounds were identical before, during and after scrolling.
- Browser at 650 x 652: actor bounds left 566, top 532, width 68, height 96; right margin 16 and bottom margin 24; no horizontal overflow.
- Browser at 390 x 844: actor bounds left 306, top 724, width 68, height 96; right margin 16 and bottom margin 24; no horizontal overflow.
- Browser at 956 x 440 after orientation change: actor bounds left 812, top 296, width 80, height 120; right margin 64 and bottom margin 24; no horizontal overflow.
- Artwork Pause stopped animation; Play restored motion. Illustration loaded at its full 1402px natural width.
- Reduced-motion emulation: guide animation `none`, artwork paused and motion button disabled.
- Responsive emulation occasionally returned delayed command responses; the dimensions and bounds above were checked from the rendered DOM after those changes completed.

Browser checks used Chromium emulation, not a physical iPhone or native Safari. Existing guide response and analytics release checks remain enforced by CI. Local screenshots are in the ignored `artifacts/highlight-corner-2026-11-01/` directory.
