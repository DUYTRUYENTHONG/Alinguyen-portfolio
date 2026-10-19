"use client";

import { useEffect, useRef } from "react";

type Point3D = { x: number; y: number; z: number };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const hash = (value: number) => {
  const fraction = Math.sin(value * 127.1) * 43758.5453;
  return fraction - Math.floor(fraction);
};

export function HeroSpace() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest<HTMLElement>(".hero");
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !hero || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stars = Array.from({ length: 64 }, (_, index) => ({
      x: (hash(index + 1) - 0.5) * 30,
      y: 1.4 + hash(index + 91) * 6.2,
      z: 3 + hash(index + 205) * 28,
      radius: 0.65 + hash(index + 333) * 1.15,
    }));

    let width = 1;
    let height = 1;
    let frame = 0;
    let lastFrame = 0;
    let visible = true;
    let pointerX = 0;
    let pointerY = 0;
    let cameraX = 0;
    let cameraY = 0;
    let scrollProgress = 0;

    const resize = () => {
      const bounds = hero.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (reducedMotion.matches) draw(0);
    };

    const updateScroll = () => {
      const bounds = hero.getBoundingClientRect();
      const travel = Math.max(1, bounds.height - window.innerHeight);
      scrollProgress = reducedMotion.matches ? 0 : clamp(-bounds.top / travel, 0, 1);
      if (reducedMotion.matches) draw(0);
    };

    const project = ({ x, y, z }: Point3D) => {
      const yaw = cameraX * 0.11 + scrollProgress * 0.08;
      const rotatedX = x * Math.cos(yaw) - z * Math.sin(yaw);
      const rotatedZ = x * Math.sin(yaw) + z * Math.cos(yaw);
      const depth = Math.max(2, rotatedZ + 5.5);
      const scale = Math.min(width * 0.72, 850) / depth;
      return {
        x: width * 0.53 + rotatedX * scale,
        y: height * 0.32 + (3.8 + cameraY * 0.3 - y) * scale + scrollProgress * height * 0.06,
        scale,
      };
    };

    const wave = (x: number, z: number, time: number) =>
      Math.sin(x * 0.36 + z * 0.29 - time * 0.48) * 0.17 + Math.sin(z * 0.22 + time * 0.32) * 0.1;

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const offset = reducedMotion.matches ? 0 : (time * 0.38 + scrollProgress * 5.2) % 2.4;
      const columns = width < 640 ? 13 : 19;

      for (let column = -columns; column <= columns; column += 1) {
        const x = column * 1.4;
        context.beginPath();
        for (let step = 0; step <= 48; step += 1) {
          const z = step * 0.7;
          const point = project({ x, y: wave(x, z, time), z });
          if (step === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        }
        context.strokeStyle = `rgba(115, 224, 202, ${column % 4 === 0 ? 0.2 : 0.105})`;
        context.lineWidth = column % 4 === 0 ? 1.1 : 0.75;
        context.stroke();
      }

      for (let row = 0; row < 16; row += 1) {
        const z = row * 2.4 + 1.2 - offset;
        if (z < 0) continue;
        context.beginPath();
        for (let step = 0; step <= 56; step += 1) {
          const x = (step - 28) * 0.9;
          const point = project({ x, y: wave(x, z, time), z });
          if (step === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        }
        context.strokeStyle = `rgba(115, 224, 202, ${row % 4 === 0 ? 0.2 : 0.11})`;
        context.lineWidth = row % 4 === 0 ? 1.1 : 0.75;
        context.stroke();
      }

      for (const star of stars) {
        const drift = reducedMotion.matches ? 0 : time * 0.16;
        const depth = ((star.z - drift + 28) % 28) + 2;
        const point = project({ x: star.x, y: star.y + Math.sin(time * 0.6 + star.z) * 0.16, z: depth });
        if (point.x < 0 || point.x > width || point.y < 0 || point.y > height) continue;
        context.beginPath();
        context.arc(point.x, point.y, star.radius * clamp(point.scale / 35, 0.55, 1.5), 0, Math.PI * 2);
        context.fillStyle = "rgba(170, 247, 222, 0.34)";
        context.fill();
      }
    };

    const animate = (timestamp: number) => {
      frame = 0;
      if (!visible || document.hidden || reducedMotion.matches) return;
      frame = window.requestAnimationFrame(animate);
      if (timestamp - lastFrame < 32) return;
      lastFrame = timestamp;
      cameraX += (pointerX - cameraX) * 0.055;
      cameraY += (pointerY - cameraY) * 0.055;
      draw(timestamp / 1000);
    };
    const start = () => {
      if (!frame && visible && !document.hidden && !reducedMotion.matches) frame = window.requestAnimationFrame(animate);
    };
    const stop = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const bounds = hero.getBoundingClientRect();
      pointerX = clamp((event.clientX - bounds.left) / bounds.width - 0.5, -0.5, 0.5);
      pointerY = clamp((event.clientY - bounds.top) / bounds.height - 0.5, -0.5, 0.5);
    };
    const onPointerLeave = () => { pointerX = 0; pointerY = 0; };
    const onMotionChange = () => {
      updateScroll();
      if (reducedMotion.matches) { stop(); draw(0); }
      else { lastFrame = 0; start(); }
    };
    const onVisibilityChange = () => { if (document.hidden) stop(); else start(); };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    }, { rootMargin: "150px" });
    const resizeObserver = new ResizeObserver(resize);
    observer.observe(hero);
    resizeObserver.observe(hero);
    hero.addEventListener("pointermove", onPointerMove, { passive: true });
    hero.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", updateScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotion.addEventListener("change", onMotionChange);
    resize();
    updateScroll();
    draw(0);
    start();

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", updateScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return <div className="hero-grid" aria-hidden="true"><canvas ref={canvasRef} /></div>;
}
