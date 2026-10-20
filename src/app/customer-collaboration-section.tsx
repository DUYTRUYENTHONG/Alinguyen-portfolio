"use client";

import { customers } from "@/data/portfolio";
import { useOnceVisible } from "./use-once-visible";
import styles from "./customer-collaboration-section.module.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function CustomerCollaborationSection() {
  const sectionRef = useOnceVisible<HTMLElement>();

  return <section ref={sectionRef} className={styles.section} id="feedback" aria-labelledby="customers-title">
    <div className="section-shell">
      <div className={styles.intro}>
        <p className="eyebrow">Customers &amp; collaborations</p>
        <h2 id="customers-title">Built for real businesses.</h2>
        <p>Customer and collaboration names confirmed by Ali Nguyen. Individual testimonials are not quoted here.</p>
      </div>
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
    </div>
  </section>;
}
