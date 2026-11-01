"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./highlights-section.module.css";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function HighlightFeatureArt() {
  const artRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const art = artRef.current;
    const card = art?.parentElement;
    if (!art || !card) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      art.style.setProperty("--art-x", "0deg");
      art.style.setProperty("--art-y", "0deg");
    };
    const sync = () => { setReduced(preference.matches); reset(); };
    const tilt = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || preference.matches || art.dataset.paused === "true") return;
      cancelAnimationFrame(frame);
      const bounds = card.getBoundingClientRect();
      const x = Math.max(-.5, Math.min(.5, (event.clientX - bounds.left) / bounds.width - .5));
      const y = Math.max(-.5, Math.min(.5, (event.clientY - bounds.top) / bounds.height - .5));
      frame = requestAnimationFrame(() => {
        art.style.setProperty("--art-x", `${-y * 8}deg`);
        art.style.setProperty("--art-y", `${x * 10}deg`);
      });
    };
    sync();
    preference.addEventListener("change", sync);
    card.addEventListener("pointermove", tilt);
    card.addEventListener("pointerleave", reset);
    return () => {
      reset();
      preference.removeEventListener("change", sync);
      card.removeEventListener("pointermove", tilt);
      card.removeEventListener("pointerleave", reset);
    };
  }, []);

  return <>
    <div className={styles.featureArt} ref={artRef} data-paused={paused || reduced}>
      <span className={styles.featureGlow} aria-hidden="true" />
      <span className={styles.featureOrbit} aria-hidden="true" />
      <div className={styles.featurePlane}><img src={`${basePath}/ai-marketing-highlight-v1.png`} alt="AI Marketing illustration: a silver humanoid robot beside a marketing strategy network" width="1402" height="1122" loading="lazy" /></div>
    </div>
    <button className={styles.featureMotion} type="button" disabled={reduced} onClick={() => setPaused(value => !value)} aria-label={reduced ? "Artwork motion reduced" : paused ? "Play AI Marketing artwork motion" : "Pause AI Marketing artwork motion"} title={reduced ? "Reduced motion enabled" : paused ? "Play motion" : "Pause motion"}>{paused || reduced ? "▷" : "Ⅱ"}</button>
  </>;
}
