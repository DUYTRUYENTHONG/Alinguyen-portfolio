"use client";

import { useEffect, useState } from "react";
import styles from "./intro.module.css";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const symbols = [
  { label: "AI", path: "M9 3a3 3 0 0 0-3 3 4 4 0 0 0-2 7 4 4 0 0 0 5 6h2V5a2 2 0 0 0-2-2Zm6 0a3 3 0 0 1 3 3 4 4 0 0 1 2 7 4 4 0 0 1-5 6h-2V5a2 2 0 0 1 2-2ZM7 9h4m2 5h4" },
  { label: "ANALYTICS", path: "M4 4v16h16M8 16v-4m5 4V8m5 8V5" },
  { label: "MARKETING", path: "m4 10 13-5v14L4 14v-4Zm13 0h3v4h-3M7 15l2 6h3l-2-5" },
  { label: "DATA", path: "M5 6c0-4 14-4 14 0s-14 4-14 0Zm0 0v12c0 4 14 4 14 0V6M5 12c0 4 14 4 14 0" },
  { label: "WORKFLOWS", path: "M3 3h6v6H3Zm12 12h6v6h-6ZM9 6h6a3 3 0 0 1 3 3v6M6 9v6a3 3 0 0 0 3 3h6" },
  { label: "GROWTH", path: "M3 18 9 12l4 4 8-11m-6 0h6v6" },
] as const;

export function IntroBackground() {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(preference.matches);
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);

  return <>
    <div className={styles.background} data-paused={paused || reduced} aria-hidden="true">
      <img className={styles.backdrop} src={`${basePath}/preview-ai-marketing-bg.png`} alt="" width="1733" height="907" />
      <div className={styles.grid} />
      <div className={styles.network} />
      {symbols.map(symbol => <div className={styles.node} key={symbol.label}>
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d={symbol.path} /></svg>
        <span>{symbol.label}</span>
      </div>)}
    </div>
    <button className={styles.motionControl} type="button" disabled={reduced} onClick={() => setPaused(value => !value)}>
      <span aria-hidden="true">{paused || reduced ? "▷" : "Ⅱ"}</span>
      {reduced ? "Motion reduced" : paused ? "Play background motion" : "Pause background motion"}
    </button>
  </>;
}
