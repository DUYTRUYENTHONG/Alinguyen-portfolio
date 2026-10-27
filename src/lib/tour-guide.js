import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { actorBox, boxesOverlap, bubblePosition, clearCurve, screenToNDC, validateGuideAsset } from "./tour-guide-geometry.js";

const clamp = THREE.MathUtils.clamp;
const obstacleSelector = "main h1, main h2, main h3, main p, main article, main img, main a, main button, main input, main summary, .role-card, .site-header, [data-guide-obstacle]";
const styles = `
.tour-guide-canvas{position:fixed;inset:0;width:100%;height:100%;z-index:9999;pointer-events:none}
.tour-guide-hit{position:fixed;left:0;top:0;z-index:10000;border:0;border-radius:16px;background:transparent;pointer-events:auto;cursor:pointer;touch-action:manipulation}
.tour-guide-hit span{position:absolute;bottom:0;left:50%;transform:translateX(-50%);white-space:nowrap;border:1px solid #d4deef;border-radius:20px;padding:5px 9px;background:white;color:#254c9d;font:600 12px/1.4 sans-serif}
.tour-guide-hit:focus-visible{outline:3px solid #326bff;outline-offset:3px}
.actor-bubble{position:fixed;left:0;top:0;z-index:10001;box-sizing:border-box;width:248px;max-width:calc(100vw - 24px);padding:14px;border:1px solid #65738b;border-radius:14px;background:rgba(15,23,38,.94);backdrop-filter:blur(16px);color:#fff;pointer-events:auto;box-shadow:0 8px 24px #0002;font:14px/1.5 system-ui,sans-serif}
.actor-bubble[hidden],.tour-guide-hit[hidden]{display:none}
.actor-bubble::after{content:'';position:absolute;left:var(--tail-x,50%);bottom:-6px;width:10px;height:10px;transform:rotate(45deg);background:#172036;border-right:1px solid #65738b;border-bottom:1px solid #65738b;pointer-events:none}
.actor-bubble[data-below=true]::after{bottom:auto;top:-6px;transform:rotate(225deg)}
.actor-bubble small{font:600 10px/1.5 monospace;letter-spacing:.08em;text-transform:uppercase;color:#c2d3f0}
.actor-bubble p{margin:8px 0 12px}.tour-bubble-actions{display:flex;gap:8px;flex-wrap:wrap}
.tour-bubble-actions button{flex:1;min-height:44px;border:1px solid #91a4c266;border-radius:8px;padding:8px;background:#ffffff14;color:#fff;font:600 12px/1.4 system-ui;cursor:pointer}
.tour-bubble-actions button:hover{background:#315fc6}.tour-bubble-actions button:focus-visible{outline:2px solid white;outline-offset:2px}.tour-bubble-actions button:active{transform:scale(.97)}
`;

function disposeObject(root) {
  const textures = new Set();
  const materials = new Set();
  root.traverse((object) => {
    object.geometry?.dispose();
    object.skeleton?.dispose();
    for (const material of [object.material].flat().filter(Boolean)) {
      materials.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    }
  });
  for (const texture of textures) { texture.source?.data?.close?.(); texture.dispose(); }
  for (const material of materials) material.dispose();
}

/**
 * Browser-only, disposable guide engine. Pass trusted callbacks, not HTML strings.
 * @param {{modelUrl?:string, name?:string, height?:number, pixelRatio?:number,
 * walkStride?:number, sprintStride?:number, onAsk?:(trigger:HTMLButtonElement)=>void,
 * onError?:(error:Error)=>void, signal?:AbortSignal}} options
 */
export async function createTourGuide(options = {}) {
  if (document.getElementById("tour-guide-canvas")) throw new Error("A tour guide is already mounted");
  const events = new AbortController();
  const signal = events.signal;
  let disposed = false;
  let frame = 0;
  let renderer;
  let model;
  let mixer;
  let observer;
  const scene = new THREE.Scene();
  const style = document.createElement("style");
  style.textContent = styles;
  const bubble = document.createElement("aside");
  bubble.className = "actor-bubble tour-bubble";
  bubble.setAttribute("aria-label", `${options.name ?? "Ali's guide"} suggestions`);
  bubble.hidden = true;
  const hit = document.createElement("button");
  hit.type = "button";
  hit.className = "tour-guide-hit";
  hit.setAttribute("aria-label", `Ask ${options.name ?? "Ali's guide"}`);
  hit.setAttribute("aria-haspopup", "dialog");
  hit.hidden = true;
  const label = document.createElement("span");
  label.textContent = `Ask ${options.name ?? "Ali's guide"}`;
  hit.append(label);

  function destroy() {
    if (disposed) return;
    disposed = true;
    events.abort();
    options.signal?.removeEventListener("abort", destroy);
    cancelAnimationFrame(frame);
    observer?.disconnect();
    mixer?.stopAllAction();
    if (model) mixer?.uncacheRoot(model);
    disposeObject(scene);
    renderer?.dispose();
    renderer?.domElement.remove();
    bubble.remove(); hit.remove(); style.remove();
  }
  if (options.signal?.aborted) throw new DOMException("Guide cancelled", "AbortError");
  options.signal?.addEventListener("abort", destroy, { once: true });

  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, options.pixelRatio ?? 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.id = "tour-guide-canvas";
    renderer.domElement.className = "tour-guide-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    document.head.append(style);
    document.body.append(renderer.domElement, bubble, hit);
    renderer.domElement.addEventListener("webglcontextlost", (event) => {
      event.preventDefault(); destroy(); options.onError?.(new Error("WebGL context lost; use the accessible avatar fallback"));
    }, { signal });

    // Fetch with cancellation and a timeout; no renderer survives a failed load.
    const response = await fetch(options.modelUrl ?? "./assets/tour_guide.glb", { signal: AbortSignal.any([signal, AbortSignal.timeout(20000)]) });
    if (!response.ok) throw new Error(`Tour guide model request failed (${response.status})`);
    const bytes = await response.arrayBuffer();
    const loader = new GLTFLoader();
    const gltf = await loader.parseAsync(bytes, new URL(".", response.url || new URL(options.modelUrl ?? "./assets/tour_guide.glb", location.href)).href);
    if (disposed) { disposeObject(gltf.scene); throw new DOMException("Guide cancelled", "AbortError"); }
    model = gltf.scene;
    scene.add(model); // Include it in cleanup even if validation fails.
    const mouth = validateGuideAsset(gltf);
    const head = model.getObjectByName("Head") ?? model.getObjectByName("mixamorigHead") ?? (mouth.parent?.isBone ? mouth.parent : null);
    const lookOffset = new THREE.Quaternion();
    const inverseLook = new THREE.Quaternion();
    const desiredLook = new THREE.Quaternion();
    const lookEuler = new THREE.Euler();
    const cursor = new THREE.Vector2();
    const rig = new THREE.Group();
    scene.add(rig);
    rig.add(model);
    model.scale.setScalar(1);
    const bounds = new THREE.Box3().setFromObject(model);
    const modelHeight = bounds.max.y - bounds.min.y;
    if (!Number.isFinite(modelHeight) || modelHeight <= 0) throw new Error("Tour guide model has no visible geometry");
    const bodyHeight = clamp(options.height ?? 120, 64, 180);
    const bodyWidth = Math.max(44, (bounds.max.x - bounds.min.x) / modelHeight * bodyHeight);
    rig.scale.setScalar(bodyHeight / modelHeight);
    model.position.sub(new THREE.Vector3((bounds.min.x + bounds.max.x) / 2, bounds.min.y, (bounds.min.z + bounds.max.z) / 2));
    model.traverse((object) => { if (object.isMesh) { object.castShadow = true; object.receiveShadow = true; } });
    mixer = new THREE.AnimationMixer(model);
    const actions = new Map(gltf.animations.map((clip) => [clip.name, mixer.clipAction(clip)]));
    let active;
    function play(name, speed = 1) {
      const next = actions.get(name) ?? actions.get("idle_loop");
      next.setEffectiveTimeScale(speed);
      if (next === active) return;
      next.reset().setEffectiveWeight(1);
      const loop = name.endsWith("loop") || name.endsWith("forward");
      next.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loop ? Infinity : 1);
      next.clampWhenFinished = !loop;
      next.play();
      if (active) next.crossFadeFrom(active, .22, false);
      active = next;
    }
    mixer.addEventListener("finished", () => play("idle_loop"));
    play("idle_loop");
    const camera = new THREE.PerspectiveCamera(35, 1, .1, 10000);
    const ambient = new THREE.HemisphereLight(0xeaf3ff, 0xb3a59b, 2.2);
    const key = new THREE.DirectionalLight(0xfff3e5, 3);
    key.castShadow = true;
    key.shadow.mapSize.set(512, 512);
    key.shadow.camera.left = key.shadow.camera.bottom = -200;
    key.shadow.camera.right = key.shadow.camera.top = 200;
    key.shadow.camera.near = 1; key.shadow.camera.far = 1600;
    key.shadow.normalBias = .3;
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(bodyWidth * 2, 70), new THREE.ShadowMaterial({ opacity: .16, depthWrite: false }));
    ground.rotation.x = -Math.PI / 3;
    ground.receiveShadow = true;
    scene.add(ambient, key, key.target, ground);

    let viewport = { width: innerWidth, height: innerHeight };
    const position = new THREE.Vector2(viewport.width - bodyWidth / 2 - 24, Math.min(viewport.height - 24, viewport.height * .64));
    let travel = null;
    let obstacles = [];
    let bubbleSize = { width: 248, height: 160 };
    let bubblePoint = null;
    let engaged = false;
    let hovering = false;
    let suspended = false;
    let messageOpen = false;
    let lastTime = 0;
    let renderWidth = 0;
    let renderHeight = 0;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const headWorld = new THREE.Vector3();
    const ray = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const worldPoint = new THREE.Vector3();
    const size = { width: bodyWidth + 16, height: bodyHeight + 24 };

    function screenToWorld(point) {
      const ndc = screenToNDC(point.x, point.y, viewport.width, viewport.height);
      ray.setFromCamera(ndc, camera);
      return ray.ray.intersectPlane(plane, worldPoint);
    }
    function measure(allowParking = true) {
      viewport = { width: document.documentElement.clientWidth, height: window.visualViewport?.height ?? innerHeight };
      camera.aspect = viewport.width / viewport.height;
      camera.position.set(0, 0, viewport.height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))));
      camera.updateProjectionMatrix(); camera.updateMatrixWorld();
      if (renderWidth !== viewport.width || renderHeight !== viewport.height) {
        renderer.setSize(viewport.width, viewport.height);
        renderWidth = viewport.width; renderHeight = viewport.height;
      }
      position.x = clamp(position.x, size.width / 2 + 12, Math.max(size.width / 2 + 12, viewport.width - size.width / 2 - 12));
      position.y = clamp(position.y, size.height + 96, Math.max(size.height + 96, viewport.height - 12));
      obstacles = Array.from(document.querySelectorAll(obstacleSelector)).filter((element) => !element.closest(".guide-stage")).map((element) => element.getBoundingClientRect()).filter((rect) => rect.width && rect.height && rect.bottom > 0 && rect.top < viewport.height);
      const overlapArea = (point) => {
        const box = actorBox(point, size.width, size.height);
        return obstacles.reduce((sum, rect) => sum + Math.max(0, Math.min(box.left + box.width, rect.left + rect.width) - Math.max(box.left, rect.left)) * Math.max(0, Math.min(box.top + box.height, rect.top + rect.height) - Math.max(box.top, rect.top)), 0);
      };
      if (allowParking !== false && overlapArea(position) > 0) {
        let best = position.clone(); let score = overlapArea(best);
        for (const x of [viewport.width - size.width / 2 - 16, size.width / 2 + 16]) {
          for (let y = 96 + size.height; y <= viewport.height - 12; y += 24) {
            const point = new THREE.Vector2(x, y); const area = overlapArea(point);
            if (area < score) { best = point; score = area; }
          }
        }
        position.copy(best);
      }
      travel = null; play("idle_loop");
      bubblePoint = null;
      requestFrame();
    }

    function getDOMCoords(selector) {
      const element = document.querySelector(selector);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      return { element, rect, center, ndc: screenToNDC(center.x, center.y, viewport.width, viewport.height) };
    }

    function moveActorToDOMElement(selector, gesture = "idle_loop") {
      if (disposed || suspended) return false;
      const target = getDOMCoords(selector);
      if (!target || target.rect.bottom < 96 || target.rect.top > viewport.height) return false;
      measure(false);
      const destinations = [new THREE.Vector2(target.rect.left - size.width / 2 - 16, target.rect.top + size.height), new THREE.Vector2(target.rect.right + size.width / 2 + 16, target.rect.top + size.height)];
      for (const end of destinations) {
        for (const bend of [0, -100, 100, -220, 220]) {
          const middle = position.clone().lerp(end, .5).add(new THREE.Vector2(0, bend));
          const curve = new THREE.QuadraticBezierCurve(position.clone(), middle, end);
          if (!clearCurve(curve, size, viewport, obstacles)) continue;
          // An explicit navigation action releases the hover/focus hold. Move
          // focus to the character so its old bubble button cannot drift away.
          if (bubble.contains(document.activeElement)) hit.focus({ preventScroll: true });
          engaged = false;
          if (reduced.matches) { position.copy(end); play(gesture); requestFrame(); return true; }
          const length = curve.getLength();
          const sprint = length > 400;
          const clip = sprint ? "sprint_forward" : "walk_forward";
          const speed = sprint ? 230 : 100;
          const stride = (sprint ? options.sprintStride ?? 1.6 : options.walkStride ?? .7) * rig.scale.x;
          play(clip, clamp(speed * actions.get(clip).getClip().duration / stride, .25, 3));
          travel = { curve, length: Math.max(length, 1), speed, distance: 0, gesture };
          requestFrame(); return true;
        }
      }
      // Never walk through content or teleport when no clear route exists.
      return false;
    }

    function open({ title = "Explore with me", text, actions: buttons = [] }) {
      bubble.replaceChildren();
      const heading = document.createElement("small"); heading.textContent = title;
      const body = document.createElement("p"); body.textContent = text;
      const row = document.createElement("div"); row.className = "tour-bubble-actions";
      for (const action of buttons.slice(0, 4)) {
        const button = document.createElement("button"); button.type = "button"; button.textContent = action.label;
        button.addEventListener("click", () => action.onClick?.(api));
        row.append(button);
      }
      const close = document.createElement("button"); close.type = "button"; close.textContent = "Hide tips";
      close.addEventListener("click", () => { closeBubble(); hit.focus({ preventScroll: true }); });
      row.append(close); bubble.append(heading, body, row);
      messageOpen = true; bubble.hidden = false; bubble.style.visibility = "hidden";
      bubbleSize = { width: bubble.offsetWidth, height: bubble.offsetHeight };
      bubblePoint = null; requestFrame();
    }
    function closeBubble() { messageOpen = false; bubble.hidden = true; engaged = false; }
    function setSuspended(value) {
      suspended = value; hit.hidden = value; bubble.hidden = value || !messageOpen;
      renderer.domElement.hidden = value;
      if (value) { cancelAnimationFrame(frame); frame = 0; }
      else { lastTime = 0; measure(); }
    }
    function requestFrame() { if (!frame && !disposed && !suspended && !document.hidden) frame = requestAnimationFrame(tick); }
    function tick(time) {
      frame = 0;
      if (disposed || suspended || document.hidden) return;
      if (!reduced.matches && lastTime && time - lastTime < 1000 / 60 - 1) { requestFrame(); return; }
      const dt = Math.min((time - (lastTime || time)) / 1000, .05); lastTime = time;
      if (travel && !engaged) {
        travel.distance = Math.min(travel.length, travel.distance + travel.speed * dt);
        const next = travel.curve.getPointAt(travel.distance / travel.length);
        rig.rotation.y = THREE.MathUtils.damp(rig.rotation.y, next.x >= position.x ? Math.PI / 2 : -Math.PI / 2, 10, dt);
        position.copy(next);
        if (travel.distance >= travel.length) { play(travel.gesture); travel = null; }
      } else if (!travel) rig.rotation.y = THREE.MathUtils.damp(rig.rotation.y, 0, 10, dt);
      if (!reduced.matches && !engaged) {
        // Remove last frame's additive look before sampling the next clip.
        // This also works when a clip does not key the head rotation at all.
        if (head) head.quaternion.multiply(inverseLook.copy(lookOffset).invert());
        mixer.update(dt);
      }
      if (head && !reduced.matches && !engaged) {
        // Mixer supplies the animated base; a separate offset avoids drift.
        desiredLook.setFromEuler(lookEuler.set(cursor.y * -.12, cursor.x * .2, 0));
        lookOffset.slerp(desiredLook, 1 - Math.exp(-6 * dt));
        head.quaternion.multiply(lookOffset);
      }
      const world = screenToWorld(position);
      if (world) rig.position.copy(world);
      ground.position.set(rig.position.x, rig.position.y - 4, -15);
      key.position.set(rig.position.x - 180, rig.position.y + 300, 400);
      key.target.position.copy(rig.position);
      scene.updateMatrixWorld(true);
      const box = actorBox(position, size.width, size.height);
      const usable = viewport.height >= size.height + 120 && viewport.width >= size.width + 24;
      hit.hidden = !usable; renderer.domElement.hidden = !usable;
      hit.style.width = `${size.width}px`; hit.style.height = `${size.height}px`;
      hit.style.transform = `translate3d(${box.left}px,${box.top}px,0)`;
      if (messageOpen && usable) {
        mouth.getWorldPosition(headWorld).project(camera);
        const projected = { x: (headWorld.x * .5 + .5) * viewport.width, y: (-headWorld.y * .5 + .5) * viewport.height };
        const target = bubblePosition(projected, bubbleSize, viewport);
        if (target && !engaged) {
          if (!bubblePoint || reduced.matches) bubblePoint = new THREE.Vector2(target.left, target.top);
          // Frame-rate independent lag, bounded to 12px so attachment stays clear.
          bubblePoint.lerp(new THREE.Vector2(target.left, target.top), 1 - Math.exp(-20 * dt));
          bubblePoint.x = clamp(bubblePoint.x, target.left - 12, target.left + 12);
          bubblePoint.y = clamp(bubblePoint.y, target.top - 12, target.top + 12);
          bubblePoint.x = clamp(bubblePoint.x, 12, viewport.width - bubbleSize.width - 12);
          bubblePoint.y = clamp(bubblePoint.y, 96, viewport.height - bubbleSize.height - 12);
          bubble.dataset.below = String(target.below);
          bubble.style.setProperty("--tail-x", `${target.tail}px`);
        }
        const clear = target && bubblePoint && !obstacles.some((obstacle) => boxesOverlap({ ...bubbleSize, left: bubblePoint.x, top: bubblePoint.y }, obstacle));
        bubble.hidden = !clear;
        if (clear) { bubble.style.visibility = "visible"; bubble.style.transform = `translate3d(${bubblePoint.x}px,${bubblePoint.y}px,0)`; }
      } else bubble.hidden = true;
      renderer.render(scene, camera);
      if (!reduced.matches) requestFrame();
    }
    const bind = (target, event, handler, extra = {}) => target.addEventListener(event, handler, { ...extra, signal });
    bind(window, "pointermove", (event) => { if (event.pointerType === "mouse") cursor.set(event.clientX / viewport.width * 2 - 1, 1 - event.clientY / viewport.height * 2); }, { passive: true });
    bind(window, "resize", measure, { passive: true });
    bind(window, "scroll", measure, { passive: true });
    if (window.visualViewport) bind(window.visualViewport, "resize", measure, { passive: true });
    bind(document, "visibilitychange", () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else { lastTime = 0; measure(); } });
    bind(reduced, "change", () => { travel = null; play("idle_loop"); requestFrame(); });
    bind(bubble, "pointerenter", (event) => { hovering = event.pointerType === "mouse"; engaged = true; });
    bind(bubble, "pointerleave", () => { hovering = false; engaged = bubble.contains(document.activeElement); });
    bind(bubble, "pointerdown", () => { engaged = true; });
    bind(window, "pointerup", () => { engaged = hovering || bubble.contains(document.activeElement); });
    bind(window, "pointercancel", () => { hovering = false; engaged = bubble.contains(document.activeElement); });
    bind(bubble, "focusin", () => { engaged = true; });
    bind(bubble, "focusout", () => { engaged = hovering; });
    bind(bubble, "keydown", (event) => { if (event.key === "Escape") { closeBubble(); hit.focus({ preventScroll: true }); } });
    bind(hit, "click", () => options.onAsk?.(hit));
    observer = new ResizeObserver(() => { if (!bubble.hidden) { bubbleSize = { width: bubble.offsetWidth, height: bubble.offsetHeight }; requestFrame(); } });
    observer.observe(bubble);
    const api = { open, close: closeBubble, walkToElement: moveActorToDOMElement, moveActorToDOMElement, getDOMCoords, setSuspended, destroy, playGesture: (name) => { play(name); requestFrame(); } };
    measure();
    return api;
  } catch (error) {
    destroy();
    throw error;
  }
}

/** Optional standards-based custom element; explicitly register once per app. */
export function registerTourGuide(tagName = "portfolio-tour-guide") {
  if (customElements.get(tagName)) return;
  customElements.define(tagName, class extends HTMLElement {
    connectedCallback() {
      this.controller = new AbortController();
      const controller = this.controller;
      createTourGuide({ modelUrl: this.getAttribute("model-url") ?? "./assets/tour_guide.glb", name: this.getAttribute("name") ?? "Ali's guide", signal: controller.signal, onAsk: () => this.dispatchEvent(new CustomEvent("guide-ask", { bubbles: true })), onError: (error) => this.dispatchEvent(new CustomEvent("guide-error", { detail: error, bubbles: true })) }).then((guide) => {
        if (controller.signal.aborted) { guide.destroy(); return; }
        this.guide = guide;
        this.dispatchEvent(new CustomEvent("guide-ready", { detail: guide, bubbles: true }));
      }).catch((error) => { if (!controller.signal.aborted) this.dispatchEvent(new CustomEvent("guide-error", { detail: error, bubbles: true })); });
    }
    disconnectedCallback() { this.controller?.abort(); this.guide?.destroy(); }
  });
}
