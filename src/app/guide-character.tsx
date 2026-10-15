"use client";

import { useEffect, useRef } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function GuideCharacter({ activeProjectId, mode = "work", icon = "builder" }: { activeProjectId?: string; mode?: "visitor" | "work"; icon?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const actorRef = useRef<HTMLButtonElement>(null);
  const positionRef = useRef<number | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const actor = actorRef.current;
    if (!stage || !actor) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const held = { left: false, right: false };
    let rise = 0;
    let velocity = 0;
    let frame = 0;
    let lastTime = 0;

    const floor = () => {
      if (mode === "visitor") {
        const line = stage.parentElement?.querySelector(".visitor-stats, .visitor-stats-offline");
        return (line?.getBoundingClientRect().top ?? stage.getBoundingClientRect().bottom) - stage.getBoundingClientRect().top - actor.offsetHeight + 3;
      }
      const card = document.getElementById(`project-${activeProjectId}`) ?? stage.parentElement?.querySelector(".work-card");
      if (!card) return 0;
      const platform = card.querySelector(".project-proof") ?? card;
      return platform.getBoundingClientRect().top - stage.getBoundingClientRect().top - actor.offsetHeight + 3;
    };

    const paint = () => {
      const maxX = Math.max(0, stage.clientWidth - actor.offsetWidth);
      const x = Math.min(maxX, Math.max(0, positionRef.current ?? maxX * (mode === "visitor" ? .72 : .3)));
      positionRef.current = x;
      actor.style.transform = `translate3d(${x}px, ${floor() + rise}px, 0)`;
      actor.classList.toggle("is-walking", held.left || held.right);
      actor.classList.toggle("is-jumping", rise < -1);
    };

    const step = (time: number) => {
      const delta = Math.min((time - (lastTime || time)) / 1000, .05);
      lastTime = time;
      const direction = Number(held.right) - Number(held.left);
      positionRef.current = (positionRef.current ?? stage.clientWidth * (mode === "visitor" ? .72 : .3)) + direction * 205 * delta;
      if (rise < 0 || velocity < 0) {
        velocity += 1800 * delta;
        rise = Math.min(0, rise + velocity * delta);
        if (rise === 0) velocity = 0;
      }
      paint();
      if (direction !== 0 || rise < 0) frame = requestAnimationFrame(step);
      else { frame = 0; lastTime = 0; }
    };

    const animate = () => { if (!frame && !reducedMotion.matches) frame = requestAnimationFrame(step); };
    const jump = () => {
      if (reducedMotion.matches || rise < 0) return;
      velocity = -650;
      rise = -.1;
      animate();
    };
    const keyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      const bounds = actor.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > window.innerHeight || bounds.right < 0 || bounds.left > window.innerWidth) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const direction = event.key === "ArrowLeft" ? -1 : 1;
        if (!event.repeat) positionRef.current = (positionRef.current ?? 0) + direction * 22;
        held[direction < 0 ? "left" : "right"] = true;
        actor.dataset.facing = event.key === "ArrowLeft" ? "left" : "right";
        paint();
        animate();
      } else if (event.key === "ArrowUp" || event.key === " ") {
        event.preventDefault();
        jump();
      }
    };
    const keyUp = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") held[event.key === "ArrowLeft" ? "left" : "right"] = false;
    };
    const stop = () => { held.left = false; held.right = false; };
    const observer = new ResizeObserver(paint);
    observer.observe(stage);
    if (mode === "visitor") {
      const grid = stage.parentElement?.querySelector(".role-grid");
      if (grid) observer.observe(grid);
    }
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    actor.addEventListener("click", jump);
    actor.addEventListener("blur", stop);
    paint();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      actor.removeEventListener("click", jump);
      actor.removeEventListener("blur", stop);
    };
  }, [activeProjectId, mode, icon]);

  return <div className={`guide-stage guide-stage-${mode}`} ref={stageRef} aria-hidden="false">
    <button ref={actorRef} className="guide-character" type="button" aria-label="Guide character: use left and right arrow keys to walk; Up or tap to jump" title="Arrow keys walk · Up or tap jumps">
      <img src={`${basePath}/guide-art/${icon}.webp`} alt="" width="68" height="102" draggable="false" />
    </button>
  </div>;
}
