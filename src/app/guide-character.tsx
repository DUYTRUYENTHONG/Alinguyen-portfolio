"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/portfolio";
import { GuideAssistantPanel } from "./guide-assistant-panel";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const mix = (start: number, end: number, amount: number) => start + (end - start) * amount;

const stops = [
  ["#visitor", "Choose your perspective"],
  [".statement", "What I do"],
  [".proof-ribbon", "Proof of work"],
  ["#highlights", "Highlights"],
  ["#ai-expertise", "Applied AI expertise"],
  [".decision-map-wrap", "From signal to decision"],
  ["#work", "Selected work"],
  [".funnel-section", "Sales journey"],
  ["#feedback", "Customers"],
  ["#about", "About Ali"],
  ["#cvs", "Download a CV"],
  [".notes-section", "Build notes"],
  ["#contact", "Let's talk"],
] as const;

const sceneMessages: Record<string, string> = {
  "Choose your perspective": "Pick a role and I’ll keep that look as we explore the page.",
  "What I do": "I connect marketing, commerce, and data so the next step is clearer.",
  "Proof of work": "These labels separate live sites, public code, and local prototypes.",
  Highlights: "Here’s the short version. Open a card when something catches your eye.",
  "Applied AI expertise": "These examples show what I built, what I checked, and where the evidence ends.",
  "From signal to decision": "The common thread: collect a signal, build a useful workflow, then decide.",
  "Selected work": "Browse the projects for the problem, my role, and the evidence.",
  "Sales journey": "Try either funnel: each stage explains the job it does and the signal to watch.",
  Customers: "These are customer names from the work behind the portfolio.",
  "About Ali": "This is how I scope work and keep claims tied to evidence.",
  "Download a CV": "Choose the version that fits the role you’re discussing.",
  "Build notes": "A few decisions show how I test and explain the work.",
  "Let's talk": "Tell me the offer, the audience, and where people get stuck.",
};

const projectMessages: Record<string, string> = {
  "vibecode-kit": "A public CLI with plans, release checks, and passing CI to inspect.",
  "growth-commerce-os": "A live service site connecting content, channels, and lead paths.",
  stos: "A live sales page product for independent sellers and small businesses.",
  "cho-kenh": "A TikTok channel catalog with manual inquiries and deal checks.",
  "kkbox-baseline": "A tested churn baseline with an audited local holdout on official data.",
};

const personas: Record<string, { name: string; introduction: string }> = {
  Recruiter: { name: "Ari", introduction: "Hi, I’m Ari. I’ll help you assess fit and find evidence you can inspect." },
  Founder: { name: "Nova", introduction: "Hi, I’m Nova. I’ll show how Ali turns ideas into working products." },
  Engineer: { name: "Kai", introduction: "Hi, I’m Kai. Let’s look at the code, checks, and tradeoffs." },
  "Product designer": { name: "Mira", introduction: "Hi, I’m Mira. I’ll point out the user journeys and design choices." },
  Marketer: { name: "Lia", introduction: "Hi, I’m Lia. Let’s follow the audience, message, and measurement." },
  Growth: { name: "Rio", introduction: "Hi, I’m Rio. I’ll connect the funnel stages to useful signals." },
  Data: { name: "Ada", introduction: "Hi, I’m Ada. I’ll show the data work and its evaluation limits." },
  Investor: { name: "Sol", introduction: "Hi, I’m Sol. Let’s examine product status and the evidence behind it." },
  Student: { name: "Emi", introduction: "Hi, I’m Emi. I’ll highlight the learning path and academic questions." },
  "Fellow builder": { name: "Sam", introduction: "Hi, I’m Sam. Let’s inspect the tools and how the work is shipped." },
  "Just curious": { name: "Pip", introduction: "Hi, I’m Pip. I’ll give you a quick tour of Ali’s work." },
};

export function GuideCharacter({ icon, role, chosen }: { icon: string; role: string; chosen: boolean }) {
  const persona = personas[role] ?? personas.Recruiter;
  const stageRef = useRef<HTMLDivElement>(null);
  const actorRef = useRef<HTMLButtonElement>(null);
  const lastPosition = useRef<{ x: number; y: number } | null>(null);
  const [stop, setStop] = useState("Choose your perspective");
  const [message, setMessage] = useState(sceneMessages["Choose your perspective"]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [showIntroduction, setShowIntroduction] = useState(false);
  const panelOpenRef = useRef(false);
  const stopRef = useRef(stop);
  const messageRef = useRef(message);

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
    let lastScrollY = window.scrollY;
    let scrolling = false;

    const route = () => {
      const stageRect = stage.getBoundingClientRect();
      const maxX = Math.max(0, stage.clientWidth - actor.offsetWidth);
      const maxY = Math.max(0, stage.clientHeight - actor.offsetHeight);
      const readingLine = window.innerWidth < 768
        ? clamp(window.innerHeight * .62, 210, window.innerHeight - actor.offsetHeight - 24)
        : clamp(window.innerHeight * .58, 145, window.innerHeight - actor.offsetHeight - 24);
      const visitor = document.getElementById("visitor");
      const contact = document.getElementById("contact");
      const visible = Boolean(visitor && visitor.getBoundingClientRect().top < window.innerHeight * .8 && (!contact || contact.getBoundingClientRect().bottom > window.innerHeight * .15));
      if (!visible) {
        const viewportMaxX = Math.max(0, window.innerWidth - actor.offsetWidth);
        return { x: lastPosition.current?.x ?? viewportMaxX - 8, y: lastPosition.current?.y ?? readingLine, label: stopRef.current, message: messageRef.current, visible: false, maxX: viewportMaxX };
      }

      let label = "Explore the portfolio";
      let sceneIndex = 0;
      let projectId: string | null = null;
      for (const [index, [selector, title]] of stops.entries()) {
        const rect = document.querySelector(selector)?.getBoundingClientRect();
        if (rect && rect.top <= readingLine && rect.bottom > readingLine) { label = title; sceneIndex = index; break; }
      }
      if (label === "Selected work") {
        for (const card of document.querySelectorAll<HTMLElement>(".work-card")) {
          const rect = card.getBoundingClientRect();
          if (rect.top <= readingLine && rect.bottom > readingLine) {
            const project = projects.find((item) => `project-${item.id}` === card.id);
            label = project?.name.replace("DUYTRUYENTHONG ", "").replace("Codex ", "") ?? label;
            projectId = project?.id ?? null;
            break;
          }
        }
      }

      const edgeOffset = [8, 30, 14, 44, 26, 22, 50, 10, 38, 18, 32, 12, 24][sceneIndex] ?? 8;
      let x = Math.max(0, maxX - edgeOffset);
      let y = clamp(readingLine - stageRect.top + [0, -24, 18, -15, 10, 24, -12, 16, -22, 12, -16, 20, 0][sceneIndex], 0, maxY);
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
      const safeTop = window.innerWidth < 768 ? 98 : 120;
      const safeBottom = window.innerHeight - actor.offsetHeight - 22;
      let screenY = clamp(y + stageRect.top, safeTop, safeBottom);
      // Keep the guide and its message clear of the main conversion links as they pass the reading line.
      for (const link of document.querySelectorAll<HTMLElement>(".hero-actions a, .project-proof a")) {
        const rect = link.getBoundingClientRect();
        if (rect.bottom < safeTop || rect.top > window.innerHeight) continue;
        if (screenY - 20 >= rect.bottom || screenY + actor.offsetHeight + 20 <= rect.top) continue;
        const above = rect.top - actor.offsetHeight - 32;
        const below = rect.bottom + 32;
        const choices = [above, below].filter((position) => position >= safeTop && position <= safeBottom);
        if (choices.length) screenY = choices.sort((a, b) => Math.abs(a - screenY) - Math.abs(b - screenY))[0];
      }
      const message = (projectId ? projectMessages[projectId] : null) ?? sceneMessages[label] ?? "Follow along for the work and the decisions behind it.";
      const viewportMaxX = Math.max(0, window.innerWidth - actor.offsetWidth);
      const screenX = label === "Download a CV" ? viewportMaxX : clamp(x + stageRect.left, 0, viewportMaxX);
      return { x: screenX, y: screenY, label, message, visible, maxX: viewportMaxX };
    };

    const paint = () => {
      const target = route();
      actor.style.opacity = target.visible && !panelOpenRef.current ? "1" : "0";
      actor.style.pointerEvents = target.visible && !panelOpenRef.current ? "auto" : "none";
      actor.tabIndex = target.visible && !panelOpenRef.current ? 0 : -1;
      if (stopRef.current !== target.label) {
        stopRef.current = target.label;
        setStop(target.label);
      }
      if (messageRef.current !== target.message) {
        messageRef.current = target.message;
        setMessage(target.message);
      }
      manualOffset = clamp(manualOffset, -target.x, target.maxX - target.x);
      const targetX = target.label === "Download a CV" ? target.maxX : clamp(target.x + manualOffset, 0, target.maxX);
      const amount = reducedMotion.matches ? 1 : .22;
      currentX = currentX === null || target.label === "Download a CV" ? targetX : mix(currentX, targetX, amount);
      currentY = currentY === null ? target.y : mix(currentY, target.y, amount);
      lastPosition.current = { x: currentX, y: currentY };
      actor.style.transform = `translate3d(${currentX}px, ${currentY + rise}px, 0)`;
      const callout = actor.querySelector<HTMLElement>(".guide-callout");
      if (callout) {
        const width = callout.offsetWidth;
        const idealLeft = currentX > target.maxX / 2 ? -width - 8 : actor.offsetWidth + 8;
        const viewportX = currentX;
        callout.style.left = `${clamp(idealLeft, 12 - viewportX, window.innerWidth - width - 12 - viewportX)}px`;
      }
      actor.classList.toggle("is-walking", target.visible && !reducedMotion.matches && (held.left || held.right));
      actor.classList.toggle("is-scrolling", target.visible && !reducedMotion.matches && scrolling);
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
      if (window.scrollY !== lastScrollY) actor.dataset.scrollDirection = window.scrollY < lastScrollY ? "up" : "down";
      lastScrollY = window.scrollY;
      scrolling = true;
      window.clearTimeout(walkTimer);
      walkTimer = window.setTimeout(() => { scrolling = false; paint(); }, 150);
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(() => { scrollFrame = 0; paint(); animate(); });
    };
    const observer = new ResizeObserver(paint);
    observer.observe(stage);
    const grid = document.querySelector(".role-grid");
    if (grid) observer.observe(grid);
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("load", paint);
    window.addEventListener("guide-panel-change", paint);
    actor.addEventListener("blur", stopWalking);
    paint();
    settleFrame = requestAnimationFrame(paint);
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
      window.removeEventListener("load", paint);
      window.removeEventListener("guide-panel-change", paint);
      actor.removeEventListener("blur", stopWalking);
    };
  }, [icon]);

  useEffect(() => {
    const actor = actorRef.current;
    if (!actor) return;
    actor.classList.add("is-speaking");
    const timer = window.setTimeout(() => actor.classList.remove("is-speaking"), 2800);
    return () => window.clearTimeout(timer);
  }, [stop, icon, showIntroduction]);

  useEffect(() => {
    if (!chosen) return;
    setShowIntroduction(true);
    const actor = actorRef.current;
    actor?.classList.add("is-greeting");
    const timer = window.setTimeout(() => setShowIntroduction(false), 5000);
    const motionTimer = window.setTimeout(() => actor?.classList.remove("is-greeting"), 1300);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(motionTimer);
      actor?.classList.remove("is-greeting");
    };
  }, [chosen, role]);

  const changePanel = (open: boolean) => {
    panelOpenRef.current = open;
    setPanelOpen(open);
    window.dispatchEvent(new Event("guide-panel-change"));
    if (!open) requestAnimationFrame(() => actorRef.current?.focus());
  };

  return <div className="guide-stage guide-stage-journey" ref={stageRef}>
    <button ref={actorRef} className="guide-character" type="button" onClick={() => changePanel(true)} aria-label={`Ask ${persona.name}, Ali's AI guide. Current section: ${stop}. ${message}`} aria-haspopup="dialog" aria-expanded={panelOpen} title={`Ask ${persona.name} · Arrow keys move when focused · Up jumps`}>
      <img src={`${basePath}/guide-art/${icon}.webp`} alt="" width="68" height="102" draggable="false" />
      <span className="guide-callout" aria-hidden="true"><small>{showIntroduction ? `Meet ${persona.name}` : stop}</small><strong>{showIntroduction ? persona.introduction : message}</strong></span>
    </button>
    <GuideAssistantPanel open={panelOpen} onClose={() => changePanel(false)} icon={icon} name={persona.name} role={role} section={stop} />
  </div>;
}
