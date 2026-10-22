"use client";

import { useEffect, useRef } from "react";

export function useGuideDialog(open: boolean) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;

    const viewport = window.visualViewport;
    const body = document.body;
    const root = document.documentElement;
    const scroll = { x: window.scrollX, y: window.scrollY };
    const previous = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    const rootPrevious = { overflow: root.style.overflow, overscrollBehavior: root.style.overscrollBehavior };
    const scrollbar = window.innerWidth - root.clientWidth;
    let frame = 0;

    // Safari's keyboard changes the visual viewport, not necessarily 100dvh.
    const measure = () => {
      dialog.style.setProperty("--guide-viewport-height", `${viewport?.height ?? window.innerHeight}px`);
      dialog.style.setProperty("--guide-viewport-width", `${viewport?.width ?? document.documentElement.clientWidth}px`);
      dialog.style.setProperty("--guide-viewport-top", `${viewport?.offsetTop ?? 0}px`);
      dialog.style.setProperty("--guide-viewport-left", `${viewport?.offsetLeft ?? 0}px`);
      dialog.dataset.compact = String((viewport?.height ?? window.innerHeight) < 480);
      dialog.dataset.short = String((viewport?.height ?? window.innerHeight) < 300);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const keepFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>("a[href], button:not(:disabled), input:not(:disabled), summary"))
        .filter((element) => element.getClientRects().length > 0);
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first && last) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last && first) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    // Lock both scrolling roots without moving deferred sections out of view.
    root.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + scrollbar}px`;
    measure();
    dialog.showModal();
    // Focus the close control first; opening the guide must not summon a phone keyboard.
    dialog.querySelector<HTMLButtonElement>(".guide-assistant-close")?.focus({ preventScroll: true });
    viewport?.addEventListener("resize", schedule);
    viewport?.addEventListener("scroll", schedule);
    window.addEventListener("resize", schedule);
    dialog.addEventListener("keydown", keepFocus);

    return () => {
      cancelAnimationFrame(frame);
      viewport?.removeEventListener("resize", schedule);
      viewport?.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      dialog.removeEventListener("keydown", keepFocus);
      dialog.close();
      Object.assign(body.style, previous);
      Object.assign(root.style, rootPrevious);
      window.scrollTo({ left: scroll.x, top: scroll.y, behavior: "instant" });
    };
  }, [open]);

  return dialogRef;
}
