"use client";

import { useEffect } from "react";
import { startAtHeader } from "./guide-entry-policy";

// Native fragment navigation owns clicks and Back/Forward. Only correct the
// initial deep link once, after fonts settle, unless the visitor has moved on.
export function SectionAnchorAlign() {
  useEffect(() => {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const sameSiteReferrer = Boolean(document.referrer && new URL(document.referrer).origin === window.location.origin);
    let freshVisit = true;
    try {
      freshVisit = sessionStorage.getItem("portfolio-home-visited-v1") !== "seen";
      sessionStorage.setItem("portfolio-home-visited-v1", "seen");
    } catch { /* A first-load greeting remains available without storage. */ }
    const resetToHeader = startAtHeader(window.location.hash, navigation?.type ?? "navigate", sameSiteReferrer, freshVisit);
    const previousRestoration = window.history.scrollRestoration;
    if (resetToHeader) {
      window.history.scrollRestoration = "manual";
      if (window.location.hash !== "#top") window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}#top`);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    const hash = window.location.hash;
    if (navigation?.type === "back_forward") return;
    let cancelled = false;
    const cancel = () => { cancelled = true; window.history.scrollRestoration = previousRestoration; };
    const events = ["wheel", "touchstart", "pointerdown", "keydown", "hashchange", "popstate"] as const;
    for (const event of events) window.addEventListener(event, cancel, { passive: true });
    document.fonts.ready.then(() => {
      if (cancelled || window.location.hash !== hash) return;
      if (resetToHeader) { window.scrollTo({ top: 0, behavior: "instant" }); window.history.scrollRestoration = previousRestoration; return; }
      const section = document.getElementById(hash.slice(1));
      if (!section) return;
      const margin = Number.parseFloat(window.getComputedStyle(section).scrollMarginTop) || 0;
      const difference = section.getBoundingClientRect().top - margin;
      if (Math.abs(difference) > 2) window.scrollBy({ top: difference, behavior: "instant" });
    });
    return () => {
      cancel();
      window.history.scrollRestoration = previousRestoration;
      for (const event of events) window.removeEventListener(event, cancel);
    };
  }, []);
  return null;
}
