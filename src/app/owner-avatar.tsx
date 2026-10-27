"use client";

import { useEffect, useRef, useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const avatarClips = ["idle_loop", "walk_forward", "sprint_forward", "gesture_point_left", "gesture_point_right", "pose_proud", "pose_bored"];

/** Local original GLB, loaded lazily; the owner's portrait covers load/failure. */
export function OwnerAvatar({ clip = "idle_loop", angle = 0, paused = false }: { clip?: string; angle?: number; paused?: boolean }) {
  const mount = useRef<HTMLDivElement>(null);
  const animation = useRef<((name: string) => void) | null>(null);
  const pose = useRef({ angle, paused, clip });
  pose.current = { angle, paused, clip };
  const [ready, setReady] = useState(false);
  useEffect(() => { animation.current?.(clip); }, [clip]);
  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    const abort = new AbortController();
    let cleanup = () => {};
    void Promise.all([import("three"), import("three/addons/loaders/GLTFLoader.js")]).then(async ([T, { GLTFLoader }]) => {
      if (abort.signal.aborted) return;
      const renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.setClearColor(0, 0); renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.domElement.setAttribute("aria-hidden", "true");
      host.append(renderer.domElement);
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(30, 1, .1, 20);
      camera.position.set(0, 1.05, 3.9); camera.lookAt(0, .93, 0);
      scene.add(new T.HemisphereLight(0xf2f6ff, 0x827261, 2.7));
      const key = new T.DirectionalLight(0xffeee0, 3.2); key.position.set(-2, 4, 4); scene.add(key);
      const rim = new T.DirectionalLight(0xc4d6ff, 2); rim.position.set(2, 2, -2); scene.add(rim);
      let frame = 0, last = 0, elapsed = 0, dirty = true, lastAngle = angle, model: import("three").Group | null = null;
      let mixer: import("three").AnimationMixer | null = null;
      let action: import("three").AnimationAction | undefined;
      const reduced = matchMedia("(prefers-reduced-motion: reduce)");
      let visible = true;
      const observer = new ResizeObserver(() => {
        const { width, height } = host.getBoundingClientRect();
        renderer.setSize(Math.max(1, width), Math.max(1, height));
        camera.aspect = width / Math.max(1, height); camera.updateProjectionMatrix();
        dirty = true;
      });
      observer.observe(host);
      const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
      intersection.observe(host);
      const disposeModel = (object: import("three").Object3D) => object.traverse((child) => {
        const mesh = child as import("three").SkinnedMesh;
        mesh.geometry?.dispose(); mesh.skeleton?.dispose();
        for (const material of [mesh.material].flat().filter(Boolean)) material.dispose();
      });
      cleanup = () => {
        cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect();
        mixer?.stopAllAction(); if (model) { mixer?.uncacheRoot(model); disposeModel(model); }
        renderer.dispose(); renderer.domElement.remove(); animation.current = null;
      };
      renderer.domElement.addEventListener("webglcontextlost", (event) => { event.preventDefault(); cleanup(); setReady(false); }, { signal: abort.signal });
      const response = await fetch(`${basePath}/assets/tour_guide.glb`, { signal: AbortSignal.any([abort.signal, AbortSignal.timeout(15000)]) });
      if (!response.ok) throw new Error("Avatar unavailable");
      const gltf = await new GLTFLoader().parseAsync(await response.arrayBuffer(), "");
      if (abort.signal.aborted) { disposeModel(gltf.scene); return; }
      model = gltf.scene; scene.add(model); mixer = new T.AnimationMixer(model);
      const actions = new Map(gltf.animations.map(item => [item.name, mixer?.clipAction(item)]));
      animation.current = (name) => {
        const next = actions.get(name) ?? actions.get("idle_loop");
        if (!next || next === action) return;
        next.reset().play(); if (action) next.crossFadeFrom(action, .25, false); action = next;
        dirty = true;
      };
      animation.current(pose.current.clip);
      setReady(true);
      const tick = (time: number) => {
        frame = requestAnimationFrame(tick);
        if (!visible || document.hidden) { last = time; return; }
        if (time - last < 1000 / 30) return;
        const delta = Math.min((time - (last || time)) / 1000, .05); last = time;
        const staticFrame = pose.current.paused || reduced.matches;
        if (staticFrame && !dirty && pose.current.angle === lastAngle && elapsed >= .8) return;
        elapsed += delta;
        if (!pose.current.paused && !reduced.matches) mixer?.update(delta);
        if (model) {
          model.rotation.y = pose.current.angle;
          // One arrival hop with a soft landing. No repeated entrance on scroll.
          const t = Math.min(1, elapsed / .8);
          model.position.y = reduced.matches ? 0 : Math.sin(t * Math.PI) * .12;
          model.scale.setScalar(reduced.matches ? 1 : .85 + .15 * (1 - (1 - t) ** 3));
        }
        renderer.render(scene, camera);
        lastAngle = pose.current.angle; dirty = false;
      };
      frame = requestAnimationFrame(tick);
    }).catch(() => { cleanup(); if (!abort.signal.aborted) setReady(false); });
    return () => { abort.abort(); cleanup(); };
  }, []);
  return <div className="owner-avatar" ref={mount} data-ready={ready} role="img" aria-label="Stylized 3D avatar of Ali Nguyen in a black suit">
    {!ready && <img src={`${basePath}/ali-nguyen-portrait-480.webp`} alt="" width="180" height="248" />}
  </div>;
}
