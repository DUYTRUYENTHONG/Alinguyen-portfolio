"use client";

import { useEffect } from "react";

// Native fragment navigation owns clicks and Back/Forward. Only correct the
// initial deep link once, after fonts settle, unless the visitor has moved on.
export function SectionAnchorAlign() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    let cancelled = false;
    const cancel = () => { cancelled = true; };
    const events = ["wheel", "touchstart", "pointerdown", "keydown", "hashchange", "popstate"] as const;
    for (const event of events) window.addEventListener(event, cancel, { passive: true });
    document.fonts.ready.then(() => {
      if (cancelled || window.location.hash !== hash) return;
      const section = document.getElementById(hash.slice(1));
      if (!section) return;
      const margin = Number.parseFloat(window.getComputedStyle(section).scrollMarginTop) || 0;
      const difference = section.getBoundingClientRect().top - margin;
      if (Math.abs(difference) > 2) window.scrollBy({ top: difference, behavior: "instant" });
    });
    return () => {
      cancel();
      for (const event of events) window.removeEventListener(event, cancel);
    };
  }, []);
  return null;
}
