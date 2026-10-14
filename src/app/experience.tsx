"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Project } from "@/data/portfolio";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const navItems = [
  { label: "Home", href: "#top" },
  { label: "Highlights", href: "#highlights" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Get in touch", href: "#contact" },
];

export function SiteHeader({ inner = false }: { inner?: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <header className="site-header">
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link className="nav-home" href={inner ? "/#top" : "#top"}>Ali Nguyen</Link>
          {navItems.slice(1).map((item) => <Link key={item.href} href={inner ? `/${item.href}` : item.href}>{item.label}</Link>)}
          <span className="nav-clock">DUYTRUYENTHONG · AI / DATA</span>
        </nav>
        <button className="menu-trigger" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
          <span aria-hidden="true">{open ? "×" : "☰"}</span>
        </button>
      </header>
      {open && <div className="menu-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />}
      <nav id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} aria-label="Mobile navigation" inert={!open}>
        {navItems.map((item) => <Link key={item.href} href={inner ? `/${item.href}` : item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
        <p>ALI NGUYEN · DUYTRUYENTHONG</p>
      </nav>
    </>
  );
}

const focusPhrases = ["customer intelligence", "commerce data systems", "practical AI workflows"];

export function RotatingFocus() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % focusPhrases.length), 3200);
    return () => window.clearInterval(timer);
  }, []);
  return <span className="rotating-focus" aria-live="off">{focusPhrases[index]}</span>;
}

const roles = [
  { label: "Recruiter", icon: "✦", project: "vibecode-kit", tone: "lavender" },
  { label: "Founder", icon: "↗", project: "growth-commerce-os", tone: "peach" },
  { label: "Engineer", icon: "{ }", project: "vibecode-kit", tone: "blue" },
  { label: "Growth", icon: "◎", project: "stos", tone: "yellow" },
  { label: "Data", icon: "▥", project: "kkbox-baseline", tone: "mint" },
  { label: "Just curious", icon: "◌", project: "growth-commerce-os", tone: "pink" },
] as const;

export function VisitorPicker({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const role = roles.find((item) => item.label === selected);
  const recommended = projects.find((project) => project.id === role?.project);

  return (
    <section className="visitor section-shell" aria-labelledby="visitor-title">
      <div className="visitor-heading"><p className="eyebrow">A quick way in</p><h2 id="visitor-title">Hello, who are you?</h2><p>Pick a perspective to find the most relevant work.</p></div>
      <fieldset className="role-grid"><legend className="sr-only">Choose your perspective</legend>
        {roles.map((item) => <label key={item.label} className={`role-card role-${item.tone} ${selected === item.label ? "is-selected" : ""}`}><input type="radio" name="visitor-role" value={item.label} checked={selected === item.label} onChange={() => setSelected(item.label)} /><span className="role-icon" aria-hidden="true">{item.icon}</span><span>{item.label}</span></label>)}
      </fieldset>
      <div className="visitor-result" aria-live="polite">
        {recommended ? <><span>Start here for {selected?.toLowerCase()}</span><a href={`#project-${recommended.id}`}>{recommended.name} <span aria-hidden="true">↗</span></a></> : <span>Your choice changes the recommendation on this page. It is not sent or stored.</span>}
      </div>
    </section>
  );
}

export function ProjectVisual({ id }: { id: string }) {
  if (id === "growth-commerce-os") return <div className="mock-browser mock-growth" role="img" aria-label="Illustration of the Growth Commerce OS service site"><div className="mock-toolbar"><i /><i /><i /><span>growth-commerce-os.vercel.app</span></div><div className="mock-growth-body"><span>DUYTRUYENTHONG</span><strong>Growth Commerce OS</strong><p>Content · Channels · Commerce</p><div className="mock-growth-bars"><i /><i /><i /><i /></div></div></div>;
  if (id === "stos") return <div className="mock-browser mock-stos" role="img" aria-label="STOS logo and an illustration of its sales page, inquiry, and insights workflow"><div className="mock-toolbar"><i /><i /><i /><span>stosvn.vercel.app/stos</span></div><div className="mock-stos-body"><img src={`${basePath}/stos-logo-dark.png`} alt="STOS logo" width="242" height="133" /><strong>A sales page that feels like yours.</strong><div><span>Your page</span><span>Inquiries</span><span>Insights</span></div></div></div>;
  if (id === "vibecode-kit") return <div className="mock-browser mock-terminal" role="img" aria-label="Illustration of the public Vibecode CLI"><div className="mock-toolbar"><i /><i /><i /><span>vibecode-product-kit</span></div><div className="mock-terminal-body"><p><em>$</em> vibecode init</p><p><b>✓</b> plan created</p><p><b>✓</b> evidence recorded</p><p><b>✓</b> quality gates ready</p><span>BUILD → VERIFY → RELEASE</span></div></div>;
  return <div className="mock-browser mock-churn" role="img" aria-label="Illustrative churn feature timeline, not a performance chart"><div className="mock-toolbar"><i /><i /><i /><span>kkbox / local prototype</span></div><div className="mock-churn-body"><span>SNAPSHOT DATE</span><div className="mock-timeline"><i /><i /><i /><i /><i /></div><strong>Past events only</strong><p>Feature construction → holdout evaluation</p><small>Illustration · no measured model score</small></div></div>;
}

export function WorkSection({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(projects[0]?.id);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id.replace("project-", ""));
    }, { rootMargin: "-20% 0px -45% 0px", threshold: [0, 0.1, 0.4] });
    for (const project of projects) {
      const element = document.getElementById(`project-${project.id}`);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [projects]);

  return <section className="work-section" id="work" aria-labelledby="work-title"><div className="section-shell"><div className="section-heading"><p className="eyebrow">Selected work</p><h2 id="work-title">Selected work</h2><p>Four builds across commerce products, developer tooling, and customer data.</p></div><div className="work-layout"><nav className="work-index" aria-label="Jump to project"><p>PROJECTS</p>{projects.map((project, index) => <a key={project.id} className={active === project.id ? "is-active" : ""} href={`#project-${project.id}`} aria-current={active === project.id ? "location" : undefined}><span aria-hidden="true">{["◈", "✦", "▣", "◉"][index]}</span>{project.name.replace("DUYTRUYENTHONG ", "").replace("Codex ", "")}</a>)}</nav><div className="work-cards">{projects.map((project, index) => <article className={`work-card work-card-${index + 1}`} id={`project-${project.id}`} key={project.id}><div className="work-stamp"><strong>{project.status.includes("Live") ? "LIVE" : project.status.includes("Public") ? "PUBLIC" : "PROTOTYPE"}</strong><small>{project.status}</small></div><p className="project-kicker">{["◈", "✦", "▣", "◉"][index]} &nbsp; {project.name}</p><h3>{project.headline}</h3><p className="project-summary">{project.problem}</p><ProjectVisual id={project.id} /><div className="project-proof"><div><strong>{String(index + 1).padStart(2, "0")}</strong><span>{project.proof}</span></div><Link href={`/work/${project.id}`}>Case study <span aria-hidden="true">↗</span></Link></div></article>)}</div></div></div></section>;
}

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };
  return <button className="copy-email" type="button" onClick={copy} aria-label={`Copy email address ${email}`}>{copied ? "Copied ✓" : "Copy email"}</button>;
}
