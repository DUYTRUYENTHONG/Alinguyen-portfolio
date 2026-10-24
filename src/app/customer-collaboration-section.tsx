"use client";

import { customers } from "@/data/portfolio";
import { useEffect, useRef, useState } from "react";
import styles from "./customer-collaboration-section.module.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const logoCustomers = customers.filter((customer) => "logo" in customer);

export function CustomerCollaborationSection() {
  const railRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const [touching, setTouching] = useState(false);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let visible = false;
    const update = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(rail);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);

  const renderLogos = (duplicate: boolean) => logoCustomers.map((customer) => {
    const linked = "href" in customer;
    const mark = <img src={`${basePath}/${customer.logo}`} alt={duplicate || linked ? "" : customer.name} width="240" height="110" loading="lazy" decoding="async" />;
    return <li className={styles.logo} key={customer.name}>
      {linked
        ? <a href={customer.href} target="_blank" rel="noopener noreferrer" aria-label={`${customer.name} — visit brand website`} tabIndex={duplicate ? -1 : undefined}>{mark}</a>
        : <span>{mark}</span>}
    </li>;
  });

  return <section className={styles.section} id="feedback" aria-labelledby="customers-title">
    <div className="section-shell">
      <div className={styles.intro}>
        <p className="eyebrow">Customers &amp; collaborations</p>
        <h2 id="customers-title">Built for real businesses.</h2>
        <p>Customer and collaboration names confirmed by Ali Nguyen. Individual testimonials are not quoted here.</p>
      </div>
      <section ref={railRef} className={styles.rail} id="collaboration-logos" aria-label="Customer and collaboration logos" data-active={active} data-touching={touching}
        onPointerDown={(event) => { if (event.pointerType !== "mouse") setTouching(true); }}
        onPointerUp={() => setTouching(false)} onPointerCancel={() => setTouching(false)} onPointerLeave={() => setTouching(false)}
        onBlur={(event) => {
          const rail = event.currentTarget;
          if (rail.contains(event.relatedTarget)) return;
          const track = rail.firstElementChild;
          const animation = track?.getAnimations()[0];
          const width = track?.firstElementChild?.getBoundingClientRect().width;
          const duration = Number(animation?.effect?.getComputedTiming().duration);
          // Native focus scrolling must join the loop without leaving an empty tail.
          if (animation && typeof animation.currentTime === "number" && width && duration) {
            animation.currentTime = (animation.currentTime + rail.scrollLeft / width * duration) % duration;
            rail.scrollLeft = 0;
          }
        }}>
        <div className={styles.track}>
          <ul className={styles.group} aria-label="Customer and collaboration names">{renderLogos(false)}</ul>
          <ul className={`${styles.group} ${styles.duplicate}`} aria-hidden="true" inert>{renderLogos(true)}</ul>
        </div>
      </section>
    </div>
  </section>;
}
