"use client";

import { useEffect } from "react";

const alignedIds = new Set(["visitor", "highlights", "work", "ai-expertise", "funnel", "feedback", "about", "cvs", "contact"]);
const shouldAlign = (id: string) => alignedIds.has(id) || id.startsWith("project-");

export function SectionAnchorAlign() {
  useEffect(() => {
    let frame = 0;
    let settleFrame = 0;
    let stopWatching = 0;
    let active = true;
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => schedule());
    const align = () => {
      const id = window.location.hash.slice(1);
      if (!shouldAlign(id)) return;
      const section = document.getElementById(id);
      if (!section) return;
      const margin = Number.parseFloat(window.getComputedStyle(section).scrollMarginTop) || 0;
      const difference = section.getBoundingClientRect().top - margin;
      if (Math.abs(difference) > 2) window.scrollTo({ top: window.scrollY + difference, behavior: "instant" });
    };
    const schedule = () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(settleFrame);
      frame = window.requestAnimationFrame(() => { settleFrame = window.requestAnimationFrame(align); });
    };
    const watch = () => {
      if (!active) return;
      observer?.disconnect();
      window.clearTimeout(stopWatching);
      if (!shouldAlign(window.location.hash.slice(1))) return;
      schedule();
      const main = document.querySelector("main");
      if (main) observer?.observe(main);
      stopWatching = window.setTimeout(() => observer?.disconnect(), 2500);
    };
    watch();
    window.addEventListener("hashchange", watch);
    window.addEventListener("load", watch);
    document.fonts.ready.then(watch);
    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(settleFrame);
      window.clearTimeout(stopWatching);
      observer?.disconnect();
      window.removeEventListener("hashchange", watch);
      window.removeEventListener("load", watch);
    };
  }, []);
  return null;
}
