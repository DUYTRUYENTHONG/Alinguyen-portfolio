"use client";

import { customers } from "@/data/portfolio";
import { useEffect, useRef, useState } from "react";
import { useOnceVisible } from "./use-once-visible";
import styles from "./customer-collaboration-section.module.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function CustomerCollaborationSection() {
  const sectionRef = useOnceVisible<HTMLElement>();
  const railRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const stopSlideRef = useRef<(() => void) | null>(null);
  const [playing, setPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      if (preference.matches) stopSlideRef.current?.();
      setReducedMotion(preference.matches);
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    const carousel = carouselRef.current;
    if (!rail || !carousel || !playing || reducedMotion) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let hovered = carousel.matches(":hover") && window.matchMedia("(hover: hover)").matches;
    let visible = false;
    const stop = () => {
      clearTimeout(timer);
      // Stop an in-progress smooth slide before a visitor interacts with a logo.
      rail.scrollTo({ left: rail.scrollLeft, behavior: "instant" });
    };
    stopSlideRef.current = stop;
    const schedule = () => {
      clearTimeout(timer);
      if (hovered || !visible || document.hidden) return;
      timer = setTimeout(() => {
        const first = rail.querySelector("li");
        if (!first) return;
        const next = first.nextElementSibling;
        const step = next ? next.getBoundingClientRect().left - first.getBoundingClientRect().left : rail.clientWidth;
        const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
        rail.scrollTo({ left: atEnd ? 0 : rail.scrollLeft + step, behavior: "smooth" });
        schedule();
      }, 4000);
    };
    const enter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      hovered = true;
      stop();
    };
    const leave = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      hovered = false;
      schedule();
    };
    const interact = () => {
      stop(); setPlaying(false);
    };
    const pointer = (event: PointerEvent) => { if (event.pointerType !== "mouse") interact(); };
    const focus = (event: FocusEvent) => {
      if (!(event.target instanceof HTMLElement)) return;
      interact();
    };
    const visibility = () => { stop(); schedule(); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
      stop();
      schedule();
    }, { threshold: 0.25 });
    observer.observe(rail);
    carousel.addEventListener("pointerenter", enter);
    carousel.addEventListener("pointerleave", leave);
    carousel.addEventListener("pointerdown", pointer);
    carousel.addEventListener("touchstart", interact, { passive: true });
    carousel.addEventListener("wheel", interact, { passive: true });
    carousel.addEventListener("focusin", focus);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      // Interaction handlers stop the old slide before starting any new one.
      // Cleanup must not cancel the manual scroll started in the same render.
      clearTimeout(timer); stopSlideRef.current = null; observer.disconnect();
      carousel.removeEventListener("pointerenter", enter);
      carousel.removeEventListener("pointerleave", leave);
      carousel.removeEventListener("pointerdown", pointer);
      carousel.removeEventListener("touchstart", interact);
      carousel.removeEventListener("wheel", interact);
      carousel.removeEventListener("focusin", focus);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [playing, reducedMotion]);

  return <section ref={sectionRef} className={styles.section} id="feedback" aria-labelledby="customers-title">
    <div className="section-shell">
      <div className={styles.intro}>
        <p className="eyebrow">Customers &amp; collaborations</p>
        <h2 id="customers-title">Built for real businesses.</h2>
        <p>Customer and collaboration names confirmed by Ali Nguyen. Individual testimonials are not quoted here.</p>
      </div>
      <div ref={carouselRef}>
      <section ref={railRef} className={styles.rail} id="collaboration-logos" aria-label="Customer and collaboration carousel">
      <ul className={styles.grid} aria-label="Customer and collaboration names">
        {customers.map((customer) => {
          const linked = "href" in customer;
          const mark = "logo" in customer
            ? <img src={`${basePath}/${customer.logo}`} alt={linked ? "" : customer.name} width="240" height="110" loading="lazy" decoding="async" />
            : <strong>{customer.name}</strong>;
          return <li className={styles.plaque} key={customer.name}>
            {linked
              ? <a className={styles.surface} href={customer.href} target="_blank" rel="noopener noreferrer" aria-label={`${customer.name} — visit brand website`}>{mark}</a>
              : <div className={styles.surface}>{mark}</div>}
          </li>;
        })}
      </ul>
      </section>
      </div>
    </div>
  </section>;
}
