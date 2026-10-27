"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import type { TourGuide } from "@/lib/tour-guide";
import { GuideAssistantPanel } from "./guide-assistant-panel";

// Load WebGL only after an asset has explicitly been configured. The existing
// accessible guide stays mounted until the real model passes validation.
export function RiggedPortfolioGuide({ modelUrl, icon, role, fallback }: { modelUrl: string; icon: string; role: string; fallback: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const guideRef = useRef<TourGuide | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    const fail = () => { guideRef.current?.destroy(); guideRef.current = null; setReady(false); setOpen(false); };
    void import("@/lib/tour-guide").then(({ createTourGuide }) => createTourGuide({
      modelUrl, name: "Ali's guide", signal: controller.signal,
      onAsk: (trigger) => { triggerRef.current = trigger; guideRef.current?.setSuspended(true); setOpen(true); },
      onError: fail,
    })).then((guide) => {
      if (controller.signal.aborted) { guide.destroy(); return; }
      guideRef.current = guide;
      setReady(true);
      guide.open({ title: "Your portfolio guide", text: "Explore Ali’s projects and CVs, or ask me about the work.", actions: [
        { label: "Show projects", onClick: () => document.getElementById("work")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }) },
        { label: "Choose a CV", onClick: () => document.getElementById("cvs")?.scrollIntoView({ behavior: "instant" }) },
      ] });
    }).catch(() => { if (!controller.signal.aborted) fail(); });
    return () => { controller.abort(); guideRef.current?.destroy(); guideRef.current = null; };
  }, [modelUrl]);
  return <>
    {!ready && fallback}
    {ready && <GuideAssistantPanel open={open} onClose={() => {
      setOpen(false); guideRef.current?.setSuspended(false);
      requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
    }} icon={icon} name="Ali's guide" role={role} section="Explore the portfolio" />}
  </>;
}
