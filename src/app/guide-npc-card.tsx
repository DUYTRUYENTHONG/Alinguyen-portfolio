"use client";

import { useState } from "react";
import { guideTourForRole } from "./guide-tour";

export function GuideNpcCard({ name, introduction, icon, role, onClose, onChat }: { name: string; introduction: string; icon: string; role: string; onClose: () => void; onChat: () => void }) {
  const [step, setStep] = useState(-1);
  const stops = guideTourForRole(role);
  const current = stops[step];
  const next = stops[step + 1];
  return <section id="guide-npc-card" className="guide-npc-card" aria-label={`Conversation with ${name}`} onKeyDown={(event) => { if (event.key === "Escape") { event.stopPropagation(); onClose(); } }}>
    <header className="guide-npc-head"><div><small>YOUR PORTFOLIO COMPANION</small><strong>{name} <span>· {role} perspective</span></strong></div><button type="button" onClick={onClose} aria-label="Minimize guide introduction">×</button></header>
    <div className="guide-npc-body">
      <div className="guide-npc-scene" aria-hidden="true"><span className="guide-npc-ground"/><img key={step} data-motion={step < 0 ? "greet" : "point"} src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/guide-art/${icon}.webp`} alt="" width="84" height="126" draggable="false"/></div>
      <div className="guide-npc-speech" aria-live="polite" aria-atomic="true"><small>{current ? `TOUR ${step + 1} / ${stops.length}` : `MEET ${name.toUpperCase()}`}</small><p>{current ? current.message : introduction}</p>{current && <strong>{current.title}</strong>}</div>
    </div>
    <nav className="guide-npc-choices" aria-label="Guide choices">
      {next ? <a className="guide-npc-primary" href={next.href} onClick={(event) => { event.preventDefault(); window.location.hash = next.href; setStep(step + 1); }}>{step < 0 ? "Show me Ali’s work" : `Next: ${next.title}`}</a> : <button type="button" className="guide-npc-primary" onClick={onClose}>Finish tour · keep exploring</button>}
      <button type="button" onClick={onChat}>Ask {name} a question</button>
      {current && <a href={current.href}>Return to this section</a>}
    </nav>
    <p className="guide-npc-note">You choose where we go. AI chat uses public portfolio sources.</p>
  </section>;
}

