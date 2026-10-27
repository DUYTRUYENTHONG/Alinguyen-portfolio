"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { projects } from "@/data/portfolio";
import { GuideAssistantPanel } from "./guide-assistant-panel";
import { placeGuideActor } from "./guide-actor-placement";
import { placeGuideCallout } from "./guide-callout-placement";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const stops = [
  ["#top", "Explore the portfolio"],
  ["#visitor", "Choose your perspective"],
  [".statement", "What I do"],
  [".proof-ribbon", "Proof of work"],
  ["#highlights", "Highlights"],
  ["#work", "Selected work"],
  ["#ai-expertise", "Applied AI expertise"],
  ["#community", "Shared with the community"],
  [".decision-map-wrap", "From signal to decision"],
  [".funnel-section", "Sales journey"],
  ["#feedback", "Customers"],
  ["#about", "About Ali"],
  ["#cvs", "Download a CV"],
  [".notes-section", "Build notes"],
  ["#contact", "Let's talk"],
] as const;

const sceneMessages: Record<string, string> = {
  "Explore the portfolio": "I can help you explore Ali’s work, skills and CVs.",
  "Shared with the community": "Explore the free career-agent kit, its setup guide and its current limits.",
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
  const chatTriggerRef = useRef<HTMLButtonElement | null>(null);
  const lastPosition = useRef<{ x: number; y: number } | null>(null);
  const [stop, setStop] = useState("Explore the portfolio");
  const [message, setMessage] = useState(sceneMessages["Explore the portfolio"]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [conversationSection, setConversationSection] = useState(stop);
  const [messageSlot, setMessageSlot] = useState<HTMLElement | null>(null);
  useEffect(() => setMessageSlot(document.getElementById("visitor-guide-message")), []);
  const [showIntroduction, setShowIntroduction] = useState(false);
  const panelOpenRef = useRef(false);
  const stopRef = useRef(stop);
  const messageRef = useRef(message);

  useEffect(() => {
    const stage = stageRef.current;
    const actor = actorRef.current;
    if (!stage || !actor) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let currentX = lastPosition.current?.x ?? 0;
    let currentY = lastPosition.current?.y ?? 0;
    let scrollFrame = 0;
    let tiltFrame = 0;
    const obstacleSelector = "main article, main [aria-hidden=true], main h1, main h2, main h3, main p, main img, main a, main button, main input, main summary, .proof-ribbon, .role-card, .visitor-stats, .visitor-result, #collaboration-logos, [data-guide-obstacle]";
    const contentBoxes = (forCallout = false) => Array.from(document.querySelectorAll<HTMLElement>(obstacleSelector))
      .filter((element) => !stage.contains(element) && (!forCallout || !element.matches("article, [aria-hidden=true]")))
      .map((element) => element.getBoundingClientRect())
      .filter((rect) => rect.width > 2 && rect.height > 2 && rect.bottom > 0 && rect.top < window.innerHeight);

    const route = () => {
      const readingLine = window.innerWidth < 768
        ? clamp(window.innerHeight * .62, 210, window.innerHeight - actor.offsetHeight - 24)
        : clamp(window.innerHeight * .58, 145, window.innerHeight - actor.offsetHeight - 24);
      const contact = document.getElementById("contact");
      // The guide is available from the hero, including a fresh visit or reload.
      const visible = !contact || contact.getBoundingClientRect().bottom > window.innerHeight * .15;
      if (!visible) {
        const viewportMaxX = Math.max(0, window.innerWidth - actor.offsetWidth);
        return { x: lastPosition.current?.x ?? viewportMaxX - 8, y: lastPosition.current?.y ?? readingLine, label: stopRef.current, message: messageRef.current, visible: false, maxX: viewportMaxX };
      }

      let label = "Explore the portfolio";
      let projectId: string | null = null;
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
            projectId = project?.id ?? null;
            break;
          }
        }
      }

      // Measure the entire button, including its label, against actual content.
      const position = placeGuideActor(
        { width: actor.offsetWidth, height: actor.offsetHeight },
        { width: document.documentElement.clientWidth, height: window.innerHeight }, contentBoxes(), lastPosition.current,
      );
      const message = (projectId ? projectMessages[projectId] : null) ?? sceneMessages[label] ?? "Follow along for the work and the decisions behind it.";
      const viewportMaxX = Math.max(0, window.innerWidth - actor.offsetWidth);
      return { x: position.left, y: position.top, label, message, visible, maxX: viewportMaxX };
    };

    const paint = () => {
      if (panelOpenRef.current) {
        actor.style.opacity = "0";
        actor.style.pointerEvents = "none";
        actor.tabIndex = -1;
        actor.dataset.active = "false";
        return;
      }
      const target = route();
      actor.style.opacity = target.visible && !panelOpenRef.current ? "1" : "0";
      actor.dataset.active = String(target.visible && !panelOpenRef.current);
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
      // Keep the target still while it is being hovered or keyboard focused.
      const engaged = actor.matches(":hover, :focus-visible") && lastPosition.current;
      const inside = currentX + actor.offsetWidth <= document.documentElement.clientWidth - 16 && currentY + actor.offsetHeight <= window.innerHeight - 24;
      if (!engaged || !inside) { currentX = target.x; currentY = target.y; }
      lastPosition.current = { x: currentX, y: currentY };
      actor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      const callout = actor.querySelector<HTMLElement>(".guide-callout");
      if (callout) {
        const speaking = (actor.classList.contains("is-speaking") || actor.matches(":hover, :focus-visible"));
        const obstacles = speaking ? contentBoxes(true) : [];
        const placement = speaking ? placeGuideCallout(
          { left: currentX, top: currentY, width: actor.offsetWidth, height: actor.offsetHeight },
          { width: callout.offsetWidth, height: callout.offsetHeight },
          { width: window.innerWidth, height: window.innerHeight }, obstacles,
        ) ?? placeGuideCallout(
          { left: currentX, top: currentY, width: actor.offsetWidth, height: actor.offsetHeight },
          { width: callout.offsetWidth, height: callout.offsetHeight },
          { width: window.innerWidth, height: window.innerHeight }, [],
        ) : null;
        actor.classList.toggle("has-callout-space", Boolean(placement));
        if (placement) { callout.style.left = `${placement.left}px`; callout.style.top = `${placement.top}px`; }
      }
    };

    const tilt = (event: PointerEvent) => {
      if (reducedMotion.matches || event.pointerType !== "mouse") return;
      cancelAnimationFrame(tiltFrame);
      const bounds = actor.getBoundingClientRect();
      const x = clamp((event.clientX - bounds.left) / bounds.width - .5, -.5, .5);
      const y = clamp((event.clientY - bounds.top) / bounds.height - .5, -.5, .5);
      tiltFrame = requestAnimationFrame(() => {
        actor.style.setProperty("--guide-tilt-x", `${-y * 10}deg`);
        actor.style.setProperty("--guide-tilt-y", `${x * 12}deg`);
      });
    };
    const resetTilt = () => {
      cancelAnimationFrame(tiltFrame);
      actor.style.setProperty("--guide-tilt-x", "0deg");
      actor.style.setProperty("--guide-tilt-y", "0deg");
    };
    const onScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(() => { scrollFrame = 0; paint(); });
    };
    const observer = new ResizeObserver(paint);
    observer.observe(stage);
    const bubble = actor.querySelector<HTMLElement>(".guide-callout");
    if (bubble) observer.observe(bubble);
    const grid = document.querySelector(".role-grid");
    if (grid) observer.observe(grid);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("load", paint);
    window.addEventListener("guide-panel-change", paint);
    actor.addEventListener("focus", paint);
    actor.addEventListener("blur", paint);
    actor.addEventListener("pointerenter", paint);
    actor.addEventListener("pointermove", tilt);
    actor.addEventListener("pointerleave", resetTilt);
    actor.addEventListener("pointerleave", paint);
    actor.addEventListener("guide-message-change", paint);
    paint();
    return () => {
      cancelAnimationFrame(scrollFrame);
      cancelAnimationFrame(tiltFrame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("load", paint);
      window.removeEventListener("guide-panel-change", paint);
      actor.removeEventListener("focus", paint);
      actor.removeEventListener("blur", paint);
      actor.removeEventListener("pointerenter", paint);
      actor.removeEventListener("pointermove", tilt);
      actor.removeEventListener("pointerleave", resetTilt);
      actor.removeEventListener("pointerleave", paint);
      actor.removeEventListener("guide-message-change", paint);
    };
  }, [icon]);

  useEffect(() => {
    const actor = actorRef.current;
    if (!actor) return;
    actor.classList.add("is-speaking");
    const frame = requestAnimationFrame(() => actor.dispatchEvent(new Event("guide-message-change")));
    // Briefly show context, then restore the reading area. Hover/focus reopens it.
    const timer = window.setTimeout(() => { actor.classList.remove("is-speaking"); actor.dispatchEvent(new Event("guide-message-change")); }, 10000);
    return () => { window.clearTimeout(timer); cancelAnimationFrame(frame); };
  }, [stop, message, icon, showIntroduction]);

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

  const changePanel = (open: boolean, trigger?: HTMLButtonElement) => {
    if (open) {
      chatTriggerRef.current = trigger ?? null;
      setConversationSection(stopRef.current);
    }
    panelOpenRef.current = open;
    setPanelOpen(open);
    window.dispatchEvent(new Event("guide-panel-change"));
    if (!open) requestAnimationFrame(() => {
      const trigger = chatTriggerRef.current;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    });
  };

  return <div className="guide-stage guide-stage-journey" ref={stageRef}>
    <button ref={actorRef} tabIndex={-1} className="guide-character" type="button" onClick={(event) => changePanel(true, event.currentTarget)} aria-label={`Talk with ${persona.name}, Ali's portfolio guide. Current section: ${stop}. ${message}`} aria-haspopup="dialog" aria-expanded={panelOpen} title={`Ask ${persona.name}, Ali’s AI guide`}>
      <span className="guide-character-model" aria-hidden="true"><img src={`${basePath}/guide-art/${icon}.webp`} alt="" width="68" height="102" draggable="false" /></span>
      <span className="guide-character-label" aria-hidden="true">Ask {persona.name}</span>
      <span className="guide-callout" aria-hidden="true"><small>{showIntroduction ? `Meet ${persona.name}` : stop}</small><strong>{showIntroduction ? persona.introduction : message}</strong></span>
    </button>
    {messageSlot && createPortal(<div className="guide-inline-message"><div><small>{showIntroduction ? `Meet ${persona.name}` : "Your portfolio guide"}</small><p>{showIntroduction ? persona.introduction : sceneMessages["Choose your perspective"]}</p></div><button type="button" aria-haspopup="dialog" aria-expanded={panelOpen} onClick={(event) => changePanel(true, event.currentTarget)}>Ask {persona.name}</button></div>, messageSlot)}
    <GuideAssistantPanel open={panelOpen} onClose={() => changePanel(false)} icon={icon} name={persona.name} role={role} section={conversationSection} />
  </div>;
}
