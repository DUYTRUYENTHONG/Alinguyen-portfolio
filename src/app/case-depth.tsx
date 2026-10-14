"use client";

import { type KeyboardEvent, useState } from "react";

export type CaseDetail = {
  context: string;
  decision: string;
  implementation: string;
  evidence: string;
  limits: string;
  next: string;
};

const depths = ["Skim", "Read", "Deep dive"] as const;

export function CaseDepth({ detail }: { detail: CaseDetail }) {
  const [depth, setDepth] = useState<(typeof depths)[number]>("Read");
  const moveTab = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = depths.findIndex((item) => (event.target as HTMLElement).id === `depth-tab-${item.replace(" ", "-")}`);
    if (index < 0) return;
    const next = event.key === "ArrowRight" ? (index + 1) % depths.length : event.key === "ArrowLeft" ? (index + depths.length - 1) % depths.length : event.key === "Home" ? 0 : event.key === "End" ? depths.length - 1 : -1;
    if (next < 0) return;
    event.preventDefault();
    setDepth(depths[next]);
    requestAnimationFrame(() => document.getElementById(`depth-tab-${depths[next].replace(" ", "-")}`)?.focus());
  };
  return <div className="case-depth">
    <div className="depth-tabs" role="tablist" aria-label="Reading depth" onKeyDown={moveTab}>
      {depths.map((item) => <button type="button" key={item} role="tab" id={`depth-tab-${item.replace(" ", "-")}`} tabIndex={depth === item ? 0 : -1} aria-selected={depth === item} aria-controls="depth-panel" onClick={() => setDepth(item)}>{item}</button>)}
    </div>
    <div id="depth-panel" role="tabpanel" aria-labelledby={`depth-tab-${depth.replace(" ", "-")}`}>
      <section><span>01 / CONTEXT</span><h2>The problem</h2><p>{detail.context}</p></section>
      {depth !== "Skim" && <><section><span>02 / THE DECISION</span><h2>What mattered</h2><p>{detail.decision}</p></section><section><span>03 / IMPLEMENTATION</span><h2>What was built</h2><p>{detail.implementation}</p></section></>}
      <section><span>04 / EVIDENCE</span><h2>Where it stands</h2><p>{detail.evidence}</p></section>
      {depth === "Deep dive" && <><section><span>05 / LIMITS</span><h2>What is not yet proven</h2><p>{detail.limits}</p></section><section><span>06 / NEXT STEP</span><h2>What to verify next</h2><p>{detail.next}</p></section></>}
    </div>
  </div>;
}
