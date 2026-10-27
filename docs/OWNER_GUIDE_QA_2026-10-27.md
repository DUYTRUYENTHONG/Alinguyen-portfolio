# Owner greeting and visitor-guide release — 2026-10-27

## Scope and result

The live greeting uses the owner's actual portrait in reserved hero space, with
one arrival animation and an explicit link to the role picker. It does not open
chat or navigate automatically. Choosing a role removes that greeting and mounts
the selected visitor actor. The actor stays on the right and retains its position
while the space is clear. It can move vertically to avoid content.

Removed the optional-perspective paragraph, inline guide panel and bubble action
row. Restored white bubbles with an attached tail and contextual text. Existing
chat remains accessible through the actor button. Reduced motion disables the
portrait arrival animation.

## Checks completed

- `npm run lint`, `npm run typecheck`, `npm run build`: passed.
- `npm run test:guide`: 33 tests passed, including real-asset validation.
- IAB Chromium, CSS viewports: 320×568, 390×720, 440×720, 693×604,
  768×720, 956×440, 1280×720. After layout settled: no document horizontal
  overflow, no role-image/label intersections, complete guide button in view.
- Fresh mobile visit: portrait welcome visible below the navigation; no
  premature visitor actor, no removed helper blocks, no automatic scroll.
- Keyboard role selection: Growth replaces the owner greeting with Rio;
  selected role remains available on reload within the tab.
- Chat opened/closed by keyboard. Input and close remained visible at
  390×480, 440×440 and 956×240; Send was also measured within the final
  956×240 viewport. These are constrained-height simulations, not iOS keyboard tests.
- Mobile `/work/` and `/about/`: no document overflow at 390 px.
- GLB: zero Khronos validator errors/warnings; 20 joints, seven clips, 10-second
  idle, functioning mouth anchor, skin and pointing transforms, stationary
  locomotion root. 1,641,992 bytes; no external textures or resources.
- Model preview loaded in the browser with no reported warnings/errors;
  pointing and rotation were visually inspected. Model drawing is capped at
  30 fps, not a measured device-performance claim.

## Draft boundary

The 3D model is a procedural stylized approximation of the owner's portrait.
Its joint surfaces, likeness and foot contact are not production art quality.
It is downloadable at `/assets/tour_guide.glb` and inspectable at
`/guide-preview/`, which is marked noindex. The homepage's `NEXT_PUBLIC_OWNER_3D`
flag remains unset. No claim of photorealism, artist-quality skinning or actual
iPhone Safari testing is made. The production identity remains the real portrait.

## Evidence

Local screenshots are in ignored `artifacts/owner-guide-qa/`: mobile welcome,
model draft and live release verification. They are not synthetic mockups.
GitHub Pages must complete successfully for the pushed commit before the release
is reported as deployed. Real iPhone Safari portrait/landscape and keyboard
checks remain a device-level follow-up.
