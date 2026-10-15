"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Layer = {
  title: string;
  summary: string;
  detail: string;
  examples: string;
  count: number;
  color: string;
};

const brandLayers: Layer[] = [
  { title: "Start a brand", summary: "Give people a clear reason to notice you.", detail: "Define the audience, promise, and proof before buying attention.", examples: "Positioning · audience · offer", count: 1000, color: "#19a5a4" },
  { title: "Develop ideas", summary: "Turn an offer into useful content.", detail: "Test messages and creative ideas against actual customer questions.", examples: "Content themes · message tests", count: 720, color: "#735981" },
  { title: "Launch a project", summary: "Build a path from interest to inquiry.", detail: "Connect a landing page, service information, and a measurable next step.", examples: "Landing page · inquiry path", count: 490, color: "#ee5a48" },
  { title: "Market and learn", summary: "Reach relevant people and find friction.", detail: "Use channel and behavior signals to improve the journey.", examples: "Search · social · analytics", count: 310, color: "#edae45" },
  { title: "Report outcomes", summary: "Make the result understandable.", detail: "Review qualified inquiries, conversion, and revenue evidence together.", examples: "Leads · sales · attribution", count: 190, color: "#dc687b" },
];

const b2bLayers: Layer[] = [
  { title: "Awareness", summary: "Be found with a relevant problem.", detail: "Teach the problem and show where your offer fits, without asking for a decision too early.", examples: "Search articles · short videos", count: 1000, color: "#2099cb" },
  { title: "Interest", summary: "Make the offer easy to understand.", detail: "Give visitors a clear explanation, useful examples, and a path to explore.", examples: "Product pages · explainers", count: 760, color: "#d6734f" },
  { title: "Evaluation", summary: "Help buyers compare with confidence.", detail: "Place proof, scope, and limits close to the claims they support.", examples: "Case studies · comparisons", count: 560, color: "#929596" },
  { title: "Engagement", summary: "Answer the next question quickly.", detail: "Make it easy to request a demonstration or discuss a specific use case.", examples: "Demo · consultation · FAQ", count: 400, color: "#d3ae42" },
  { title: "Purchase", summary: "Make the decision step clear.", detail: "Reduce form friction, explain what happens next, and keep the action easy to reach.", examples: "Proposal · trial · checkout", count: 280, color: "#3bbca8" },
  { title: "Loyalty", summary: "Support the relationship after purchase.", detail: "Give customers help and a reason to return or recommend the service.", examples: "Onboarding · support · follow-up", count: 210, color: "#4997c4" },
];

const journey = [
  { phase: "01 / AWARENESS", name: "Attract", goal: "Help the right people recognize the offer.", practice: "One distinct primary action, simple navigation, and a subtle sense of progress.", principles: "Von Restorff · Tesler · Zeigarnik", cue: "ToFU" },
  { phase: "02 / CONSIDERATION", name: "Build confidence", goal: "Answer questions before asking for commitment.", practice: "Familiar layouts, digestible sections, and proof close to the claim it supports.", principles: "Jakob · Miller · Proximity", cue: "MoFU" },
  { phase: "03 / DECISION", name: "Make action easy", goal: "Turn qualified interest into a useful conversation.", practice: "Large tap targets, prompt feedback, and a direct visual path to the next action.", principles: "Fitts · Doherty · Continuity", cue: "BoFU" },
];

function FunnelDiagram({ id, label, intro, layers }: { id: string; label: string; intro: string; layers: Layer[] }) {
  const ref = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const emphasis = hovered ?? active;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setEntered(true); observer.disconnect(); }
    }, { threshold: .16 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <section ref={ref} className={`funnel-demo${layers.length === 6 ? " is-six" : ""}${entered ? " is-entered" : ""}${active !== null ? " has-selection" : ""}`} aria-labelledby={`${id}-title`}>
    <div className="funnel-demo-heading"><div><p className="eyebrow">Interactive funnel / {layers.length} stages</p><h3 id={`${id}-title`}>{label}</h3><p>{intro}</p></div><span className="funnel-demo-hint">Select a stage to explore <span aria-hidden="true">↘</span></span></div>
    <div className="funnel-demo-grid">
      <div className="funnel-sculpture">
        <div className="funnel-axis" aria-hidden="true" />
        <div className="funnel-particles" aria-hidden="true">{Array.from({ length: 16 }, (_, index) => <i key={index} style={{ "--particle-x": `${(index * 37) % 42 - 21}px`, "--particle-delay": `${(index * 0.23) % 2.7}s`, "--particle-travel": `${[72, 72, 72, 72, 82, 82, 82, 82, 94, 94, 94, 100, 100, 100, 100, 100][index]}%` } as CSSProperties} />)}</div>
        {layers.map((layer, index) => <div key={layer.title} className={`funnel-disc-wrap${emphasis !== null && emphasis !== index ? " is-dimmed" : ""}${emphasis === index ? " is-emphasized" : ""}${active === index ? " is-active" : ""}`} style={{ "--disc-color": layer.color, "--disc-width": `${100 - index * (layers.length === 5 ? 11 : 9)}%`, "--disc-delay": `${index * 150}ms`, "--split": active === null ? "0px" : `${index < active ? -13 : index > active ? 13 : 0}px` } as CSSProperties}>
          <button className="funnel-disc" type="button" aria-label={`Explore stage ${index + 1}: ${layer.title}`} aria-pressed={active === index} aria-controls={`${id}-detail`} onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(index)} onBlur={() => setHovered(null)} onClick={() => setActive(active === index ? null : index)}><span>{String(index + 1).padStart(2, "0")}</span></button>
        </div>)}
      </div>
      <div className="funnel-layer-list">
        {layers.map((layer, index) => <button key={layer.title} type="button" className={`funnel-layer${emphasis !== null && emphasis !== index ? " is-dimmed" : ""}${emphasis === index ? " is-emphasized" : ""}${active === index ? " is-active" : ""}`} style={{ "--disc-color": layer.color, "--disc-delay": `${index * 150}ms` } as CSSProperties} aria-pressed={active === index} aria-controls={`${id}-detail`} onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(index)} onBlur={() => setHovered(null)} onClick={() => setActive(active === index ? null : index)}>
          <span className="funnel-layer-number">{String(index + 1).padStart(2, "0")}</span><span className="funnel-layer-copy"><strong>{layer.title}</strong><small>{layer.summary}</small></span><span className="funnel-layer-arrow" aria-hidden="true">↗</span>
        </button>)}
      </div>
    </div>
    <div id={`${id}-detail`} className={`funnel-detail${active !== null ? " is-open" : ""}`} aria-live="polite">
      {active !== null ? <><div><span>STAGE {String(active + 1).padStart(2, "0")}</span><h4>{layers[active].title}</h4><p>{layers[active].detail}</p><small>{layers[active].examples}</small></div><div className="funnel-detail-metric"><strong>{layers[active].count.toLocaleString()}</strong><span>illustrative people reaching this stage</span><small>{active === 0 ? "Starting sample" : `${Math.round(layers[active].count / layers[active - 1].count * 100)}% of preceding stage`}</small></div></> : <p>Select a stage to see its purpose and a sample progression.</p>}
    </div>
    <p className="funnel-demo-note">The flow and counts are illustrative, not measured customer results.</p>
  </section>;
}

export function FunnelExperience() {
  return <>
    <div className="funnel-journey">{journey.map((item) => <article key={item.cue} className="funnel-journey-card"><span>{item.phase}</span><div><small>{item.cue}</small><h3>{item.name}</h3><p>{item.goal}</p></div><div className="funnel-journey-practice"><p>{item.practice}</p><small>{item.principles}</small></div></article>)}</div>
    <div className="funnel-demos">
      <FunnelDiagram id="brand-funnel" label="From a brand idea to a measurable outcome" intro="Five connected layers, from positioning through reporting. Hover or select a stage to follow the work." layers={brandLayers} />
      <FunnelDiagram id="b2b-funnel" label="The B2B buying journey" intro="Six stages show which kind of content helps a buyer move from first contact to lasting value." layers={b2bLayers} />
    </div>
  </>;
}
