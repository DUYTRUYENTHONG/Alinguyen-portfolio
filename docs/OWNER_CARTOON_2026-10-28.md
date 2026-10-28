# Owner cartoon welcome — 2026-10-28

The owner requested a cartoon of himself replacing the welcome photo, with a
jump-out entrance on a fresh visit. The existing role-selection handoff stays
in place. The welcome remains in document flow without opening a popup or
scrolling the page automatically.

## Asset

- Tool: built-in imagegen, reference-image edit/generation, transparent background.
- Identity reference: `public/ali-nguyen-portrait-480.webp`.
- Style-only reference: `public/guide-art/engineer.webp`.
- Output: `public/guide-art/ali-owner.webp`, 480 × 720, alpha, 37,890 bytes.
- Conversion: Sharp resize/encoding; no external asset marketplace or rig.
- This is a 3D-style raster character with CSS motion, not a skeletal GLB.

Generation prompt:

> Create ONE polished full-body cartoon website guide character of Ali Nguyen, using image 1 as the identity and clothing reference. Image 2 is STYLE ONLY: match its professional charming rounded 3D animated-film character rendering, tactile materials and compact proportions. Preserve Ali's recognizable swept-back short black hair, brow and face structure, clean-shaven face. Black tailored blazer over black open-collar shirt, black tailored trousers and clean black shoes. Warm natural skin, friendly confident slight smile. Adult male, tasteful slightly enlarged head, not a child. Standing in a relaxed welcoming pose, one hand raised in a small open-palm hello, other resting naturally. Both feet clearly visible, hands anatomically coherent, no laptop, headphones, beard, text, logos or accessories. Front three-quarter view turned very slightly toward viewer's right, gaze toward viewer. Soft studio highlights separate dark suit layers. True transparent alpha background, no background scene, no backdrop rectangle, no ground platform. Full body centered, entire hair, hand and shoes inside frame with 7 percent padding; tall composition. This is a premium small UI character sprite to animate with CSS. Produce a high-quality finished character, not a prototype or faceted mesh.

## Behavior and browser QA

- Entrance begins only after the image loads, including the cache-load path.
- The entrance is a 0.9-second eased arrival from nearby left, with subdued blue
  foot thrusters, landing ring and shadow. The bubble begins after 0.12 seconds.
- `portfolio-owner-arrival-v1` in session storage prevents replay on refresh.
- Fresh tab: observed `first-visit` lifecycle reaching `complete` through animationend.
- Same-tab refresh: observed `returning`; entrance does not replay.
- Reduced-motion browser emulation: observed `reduced-motion`, animation `none`.
- Selecting Engineer by keyboard: welcome removed, Kai role guide displayed.
- Browser widths 320, 390, 768, 985, 1280 and landscape 956 × 440: no horizontal
  document overflow; avatar and greeting stayed inside viewport boundaries.
- Browser console: no errors in the tested greeting/role-handoff flow.
- Local screenshot and dimensions recorded under ignored `artifacts/owner-cartoon-qa/`.
- These are desktop Chromium viewport checks, not physical iPhone Safari tests.

Release checks: Biome lint, all 33 guide tests, and the production static build with TypeScript passed.

## Powered entrance refinement

This records the first flight treatment; the smoothing correction below supersedes
its timing, spacing and loading behavior.

The requested powered-flight styling uses CSS transforms and opacity on the
existing cartoon image. The short-lived light effects are decorative and ignore
pointer events. No new image, WebGL scene, timer loop or dependency was added.
The bubble settles before the actor animation ends; focusing its link immediately
removes the bubble movement. Reduced motion removes both animations and glow.

Chromium browser checks at 320, 390, 430, 503, 768, 1280 and 1440px widths, plus
956 × 440 landscape: actor, bubble and 44px role link fit without horizontal
overflow. Captured live animation frames show changing flight transforms, thrust
opacity and bubble opacity, followed by phase `complete`, transform `none` and
thrust opacity zero. Repeated refresh does not replay the entrance. Reduced-motion
emulation shows both animation names `none`. Keyboard role selection still hands
off to Kai. No console errors in that flow. Screenshots and frame measurements
are in ignored `artifacts/owner-cartoon-qa/flight-*` files. Physical Safari and
native browser 200% zoom were not tested in this pass.

## Smooth welcome correction

Observed roughness: the greeting was added after hydration, shifting the headline;
the fully visible bubble then faded backward before its entrance; the long flight
used multiple bounce segments. Fresh #visitor entries also briefly landed below
the hero before the client corrected their location.

The home document now reserves the greeting's final space before hydration. A
small initial script normalizes a fresh fragment before its target is parsed,
without consuming the session marker or changing Back/Forward behavior. The
image and bubble reveal together after image load. Image failure releases the
bubble. A single eased 0.9-second arrival replaces the long bounce sequence.
Copy, mobile spacing and avatar size are tighter, with a visible 44px role CTA.

Browser sequence evidence: all eight captured frames were at #top / scrollY 0;
the headline stayed at 278.5208 CSS px before hydration, during motion and after
completion. Bubble opacity progressed from hidden to fully visible. Viewports
320, 390, 430, 591, 768, 1280, 1440 and 956 × 440 showed no horizontal overflow,
and the role link remained inside the bubble with a 44px minimum height. Reload
returned phase `returning`. Keyboard selection handed off to Kai. Reduced-motion
mode showed both animations `none`, with full bubble opacity. No console errors
in the tested flow. Evidence: ignored `artifacts/owner-cartoon-qa/smooth-*` files.
All 35 guide regression tests and lint passed. Physical Safari and native 200%
browser zoom remain unmeasured.

## Fresh-entry correction

An incoming fragment such as #visitor now resets to #top on the first homepage visit in a tab session. The query string is preserved. Later section clicks and browser Back/Forward keep native navigation. Browser QA reproduced entry through #visitor: scrollY was 0, the actor and greeting were visible, and the entrance reached complete. The role link then navigated to #visitor and Engineer selection handed off to Kai. All 34 guide tests and lint passed.
