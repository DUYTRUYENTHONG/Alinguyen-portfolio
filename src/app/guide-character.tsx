"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/portfolio";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const mix = (start: number, end: number, amount: number) => start + (end - start) * amount;

const stops = [
  ["#visitor", "Choose your perspective"],
  [".statement", "What I do"],
  [".proof-ribbon", "Proof of work"],
  ["#highlights", "Highlights"],
  [".decision-map-wrap", "From signal to decision"],
  ["#work", "Selected work"],
  [".funnel-section", "Sales journey"],
  ["#feedback", "Customers"],
  ["#about", "About Ali"],
  ["#cvs", "Download a CV"],
  [".notes-section", "Build notes"],
  ["#contact", "Let's talk"],
] as const;

export function GuideCharacter({ icon }: { icon: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const actorRef = useRef<HTMLButtonElement>(null);
  const lastPosition = useRef<{ x: number; y: number } | null>(null);
  const [stop, setStop] = useState("Choose your perspective");
  const stopRef = useRef(stop);

  useEffect(() => {
    const stage = stageRef.current;
    const actor = actorRef.current;
    if (!stage || !actor) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const held = { left: false, right: false };
    let currentX = lastPosition.current?.x ?? null;
    let currentY = lastPosition.current?.y ?? null;
    let manualOffset = 0;
    let rise = 0;
    let velocity = 0;
    let frame = 0;
    let scrollFrame = 0;
    let settleFrame = 0;
    let walkTimer = 0;
    let lastTime = 0;
    let scrolling = false;

    const route = () => {
      const stageRect = stage.getBoundingClientRect();
      const maxX = Math.max(0, stage.clientWidth - actor.offsetWidth);
      const maxY = Math.max(0, stage.clientHeight - actor.offsetHeight);
      const readingLine = window.innerWidth < 768
        ? window.innerHeight - actor.offsetHeight - 34
        : clamp(window.innerHeight * .58, 145, window.innerHeight - actor.offsetHeight - 24);
      const visitor = document.getElementById("visitor");
      const contact = document.getElementById("contact");
      const visible = Boolean(visitor && visitor.getBoundingClientRect().top < window.innerHeight * .8 && (!contact || contact.getBoundingClientRect().bottom > window.innerHeight * .15));

      let label = "Explore the portfolio";
      for (const [selector, title] of stops) {
        const rect = document.querySelector(selector)?.getBoundingClientRect();
        if (rect && rect.top <= readingLine && rect.bottom > readingLine) { label = title; break; }
      }
      if (label === "Selected work") {
        for (const card of document.querySelectorAll<HTMLElement>(".work-card")) {
          const rect = card.getBoundingClientRect();
          if (rect.top <= readingLine && rect.bottom > readingLine) {
            const project = projects.find((item) => `project-${item.id}` === card.id);
            label = project?.name.replace("DUYTRUYENTHONG ", "").replace("Codex ", "") ?? label;
            break;
          }
        }
      }

      let x = Math.max(0, maxX - 8);
      let y = clamp(readingLine - stageRect.top, 0, maxY);
      const visitorRect = visitor?.getBoundingClientRect();
      if (visitorRect && visitorRect.top <= readingLine && visitorRect.bottom > readingLine) {
        const card = visitor?.querySelector(".role-card.is-selected") ?? visitor?.querySelector(".role-card");
        const stats = visitor?.querySelector(".visitor-stats, .visitor-stats-offline");
        const result = visitor?.querySelector(".visitor-result");
        if (card && stats && result) {
          const cardRect = card.getBoundingClientRect();
          const statsRect = stats.getBoundingClientRect();
          const resultRect = result.getBoundingClientRect();
          const points = [
            { x: cardRect.left - stageRect.left + cardRect.width / 2 - actor.offsetWidth / 2, y: cardRect.bottom - stageRect.top - actor.offsetHeight + 3 },
            { x: maxX * .72, y: statsRect.top - stageRect.top - actor.offsetHeight + 3 },
            { x: maxX * .3, y: resultRect.top - stageRect.top - actor.offsetHeight + 3 },
          ];
          const first = clamp((readingLine - cardRect.bottom) / Math.max(1, statsRect.top - cardRect.bottom), 0, 1);
          const second = clamp((readingLine - statsRect.top) / Math.max(1, resultRect.top - statsRect.top), 0, 1);
          const from = second > 0 ? points[1] : points[0];
          const to = second > 0 ? points[2] : points[1];
          const amount = second > 0 ? second : first;
          x = mix(from.x, to.x, amount);
          y = mix(from.y, to.y, amount) - (reducedMotion.matches ? 0 : Math.sin(Math.PI * amount) * 20);
        }
      }
      return { x: clamp(x, 0, maxX), y: clamp(y, 0, maxY), label, visible, maxX };
    };

    const paint = () => {
      const target = route();
      actor.style.opacity = target.visible ? "1" : "0";
      actor.style.pointerEvents = target.visible ? "auto" : "none";
      actor.tabIndex = target.visible ? 0 : -1;
      if (stopRef.current !== target.label) {
        stopRef.current = target.label;
        setStop(target.label);
      }
      manualOffset = clamp(manualOffset, -target.x, target.maxX - target.x);
      const targetX = clamp(target.x + manualOffset, 0, target.maxX);
      const amount = reducedMotion.matches ? 1 : .22;
      currentX = currentX === null ? targetX : mix(currentX, targetX, amount);
      currentY = currentY === null ? target.y : mix(currentY, target.y, amount);
      lastPosition.current = { x: currentX, y: currentY };
      actor.style.transform = `translate3d(${currentX}px, ${currentY + rise}px, 0)`;
      actor.classList.toggle("is-walking", target.visible && !reducedMotion.matches && (held.left || held.right || scrolling));
      actor.classList.toggle("is-jumping", rise < -1);
      return Math.abs(targetX - currentX) > .6 || Math.abs(target.y - currentY) > .6;
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
      const following = paint();
      if (direction !== 0 || rise < 0 || following) frame = requestAnimationFrame(step);
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
      if (event.target !== actor) return;
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
    const stopWalking = () => { held.left = false; held.right = false; };
    const onScroll = () => {
      if (reducedMotion.matches) { paint(); return; }
      scrolling = true;
      window.clearTimeout(walkTimer);
      walkTimer = window.setTimeout(() => { scrolling = false; paint(); }, 150);
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(() => { scrollFrame = 0; paint(); animate(); });
    };
    const settleStart = performance.now();
    const settle = (time: number) => {
      paint();
      if (time - settleStart < 900) settleFrame = window.requestAnimationFrame(settle);
      else settleFrame = 0;
    };
    const observer = new ResizeObserver(paint);
    observer.observe(stage);
    const grid = document.querySelector(".role-grid");
    if (grid) observer.observe(grid);
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    actor.addEventListener("click", jump);
    actor.addEventListener("blur", stopWalking);
    paint();
    settleFrame = requestAnimationFrame(settle);
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
      actor.removeEventListener("blur", stopWalking);
    };
  }, [icon]);

  useEffect(() => {
    const actor = actorRef.current;
    if (!actor) return;
    actor.classList.add("is-speaking");
    const timer = window.setTimeout(() => actor.classList.remove("is-speaking"), 2800);
    return () => window.clearTimeout(timer);
  }, [stop, icon]);

  return <div className="guide-stage guide-stage-journey" ref={stageRef}>
    <button ref={actorRef} className="guide-character" type="button" aria-label={`Tour guide: ${stop}. Focus to walk with arrow keys; tap or press Up to jump.`} title="Your guide · Arrow keys walk when focused · Tap to jump">
      <img src={`${basePath}/guide-art/${icon}.webp`} alt="" width="68" height="102" draggable="false" />
      <span className="guide-callout" aria-hidden="true"><small>Your guide</small><strong>{stop}</strong></span>
    </button>
  </div>;
}
