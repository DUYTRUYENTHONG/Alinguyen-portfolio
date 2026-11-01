# Role guide handoff and section introductions

Owner scope: restore section tips, remove duplicate/abrupt role-guide appearances,
give each role its own entrance, and update the owner-stated AI experience to
3+ years. Preserve the surrounding portfolio and the separate HTML preview.

## Repairs

- A role introduction no longer masks later section descriptions. Dismissing a
  tip applies to its current section; entering another section enables its tip.
- While the selected role-card portrait is visible below the header, the floating
  copy is hidden and the introduction is anchored beside the card portrait.
  Once it leaves view, one floating guide takes over with a fade.
- Each role has a distinct, finite entrance. The selected card does not repeat
  its greeting indefinitely, and the handoff does not play another entrance.
- A newly selected guide image must finish loading before it is shown. Keyboard
  dismissal returns focus to the visible guide or the selected radio input.
- The central experience string and the AI overview evidence/summary now say
  “3+ years in AI engineering and product building,” as stated by the owner.
  Historical audit documents and previously exported CV files were not rewritten.

## Verification

- 48 frontend guide tests and 39 API tests passed. Lint and production build passed.
- Desktop Data selection: one floating guide element, hidden while the card
  portrait is visible; attached “Meet Ada” introduction. Dismissal returned focus
  to the Data radio input. Entering Highlights and KKBox then showed the correct
  section/project description rather than repeating the role introduction.
- All 11 roles resolved to different entrance keyframes. Data, Investor, Student,
  Fellow builder and Just curious interaction checks recorded matching intros,
  one animation iteration, and no visible floating duplicate beside the card.
- Chromium device metrics verified actual CSS layouts at 320 × 568, 390 × 844,
  and 956 × 440. No horizontal overflow; one floating guide element. At 320 px,
  the visible CV tip fit from x=84 to x=308 within the viewport after an earlier
  tip had been dismissed. Mobile navigation was also keyboard tested.
- Reduced-motion emulation disabled both selected-card and floating-guide
  animation. Native iPhone/Safari and physical touch behavior remain untested.
- Ignored artifacts: `artifacts/actor-handoff-2026-11-01/`.
