"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./highlights-section.module.css";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const source = `${basePath}/ai-marketing-highlight-v1.png`;

// Original-artwork clips preserve lettering instead of rebuilding it as effects.
const hud = [
  { name: "ring", x: 342, y: 198, width: 322, height: 310, delay: "1.8s" },
  { name: "inspiration", x: 85, y: 108, width: 310, height: 112, delay: "2.5s" },
  { name: "business", x: 628, y: 112, width: 250, height: 112, delay: "2.7s" },
  { name: "technology", x: 12, y: 287, width: 275, height: 120, delay: "2.9s" },
  { name: "management", x: 85, y: 477, width: 289, height: 115, delay: "3.1s" },
  { name: "strategy", x: 400, y: 552, width: 210, height: 155, delay: "3.3s" },
] as const;
const hudArea = "M0 0H890V250H742V405H665V451H616V730H0Z";

export function HighlightFeatureArt() {
  const id = useId().replace(/:/g, "");
  const artRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState("still");
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.onload = () => setReady(true);
    image.src = source;
    if (image.complete && image.naturalWidth > 0) setReady(true);
    return () => { image.onload = null; };
  }, []);

  useEffect(() => {
    const art = artRef.current;
    if (!art || !("IntersectionObserver" in window)) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let played = false;
    const sync = () => {
      setActive(visible && !document.hidden && !preference.matches);
      if (preference.matches) {
        played = true;
        setPhase("complete");
      } else if (visible && ready && !played) {
        played = true;
        setPhase("running");
      }
    };
    setPhase(preference.matches ? "complete" : "waiting");
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0, rootMargin: "-15% 0px -15% 0px" });
    observer.observe(art);
    preference.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [ready]);

  return <div className={styles.featureArt} ref={artRef} data-reveal={phase} data-active={active}>
    <div className={styles.featurePlane}>
      <svg className={styles.revealArtwork} viewBox="0 0 1402 1122" role="img" aria-label="AI Marketing: a silver robot powering a marketing network with five connected disciplines">
        <defs>
          <radialGradient id={`${id}-background`} cx="100%" cy="0%" r="110%"><stop stopColor="#010a25" /><stop offset=".8" stopColor="#000" /></radialGradient>
          <filter id={`${id}-feather`}><feGaussianBlur stdDeviation="10" /></filter>
          <mask id={`${id}-base`}><rect width="1402" height="1122" fill="white" /><path d={hudArea} fill="black" filter={`url(#${id}-feather)`} /></mask>
          <clipPath id={`${id}-hud`}><path d={hudArea} /></clipPath>
          {hud.map(part => <clipPath id={`${id}-${part.name}`} key={part.name}><rect x={part.x} y={part.y} width={part.width} height={part.height} /></clipPath>)}
        </defs>
        <path d={hudArea} fill={`url(#${id}-background)`} />
        <image href={source} width="1402" height="1122" mask={`url(#${id}-base)`} />
        <g className={styles.revealConnectors} clipPath={`url(#${id}-hud)`} fill="none" stroke="#b0dcff" strokeWidth="3">
          <path d="M407 243 369 206M607 243 649 207M350 348H282M402 463 348 507M505 501V561" />
        </g>
        {hud.map(part => <g className={styles.revealHud} key={part.name} style={{ animationDelay: part.delay }} onAnimationEnd={part.name === "strategy" ? () => setPhase("complete") : undefined}>
          <image href={source} width="1402" height="1122" clipPath={`url(#${id}-${part.name})`} />
        </g>)}
        <g className={styles.revealFinal} clipPath={`url(#${id}-hud)`}><image href={source} width="1402" height="1122" /></g>
        <g className={styles.revealEnergy} fill="none" stroke="#75ceff">
          <path className={styles.revealWire} d="M1090 1020C920 920 1080 810 940 730S805 635 780 510" strokeWidth="5" />
          <g transform="translate(780 510)"><g className={styles.revealSpiral}>
            <path d="M0 0C-18-25 28-46 49-12S36 62-14 56-91 1-60-51 66-115 111-45 111 117 8 135" strokeWidth="4" />
            <circle r="26" strokeWidth="2" /><circle r="65" strokeWidth="1" strokeDasharray="8 18" />
          </g></g>
        </g>
      </svg>
    </div>
  </div>;
}
