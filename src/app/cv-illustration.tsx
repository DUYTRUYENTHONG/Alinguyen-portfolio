"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import styles from "./cv-illustration.module.css";

function Cube({ position, motif }: { position: string; motif: "nodes" | "brackets" | "route" }) {
  return <div className={`${styles.cube} ${styles[position]}`}>
    <span className={styles.front}>
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false">
        {motif === "nodes" && <><path d="m16 40 16-21 16 21M16 40h32" /><circle cx="16" cy="40" r="4" /><circle cx="32" cy="19" r="4" /><circle cx="48" cy="40" r="4" /></>}
        {motif === "brackets" && <><path d="M23 18h-8v28h8m18-28h8v28h-8M27 27h10m-10 10h10" /><circle cx="32" cy="50" r="1.5" /></>}
        {motif === "route" && <><rect x="9" y="26" width="12" height="12" rx="2" /><rect x="43" y="26" width="12" height="12" rx="2" /><path d="M21 32h22m-13-6 6 6-6 6" /></>}
      </svg>
    </span>
    <span className={styles.right} /><span className={styles.top} />
    <span className={styles.cubeBase} />
  </div>;
}

function EngineeringSculpture({ prompt }: { prompt: boolean }) {
  return <div className={`${styles.engineering} ${prompt ? styles.prompt : ""}`}>
    <span className={styles.floor} />
    <svg className={styles.connections} viewBox="0 0 240 176" fill="none" aria-hidden="true" focusable="false"><path d="M43 118h49l30-71 42 83h37" /><circle cx="43" cy="118" r="3" /><circle cx="201" cy="130" r="3" /><path d="M18 63h30l17 20m139-52h-29l-17 19" /></svg>
    <Cube position="cubeLeft" motif={prompt ? "brackets" : "nodes"} />
    <Cube position="cubeRight" motif="route" />
    <Cube position="cubeUpper" motif={prompt ? "nodes" : "brackets"} />
  </div>;
}

function ProductSculpture() {
  return <div className={styles.product}>
    <span className={styles.productFloor} />
    <svg className={styles.handBack} viewBox="0 0 240 130" aria-hidden="true" focusable="false"><path d="m14 91 28-33c12-14 24-18 43-12l39 12c14 4 16 16 5 20l-31-2 47 4 55-28c20-11 31 6 15 18l-55 40c-9 6-21 9-34 7l-48-7-27 15Z" /></svg>
    <svg className={styles.hand} viewBox="0 0 240 130" aria-hidden="true" focusable="false"><path d="m14 91 28-33c12-14 24-18 43-12l39 12c14 4 16 16 5 20l-31-2 47 4 55-28c20-11 31 6 15 18l-55 40c-9 6-21 9-34 7l-48-7-27 15Z" fill="#ffd1bd" /><path d="m9 91 22-24 36 38-21 22Z" fill="#4caef0" /><path d="m80 75 39 7c14 3 24 3 35-2" fill="none" /></svg>
    <svg className={styles.bulb} viewBox="0 0 110 140" aria-hidden="true" focusable="false">
      <path d="M56 8C12 8 4 58 24 80l12 18h38l13-22c19-30 2-68-31-68Z" fill="#ffe03d" />
      <path d="M56 8C27 8 12 28 12 53h22c-4 15 13 20 18 8h4Z" fill="#c5f130" />
      <path d="M12 53h22c-4 15 13 20 18 8h4v17c14-9 23 12 6 16h-6v4H36L24 80c-7-8-11-18-12-27Z" fill="#4caef0" />
      <path d="M36 98h38v17H36Zm5 17h28v10H41Z" fill="#9693cd" /><path d="M48 125h14v7H48Z" fill="#6d6b9a" />
      <path d="M55 1V-3M9 17l-5-6m-2 43h-8m104-33 6-6" fill="none" />
    </svg>
    <span className={styles.productTile}><i /></span>
    <svg className={styles.productArrow} viewBox="0 0 20 40" fill="none" aria-hidden="true" focusable="false"><path d="M10 36V5M3 12l7-7 7 7" /></svg>
  </div>;
}

/** Decorative, progressively enhanced art. No text or download control is transformed. */
export function CvIllustration({ kind }: { kind: number }) {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const reset = () => {
    cancelAnimationFrame(frame.current);
    root.current?.style.removeProperty("--tilt-x");
    root.current?.style.removeProperty("--tilt-y");
  };
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => {
      cancelAnimationFrame(frame.current);
      root.current?.style.removeProperty("--tilt-x");
      root.current?.style.removeProperty("--tilt-y");
    };
    reduced.addEventListener("change", stop);
    document.addEventListener("visibilitychange", stop);
    return () => {
      stop();
      reduced.removeEventListener("change", stop);
      document.removeEventListener("visibilitychange", stop);
    };
  }, []);
  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-3, Math.min(3, (event.clientX - box.left - box.width / 2) / box.width * 6));
    const y = Math.max(-3, Math.min(3, (box.height / 2 - event.clientY + box.top) / box.height * 6));
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      root.current?.style.setProperty("--tilt-x", `${y}deg`);
      root.current?.style.setProperty("--tilt-y", `${x}deg`);
    });
  };
  return <div ref={root} className={`${styles.stage} ${kind === 2 ? styles.businessStage : styles.aiStage}`} aria-hidden="true" onPointerMove={tilt} onPointerLeave={reset}>
    <div className={styles.perspective}><div className={styles.scene}>
      {kind === 2 ? <ProductSculpture /> : <EngineeringSculpture prompt={kind === 3} />}
    </div></div>
  </div>;
}
