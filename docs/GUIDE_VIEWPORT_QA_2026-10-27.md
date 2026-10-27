# Guide viewport release review — 2026-10-27

## Intent and scope

Fix oversized role artwork and detached guide tips; add independently actionable
bubbles and an opt-in rigged Three.js engine without removing the working avatar.

## Root causes and corrections

- The role-icon grid allowed an image's intrinsic minimum dimensions to exceed
  its allotted height. Explicit flex containment and maximum image dimensions
  keep artwork above the label.
- Tablet overrides assigned a short first row intended for a selected card even
  on fresh visits. Consistent automatic rows now accommodate all eleven roles.
- The callout solver searched distant viewport pockets. It now tries only the
  four adjacent sides, with local vertical adjustment beside the actor. The
  shared fixed anchor carries both the avatar and bubble together.
- Bubble actions are sibling controls rather than nested inside the actor
  button. All action targets are at least 44px tall. Hidden tips are inert.
- A negative margin on the work selector caused overflow at the tablet boundary;
  the selector now remains inside its section width.

## Observed checks

| Check | Result |
| --- | --- |
| Fresh visit, 320/390/440/693/767/768/1280 CSS px | All 11 role labels fit; no image-label intersections; no page horizontal overflow |
| Growth selected, 390/693/768/1280 CSS px | Selected summary and remaining role labels fit; no page overflow |
| Attached desktop bubble | Adjacent to actor with a 12px gap; tail points back; controls stay within the viewport |
| Bubble Ask action | Opens the existing chat dialog; Close restores the launcher/action focus |
| Hide tips | Hides and disables bubble controls; actor remains available |
| Chat 440×956 and 956×440 | Input, Send and Close visible after layout settles |
| Keyboard-height simulations 440×440 and 956×220 | Input, Send and Close remain inside the viewport |
| Three.js synthetic local GLB | Loader, clip validation, mouth projection, button callback and navigation exercised |
| Synthetic navigation | Native actor bounds moved from approximately x=1025/y=332 to x=606/y=520 beside the target |
| Engine destroy | Canvas, bubble and hit-target elements removed |
| Missing model integration | Loader failure leaves avatar available; avatar still opens chat |
| Regression suite | 31 tests passed, including nearby placement, NDC, missing rig metadata, thin obstacles and edge flipping |
| Lint / TypeScript / static build | Passed; temporary QA route and synthetic GLB removed before build |

Browser checks used the Codex in-app browser and viewport emulation. No physical
iPhone or Safari run is claimed. Local screenshots and geometry are saved in
`artifacts/guide-viewport-qa/` (ignored by Git).

## Consolidated code review

No release-blocking issue remains in the default avatar path. The release keeps
native links and controls, avoids HTML injection in dynamic bubble content,
adds no network tracking, and changes no API or warehouse credentials.

During engine QA, an explicit navigation action was initially blocked by the
hover/focus pause; it now releases that hold and transfers focus to the actor.
The installed Three.js renderer also flagged the obsolete soft-shadow constant;
the engine now uses its supported PCF shadow filter.

The optional engine uses lazy loading, an abortable model request, a rendering
cap, reduced-motion behavior, hidden-tab suspension and explicit resource
cleanup. It validates the five required animation names and mouth locator before
replacing the fallback.

## Remaining asset gate

`tour_guide.glb` was not found in the workspace or attachments. Full skeletal
appearance, animation/stride quality, skin materials, and real-device GPU
performance are **unverified**. The synthetic mesh is only a technical test
fixture and is not deployed. Production does not set
`NEXT_PUBLIC_TOUR_GUIDE_MODEL_URL` for this release.

Follow [the setup guide](THREEJS_TOUR_GUIDE.md) to install and verify the real
character. Do not describe the current production avatar image as a skeletal 3D
model or claim measured photorealism.
