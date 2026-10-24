"use client";

import { customers } from "@/data/portfolio";
import { useEffect, useRef, useState } from "react";
import { useOnceVisible } from "./use-once-visible";
import styles from "./customer-collaboration-section.module.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function CustomerCollaborationSection() {
  const sectionRef = useOnceVisible<HTMLElement>();
  const railRef = useRef<HTMLElement>(null);
  const [range, setRange] = useState({ first: 1, last: 4, atStart: true, atEnd: false });

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const update = () => {
      const cards = Array.from(rail.querySelectorAll("li"));
      const bounds = rail.getBoundingClientRect();
      const visible = cards.flatMap((card, index) => {
        const rect = card.getBoundingClientRect();
        return rect.right > bounds.left + 8 && rect.left < bounds.right - 8 ? [index + 1] : [];
      });
      setRange({ first: visible[0] ?? 1, last: visible.at(-1) ?? customers.length,
        atStart: rail.scrollLeft <= 2, atEnd: rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2 });
    };
    update();
    rail.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(rail);
    return () => { rail.removeEventListener("scroll", update); observer.disconnect(); };
  }, []);

  function move(direction: number) {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return <section ref={sectionRef} className={styles.section} id="feedback" aria-labelledby="customers-title">
    <div className="section-shell">
      <div className={styles.intro}>
        <p className="eyebrow">Customers &amp; collaborations</p>
        <h2 id="customers-title">Built for real businesses.</h2>
        <p>Customer and collaboration names confirmed by Ali Nguyen. Individual testimonials are not quoted here.</p>
      </div>
      <div className={styles.controls}>
        <span>Browse the collection <span className={styles.range}>{range.first}–{range.last} / {customers.length}</span></span>
        <div className={styles.buttons}>
          <button type="button" aria-label="Previous collaborations" aria-controls="collaboration-logos" disabled={range.atStart} onClick={() => move(-1)}>←</button>
          <button type="button" aria-label="Next collaborations" aria-controls="collaboration-logos" disabled={range.atEnd} onClick={() => move(1)}>→</button>
        </div>
      </div>
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
  </section>;
}
