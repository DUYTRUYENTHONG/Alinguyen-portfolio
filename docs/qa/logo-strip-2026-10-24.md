# Logo-only continuous strip — 2026-10-24

Replaces the stepped card carousel with a constant-speed CSS logo loop. The heading and relationship qualification remain unchanged. Fourteen original logo assets appear in source order with five original destinations. The Pacific/Bến Cát entry has no logo asset; it is omitted from this visual strip, with its source data retained.

The repeated group is decorative, aria-hidden and inert; screen readers and keyboard navigation get one list. Matching group widths create a seamless half-track translation. No cards, borders, contact shadows, scrollbar or toolbar remain. Hover and keyboard focus pause; touch hold pauses and release resumes. Reduced motion disables animation and exposes a native scrollable single group. Offscreen/background animation pauses. Keyboard focus scrolling is folded into the animation phase on blur so it cannot leave an empty tail.

Verification:

- Type check, lint (45 files), production build (14 static pages): passed.
- 1280, 768, 390 and 320px browser checks: 14 primary logos, zero controls and no page overflow.
- Both groups measured 3444px on desktop; track measured 6888px.
- Timed Chromium sample: 85 frames, 85 distinct transform positions, 44.645px travel over approximately 1.4 seconds.
- Hover and keyboard focus paused the animation. All five primary brand links remain reachable; focus scrolling reset from 1730px to zero without dropping the loop phase.
- Synthetic touch PointerEvent: paused while touching=true, running after touching=false. Physical Safari touch is not claimed.
- Reduced motion: animation none, duplicate display none, overflow-x auto.

Candidate screenshots and geometry are in the ignored artifacts/logo-strip-candidate directory. GitHub's existing full release gate reruns the 27 guide/API tests and production guide smoke check before deployment.
