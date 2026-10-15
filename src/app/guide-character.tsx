"use client";

import { useEffect, useRef } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const mix = (start: number, end: number, amount: number) => start + (end - start) * amount;

export function GuideCharacter({ activeProjectId, mode = "work", icon = "builder" }: { activeProjectId?: string; mode?: "visitor" | "work"; icon?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const actorRef = useRef<HTMLButtonElement>(null);

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
    let manualOffset = 0;
    let scrollFrame = 0;
    let settleFrame = 0;
    let walkTimer = 0;
    let scrolling = false;

    const route = () => {
      const stageRect = stage.getBoundingClientRect();
      const maxX = Math.max(0, stage.clientWidth - actor.offsetWidth);
      if (mode === "visitor") {
        const section = stage.parentElement;
        const card = section?.querySelector(".role-card.is-selected") ?? section?.querySelector(".role-card");
        const stats = section?.querySelector(".visitor-stats, .visitor-stats-offline");
        const result = section?.querySelector(".visitor-result");
        if (!card || !stats || !result) return { x: maxX * .72, y: 0, hop: 0 };

        const cardRect = card.getBoundingClientRect();
        const statsRect = stats.getBoundingClientRect();
        const resultRect = result.getBoundingClientRect();
        const points = [
          { x: cardRect.left - stageRect.left + cardRect.width / 2 - actor.offsetWidth / 2, y: cardRect.bottom - stageRect.top - actor.offsetHeight + 3 },
          { x: maxX * .72, y: statsRect.top - stageRect.top - actor.offsetHeight + 3 },
          { x: maxX * .3, y: resultRect.top - stageRect.top - actor.offsetHeight + 3 },
        ];
        // Let the viewport's lower reading line lead the guide from the role
        // cards to the live counts and then to the recommendation.
        const readingLine = window.innerHeight * .7;
        const first = clamp((readingLine - cardRect.bottom) / Math.max(1, statsRect.top - cardRect.bottom), 0, 1);
        const second = clamp((readingLine - statsRect.top) / Math.max(1, resultRect.top - statsRect.top), 0, 1);
        const from = second > 0 ? points[1] : points[0];
        const to = second > 0 ? points[2] : points[1];
        const amount = second > 0 ? second : first;
        return { x: mix(from.x, to.x, amount), y: mix(from.y, to.y, amount), hop: -Math.sin(Math.PI * amount) * 24 };
      }
      const card = document.getElementById(`project-${activeProjectId}`) ?? stage.parentElement?.querySelector(".work-card");
      if (!card) return { x: maxX * .3, y: 0, hop: 0 };
      const platform = card.querySelector(".project-proof") ?? card;
      const cardRect = card.getBoundingClientRect();
      const progress = clamp((window.innerHeight * .7 - cardRect.top) / Math.max(1, cardRect.height), 0, 1);
      return {
        x: mix(maxX * .22, maxX * .72, progress),
        y: platform.getBoundingClientRect().top - stageRect.top - actor.offsetHeight + 3,
        hop: -Math.sin(Math.PI * progress) * 18,
      };
    };

    const paint = () => {
      const path = route();
      const maxX = Math.max(0, stage.clientWidth - actor.offsetWidth);
      manualOffset = clamp(manualOffset, -path.x, maxX - path.x);
      const x = clamp(path.x + manualOffset, 0, maxX);
      const hop = reducedMotion.matches ? 0 : path.hop;
      actor.style.transform = `translate3d(${x}px, ${path.y + hop + rise}px, 0)`;
      actor.classList.toggle("is-walking", held.left || held.right || scrolling);
      actor.classList.toggle("is-jumping", rise < -1 || hop < -4);
    };

    const step = (time: number) => {
      const delta = Math.min((time - (lastTime || time)) / 1000, .05);
      lastTime = time;
      const direction = Number(held.right) - Number(held.left);
      manualOffset += direction * 205 * delta;
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
        if (!event.repeat) manualOffset += direction * 22;
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
    const onScroll = () => {
      if (reducedMotion.matches) { paint(); return; }
      scrolling = true;
      window.clearTimeout(walkTimer);
      walkTimer = window.setTimeout(() => { scrolling = false; paint(); }, 150);
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(() => { scrollFrame = 0; paint(); });
    };
    // The selected role changes its grid position with a spring animation.
    // Keep the guide anchored to its moving card until that layout settles.
    const settleStart = performance.now();
    const settle = (time: number) => {
      paint();
      if (time - settleStart < 900) settleFrame = window.requestAnimationFrame(settle);
      else settleFrame = 0;
    };
    const observer = new ResizeObserver(paint);
    observer.observe(stage);
    if (mode === "visitor") {
      const grid = stage.parentElement?.querySelector(".role-grid");
      if (grid) observer.observe(grid);
    }
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    actor.addEventListener("click", jump);
    actor.addEventListener("blur", stop);
    paint();
    settleFrame = window.requestAnimationFrame(settle);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(scrollFrame);
      cancelAnimationFrame(settleFrame);
      window.clearTimeout(walkTimer);
      observer.disconnect();
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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
