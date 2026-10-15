"use client";

import { useEffect, useRef } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function PortraitReveal() {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      if (reducedMotion.matches) {
        element.style.removeProperty("--portrait-reveal-blur");
        return;
      }

      const start = window.innerHeight * 0.9;
      const finish = window.innerHeight * 0.25;
      const progress = Math.max(0, Math.min(1, (start - element.getBoundingClientRect().top) / (start - finish)));
      const blur = Math.round((1 - progress) * 80) / 10;
      element.style.setProperty("--portrait-reveal-blur", `${blur}px`);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    reducedMotion.addEventListener("change", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      reducedMotion.removeEventListener("change", scheduleUpdate);
    };
  }, []);

  return <div className="portrait-stage" ref={stage}>
    <div className="portrait-halo" aria-hidden="true" />
    <img className="portrait-photo" src={`${basePath}/ali-nguyen-portrait-960.webp`} srcSet={`${basePath}/ali-nguyen-portrait-480.webp 480w, ${basePath}/ali-nguyen-portrait-960.webp 960w`} sizes="(max-width: 767px) 380px, 768px" alt="Portrait of Ali Nguyen wearing a black suit" width="1071" height="1468" fetchPriority="high" decoding="sync" />
    <span className="portrait-caption">ALI NGUYEN / DUYTRUYENTHONG</span>
  </div>;
}
