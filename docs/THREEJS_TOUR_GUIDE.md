# Viewport tour guide

## Release status

The production greeting uses Ali's actual portrait. A new **stylized draft** at
`public/assets/tour_guide.glb` is an original procedural adaptation of that
portrait, not a scan or photoreal reconstruction. It has 20 humanoid joints,
weighted geometry, `Head_Mouth_Node`, seven clips and embedded PBR materials.
The uncompressed file is 1,641,992 bytes. No image is uploaded to a third party.

Review the model at `/guide-preview/` (excluded from indexing). Use the clip
selector, rotation and pause controls. `node scripts/build-tour-guide.mjs`
rebuilds it; `npm run test:guide` validates the actual binary using Khronos's
validator and exercises its skeleton, hand movement and in-place root.
The idle lasts 10 seconds with deterministic baked blink timing. Mesh parts
have rigid joint weights; this is a stylized articulated draft, not polished
continuous skin deformation. Likeness, cloth joints and stride need artist
review before a production 3D appearance. Real Safari performance is unmeasured.

`OwnerAvatar` integrates it into the hero with `NEXT_PUBLIC_OWNER_3D=true` in a
local build. The flag is intentionally absent from the production workflow.
It caps rendering at 30 fps and DPR 1.5, skips hidden/offscreen rendering, respects
reduced motion and pause, and cleans up GPU objects on unmount. The portrait is
the loading/error fallback. After choosing a role, the owner's greeting unmounts
and that role's existing actor opens the same evidence-based chat on demand.

## Install the real character

1. Replace the draft with an approved, optimized binary at `public/assets/tour_guide.glb`.
2. Include the exact node `Head_Mouth_Node` and these exact clip names:
   `idle_loop`, `walk_forward`, `sprint_forward`, `gesture_point_left`,
   `gesture_point_right`. `pose_proud` and `pose_bored` are optional.
3. Author locomotion **in place**, with root translation disabled. Export at
   meter scale, Y up, facing +Z. Head look uses `Head`, `mixamorigHead`, or the
   locator's bone parent. Materials and baked texture quality come from the GLB;
   JavaScript cannot manufacture photorealistic skin or correct a broken rig.
4. Keep textures embedded. This loader does not configure external Draco, KTX2
   or Meshopt decoders; use an ordinary GLB or explicitly configure the matching
   local decoder before enabling compressed assets.
5. In a **local preview** set:

   ```text
   NEXT_PUBLIC_OWNER_3D=true
   ```

   Restart the dev server. This public setting is an asset path, not a secret.
6. Test before adding the same setting to the Pages build environment. The
   standalone `/guide-preview/` always loads the model; the homepage does not
   load WebGL without the flag. The viewport engine below is a separate opt-in
   module and is not mounted for visitor-role actors.

The model keeps its own scale at 1. A parent presentation group maps its physical
height to 120 CSS pixels. `walkStride` and `sprintStride` are meters per animation
cycle; tune them against the real rig to reduce foot sliding. Defaults are 0.7
and 1.6 meters, not measured properties of the draft asset.

## JavaScript module

`src/lib/tour-guide.js` is an ES module for a bundler that resolves `three`.
It imports `GLTFLoader` from the official Three.js addon path. Its declaration
file supports the existing TypeScript application.

```js
import { createTourGuide } from './src/lib/tour-guide.js';

const guide = await createTourGuide({
  modelUrl: './assets/tour_guide.glb',
  name: 'Ari',
  onAsk: (trigger) => openYourChat(trigger),
  onError: () => restoreYourAvatar(),
});

guide.open({
  title: 'Explore the work',
  text: 'Choose a project to inspect its source and evidence.',
  actions: [{
    label: 'Guide me',
    onClick: (actor) => actor.moveActorToDOMElement('#project-heading', 'gesture_point_right'),
  }],
});

// Lifecycle: call before opening an overlay, resume after closing it.
guide.setSuspended(true);
guide.setSuspended(false);
// On navigation/unmount:
guide.destroy();
```

Text is assigned through `textContent`; actions use trusted callbacks. Do not
inject arbitrary HTML, inline `onclick` strings, or model-generated JavaScript.
The controller is returned to its owner rather than overwriting window globals.
`walkToElement` aliases `moveActorToDOMElement`.

### Standard web component

```js
import { registerTourGuide } from './src/lib/tour-guide.js';
registerTourGuide();
```

```html
<portfolio-tour-guide name="Ari" model-url="./assets/tour_guide.glb"></portfolio-tour-guide>
```

Listen for `guide-ready` (`event.detail` is the controller), `guide-ask`, and
`guide-error`. The custom element cancels loading and disposes GPU resources on
disconnect. Register only one viewport guide at a time.

## How the behavior works

- A transparent, fixed canvas uses `pointer-events: none`. Only a small native
  actor button and the independent HTML bubble receive pointer input.
- A perspective camera maps pixels through NDC onto Z=0. The canvas and camera
  update on resize and visual viewport changes.
- A hemisphere fill and directional key light illuminate the model's PBR
  materials. A transparent shadow plane and filtered shadow map anchor its feet.
- The mixer crossfades clips. Head look is a bounded additive quaternion offset,
  removed before each new animation sample to avoid accumulating rotation.
- Navigation tests several quadratic Bezier paths against expanded DOM obstacle
  rectangles using the character's complete footprint. Arc-length sampling gives
  steady screen speed. It returns `false` if the target is offscreen or no clear
  path exists. It does not move page scroll by itself or walk through content.
- Every rendered frame projects the mouth locator. The bubble follows with a
  frame-rate independent lag bounded to 12px, flips below near the top, and clamps
  its tail within the bubble. It hides if no readable local position fits.
- Hover, touch and keyboard focus hold the bubble and movement still. Explicit
  movement actions release that hold; focus moves to the actor. Escape closes the
  bubble. The page underneath remains clickable and scrollable.
- Device pixel ratio is capped at 1.5; rendering is capped at 60fps and stops in
  hidden tabs and while suspended. Reduced motion uses static, demand rendering.
- Loading has a 20-second timeout. Disposal removes listeners, observers, canvas,
  HTML controls, materials, textures, geometry, skeleton resources and mixer state.

This is bounded screen-space routing, not a full navigation mesh, IK solver or
physical collision simulation. Step-up, crouch, seated-video and scroll-toss
actions need corresponding authored animation clips and props; they are not
claimed by this implementation.

## QA before enabling the real model

1. Run `npm run test:guide`, `npm run lint`, `npm run typecheck`, `npm run build`.
2. On desktop, navigate using each bubble action and keyboard only; confirm focus
   remains visible and the full-page canvas never intercepts ordinary links.
3. Check portrait and landscape mobile layouts, including an open chat keyboard.
   The WebGL layer must be suspended while the chat dialog is open.
4. Move close to all four edges and resize during travel. Check mouth attachment,
   no clipped controls, stable hover/touch targets, and no crossing of content.
5. Test reduced motion, background tab, malformed/missing model, context loss and
   repeated mount/unmount. Confirm fallback chat is still usable.
6. Inspect walking/running stride against actual ground contact and verify every
   gesture. Profile on real iPhone Safari; desktop emulation is not that test.

Official references: [GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html),
[AnimationAction](https://threejs.org/docs/pages/AnimationAction.html),
[WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html).
