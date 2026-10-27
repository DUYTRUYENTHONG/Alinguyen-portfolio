# Viewport tour guide

## Release status

The portfolio's existing avatar and speech bubble remain the production default.
The new Three.js engine is opt-in. **The actual `tour_guide.glb` was not present in
the workspace or attachments on 2026-10-27.** A synthetic local mesh was used to
exercise the loader, projection, controls and cleanup. It is not the character
and is not shipped. Photorealism, rig deformation, foot contact and real-device
Safari performance still require the real asset.

## Install the real character

1. Copy the licensed, optimized binary model to `public/assets/tour_guide.glb`.
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
   NEXT_PUBLIC_TOUR_GUIDE_MODEL_URL=/Alinguyen-portfolio/assets/tour_guide.glb
   ```

   Restart the dev server. This public setting is an asset path, not a secret.
6. Test the real asset before adding the same setting to the Pages build
   environment. Without the setting, no WebGL renderer is instantiated. On load,
   validation, or WebGL failure, the current accessible avatar remains available.

The model keeps its own scale at 1. A parent presentation group maps its physical
height to 120 CSS pixels. `walkStride` and `sprintStride` are meters per animation
cycle; tune them against the real rig to reduce foot sliding. Defaults are 0.7
and 1.6 meters, not measured properties of the missing asset.

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
