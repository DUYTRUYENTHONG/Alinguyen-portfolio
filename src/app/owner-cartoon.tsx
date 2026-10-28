"use client";

import { useEffect, useRef, useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const arrivalKey = "portfolio-owner-arrival-v1";

export function OwnerCartoon() {
  const image = useRef<HTMLImageElement>(null);
  const started = useRef(false);
  const [phase, setPhase] = useState<"loading" | "first-visit" | "complete" | "returning" | "reduced-motion">("loading");

  const reveal = () => {
    if (started.current) return;
    started.current = true;
    let seen = false;
    try {
      seen = sessionStorage.getItem(arrivalKey) === "seen";
      sessionStorage.setItem(arrivalKey, "seen");
    } catch { /* Without storage, show the greeting once per mount. */ }
    setPhase(seen ? "returning" : matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced-motion" : "first-visit");
  };

  // Covers an image already loaded from cache before the load handler attaches.
  useEffect(() => { if (image.current?.complete && image.current.naturalWidth > 0) reveal(); }, []);

  return <span className={`owner-cartoon-stage${phase === "first-visit" ? " is-arriving" : ""}`} data-arrival={phase}>
    <span className="owner-flight" onAnimationEnd={(event) => {
      if (event.target === event.currentTarget && event.animationName === "owner-flight-in") setPhase("complete");
    }}>
      <span className="owner-boost" aria-hidden="true" />
      <img ref={image} className={`owner-cartoon${phase !== "loading" ? " is-loaded" : ""}`} src={`${basePath}/guide-art/ali-owner.webp`} alt="Cartoon Ali Nguyen waving in a black suit" width="480" height="720" fetchPriority="high" onLoad={reveal} onError={() => setPhase("complete")} draggable="false" />
    </span>
  </span>;
}
