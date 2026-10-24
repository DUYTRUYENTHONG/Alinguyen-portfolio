"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Project } from "@/data/portfolio";
import { GuideCharacter } from "./guide-character";
import { VisitorStats } from "./visitor-stats";
import { PortfolioLink as Link } from "./portfolio-link";
import { WorkingHours } from "./working-hours";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
type EntryAudience = "general" | "recruiter" | "engineering" | "commerce" | "data" | "admissions";
const RoleContext = createContext<{ selected: string; chosen: boolean; entry: EntryAudience; ready: boolean; setSelected: (role: string) => void } | null>(null);

const entryRoles: Record<string, { role: string; entry: EntryAudience }> = {
  recruiter: { role: "Recruiter", entry: "recruiter" },
  engineering: { role: "Engineer", entry: "engineering" },
  founder: { role: "Founder", entry: "commerce" },
  commerce: { role: "Founder", entry: "commerce" },
  data: { role: "Data", entry: "data" },
  admissions: { role: "Student", entry: "admissions" },
};

export function PortfolioExperienceProvider({ children }: { children: ReactNode }) {
  const [selected, setSelectedState] = useState("Recruiter");
  const [chosen, setChosen] = useState(false);
  const [entry, setEntry] = useState<EntryAudience>("general");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const requested = entryRoles[new URLSearchParams(window.location.search).get("for")?.toLowerCase() ?? ""];
    let saved: string | null = null;
    try { saved = window.sessionStorage.getItem("portfolio-visitor-role"); } catch { /* Perspective remains optional without storage. */ }
    if (requested) {
      setSelectedState(requested.role);
      setEntry(requested.entry);
    } else if (saved && roles.some((role) => role.label === saved)) {
      setSelectedState(saved);
      setChosen(true);
    } else {
      const referrer = document.referrer;
      if (/^https?:\/\/([^/]+\.)?github\.com\//i.test(referrer)) setEntry("engineering");
      else if (/^https?:\/\/([^/]+\.)?linkedin\.com\//i.test(referrer)) setEntry("recruiter");
    }
    setReady(true);
  }, []);
  const setSelected = (role: string) => {
    setSelectedState(role);
    setChosen(true);
    try { window.sessionStorage.setItem("portfolio-visitor-role", role); } catch { /* Keep the in-tab choice. */ }
    const url = new URL(window.location.href);
    if (url.searchParams.has("for")) {
      url.searchParams.delete("for");
      window.history.replaceState(null, "", url);
    }
  };
  return <RoleContext.Provider value={{ selected, chosen, entry, ready, setSelected }}>{children}</RoleContext.Provider>;
}

export function usePortfolioRole() {
  const context = useContext(RoleContext);
  if (!context) throw new Error("Portfolio role provider is missing");
  return context;
}

const navItems = [
  { label: "Home", href: "#top" },
  { label: "Highlights", href: "#highlights" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Download CVs", href: "#cvs" },
  { label: "Get in touch", href: "#contact" },
];

export function SiteHeader({ inner = false }: { inner?: boolean }) {
  const pathname = usePathname();
  const activePage = pathname.startsWith("/work") ? "/work" : pathname.startsWith("/about") ? "/about" : "#top";
  const navHref = (href: string) => href.startsWith("#") && inner ? `/${href}` : href;
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuPanel = useRef<HTMLDivElement>(null);

  useEffect(() => setReady(true), []);

  useEffect(() => {
    if (!window.location.hash && pathname !== "/") window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    lastScroll.current = window.scrollY;
    const onScroll = () => {
      const current = window.scrollY;
      setCompact(current > 80);
      if (current <= 80 || open) {
        setHidden(false);
        lastScroll.current = current;
      } else if (current > lastScroll.current + 8) {
        if (current > 120) setHidden(true);
        lastScroll.current = current;
      } else if (current < lastScroll.current - 8) {
        setHidden(false);
        lastScroll.current = current;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuPanel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const focusable = Array.from(menuPanel.current?.querySelectorAll<HTMLElement>("a, button:not(:disabled)") ?? []);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => { window.removeEventListener("keydown", onKeyDown); document.body.style.overflow = previousOverflow; menuButton.current?.focus(); };
  }, [open]);

  return (
    <>
      <header className={`site-header ${compact ? "is-compact" : ""} ${hidden && !open ? "is-hidden" : ""}`}>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link className={activePage === "#top" ? "nav-active" : ""} href={navHref("#top")}><span>Ali Nguyen</span></Link>
          {navItems.slice(1).map((item) => <Link className={activePage === item.href ? "nav-active" : ""} key={item.href} href={navHref(item.href)}><span>{item.label}</span></Link>)}
          <WorkingHours variant="header" />
        </nav>
        <button ref={menuButton} className="menu-trigger" type="button" disabled={!ready} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
          <span className="menu-glyph" aria-hidden="true"><i /><i /><i /></span>
        </button>
      </header>
      <div className={`menu-backdrop ${open ? "is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <div ref={menuPanel} id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu" inert={!open}>
        <nav aria-label="Mobile navigation">{navItems.map((item) => <Link key={item.href} href={navHref(item.href)} onClick={() => setOpen(false)}>{item.label}</Link>)}</nav>
        <WorkingHours variant="menu" />
        <p>ALI NGUYEN · DUYTRUYENTHONG</p>
      </div>
    </>
  );
}

const focusPhrases = ["applied AI prototypes", "developer tools", "commerce products"];

export function RotatingFocus() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer = 0;
    let current = 0;
    const settle = () => { window.clearTimeout(timer); setIndex(0); };
    const advance = () => {
      if (preference.matches || document.hidden) return;
      current += 1;
      setIndex(current);
      if (current < focusPhrases.length - 1) timer = window.setTimeout(advance, 2200);
    };
    if (!preference.matches) timer = window.setTimeout(advance, 2200);
    preference.addEventListener("change", settle);
    document.addEventListener("visibilitychange", settle);
    return () => {
      window.clearTimeout(timer);
      preference.removeEventListener("change", settle);
      document.removeEventListener("visibilitychange", settle);
    };
  }, []);
  return <span className="rotating-focus" aria-live="off">{focusPhrases[index]}</span>;
}

const roles = [
  { label: "Recruiter", icon: "recruiter", description: "Looks for the fit", project: "vibecode-kit", tone: "blue" },
  { label: "Founder", icon: "founder", description: "Builds the business", project: "growth-commerce-os", tone: "lavender" },
  { label: "Engineer", icon: "engineer", description: "Writes the code", project: "vibecode-kit", tone: "peach" },
  { label: "Product designer", icon: "designer", description: "Shapes the experience", project: "stos", tone: "mint" },
  { label: "Marketer", icon: "marketer", description: "Finds the audience", project: "growth-commerce-os", tone: "pink" },
  { label: "Growth", icon: "growth", description: "Connects the funnel", project: "stos", tone: "yellow" },
  { label: "Data", icon: "data", description: "Reads the signals", project: "kkbox-baseline", tone: "mint" },
  { label: "Investor", icon: "investor", description: "Looks at the model", project: "stos", tone: "blue" },
  { label: "Student", icon: "student", description: "Learns the craft", project: "kkbox-baseline", tone: "lavender" },
  { label: "Fellow builder", icon: "builder", description: "Ships with teams", project: "vibecode-kit", tone: "pink" },
  { label: "Just curious", icon: "curious", description: "Explores the work", project: "growth-commerce-os", tone: "peach" },
] as const;

export function PortfolioGuide() {
  const { selected, chosen, ready } = usePortfolioRole();
  const role = roles.find((item) => item.label === selected) ?? roles[0];
  if (!ready) return null;
  return <GuideCharacter icon={role.icon} role={selected} chosen={chosen} />;
}

export function VisitorPicker({ projects }: { projects: Project[] }) {
  const { selected, chosen, ready, setSelected } = usePortfolioRole();
  const role = roles.find((item) => item.label === selected) ?? roles[0];
  const recommended = projects.find((project) => project.id === role?.project);

  return (
    <section className="visitor section-shell" id="visitor" aria-labelledby="visitor-title">
      <div className="visitor-heading"><h2 id="visitor-title">Hello stranger,<span className="visitor-heading-tail"> who are you?</span></h2></div>
      <p className="visitor-optional">Optional: choose a perspective to prioritize relevant projects. All work and CVs are available without choosing.</p>
      <div id="visitor-guide-message" className="visitor-guide-message" />
      <fieldset className="role-grid"><legend className="sr-only">Choose your perspective</legend>
        {roles.map((item) => <RoleTile key={item.label} item={item} selected={chosen ? selected : null} onSelect={setSelected} />)}
      </fieldset>
      {ready && <VisitorStats role={chosen ? selected : null} />}
      <div className="visitor-result" aria-live="polite">
        {recommended && <><span>{chosen ? `RECOMMENDED FOR ${selected.toUpperCase()}` : "A PROJECT TO EXPLORE"}</span><a href={`#project-${recommended.id}`}>{recommended.name} <span aria-hidden="true">↗</span></a></>}
      </div>
    </section>
  );
}

function RoleTile({ item, selected, onSelect }: { item: (typeof roles)[number]; selected: string | null; onSelect: (role: string) => void }) {
  const active = selected === item.label;
  return <div className={`role-cell ${active ? "is-selected" : ""}`}>
    <label className={`role-card role-${item.tone} ${active ? "is-selected" : ""}`}>
      <input type="radio" name="visitor-role" value={item.label} checked={active} onChange={() => onSelect(item.label)} />
      <span className="role-icon" aria-hidden="true"><img src={`${basePath}/role-art/${item.icon}.webp`} alt="" width="362" height="362" loading="lazy" /></span>
      <span className="role-card-copy">{active && <small>THAT&apos;S YOU</small>}<strong>{item.label}</strong>{active && <em>{item.description}</em>}</span>
    </label>
  </div>;
}

const statement = "I turn business needs and messy data into useful digital products — connecting applied AI, engineering, and commerce workflows.";
const statementWords = statement.split(" ");

export function ScrollStatement() {
  const section = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.current?.getBoundingClientRect();
      if (!rect) return;
      setProgress(Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight)));
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (frame) window.cancelAnimationFrame(frame); };
  }, []);

  return <section ref={section} className="statement" aria-label="What I do">
    <h2 id="statement-title" className="statement-copy"><span className="sr-only">{statement}</span><span aria-hidden="true">{statementWords.map((word, index) => {
      const reveal = Math.max(0, Math.min(1, ((progress - 0.25) * 40 - index) / 6.5));
      return <span className="statement-word" style={{ opacity: 0.18 + 0.82 * reveal }} key={`${word}-${index}`}>{word}{index < statementWords.length - 1 ? " " : ""}</span>;
    })}</span></h2>
  </section>;
}

export function ProjectVisual({ id }: { id: string }) {
  const covers: Record<string, { file: string; alt: string; width: number; height: number }> = {
    "growth-commerce-os": { file: "duytruyenthong-site-2026-preview.webp", alt: "DUYTRUYENTHONG service homepage", width: 1100, height: 524 },
    stos: { file: "stos-home-desktop-2026-preview.webp", alt: "STOS sales page homepage", width: 1100, height: 880 },
    "cho-kenh": { file: "cho-kenh-home-2026-preview.webp", alt: "Chợ Kênh TikTok channel marketplace homepage", width: 1100, height: 543 },
  };
  const cover = covers[id];
  if (cover) return <div className={`project-screenshot project-screenshot-${id}`}><img src={`${basePath}/${cover.file}`} alt={cover.alt} width={cover.width} height={cover.height} loading="lazy" decoding="async" /></div>;
  if (id === "growth-commerce-os") return <div className="mock-browser mock-growth" role="img" aria-label="DUYTRUYENTHONG logo in an illustration of the Growth Commerce OS service site"><div className="mock-toolbar"><i /><i /><i /><span>growth-commerce-os.vercel.app</span></div><div className="mock-growth-body"><div className="mock-growth-brand"><img src={`${basePath}/duytruyenthong-logo.png`} alt="" width="92" height="92" /><span>DUYTRUYENTHONG</span></div><strong>Growth Commerce OS</strong><p>Content · Channels · Commerce</p><div className="mock-growth-bars"><i /><i /><i /><i /></div></div></div>;
  if (id === "stos") return <div className="mock-browser mock-stos" role="img" aria-label="STOS logo and an illustration of its sales page, inquiry, and insights workflow"><div className="mock-toolbar"><i /><i /><i /><span>stosvn.vercel.app/stos</span></div><div className="mock-stos-body"><img src={`${basePath}/stos-logo-dark.png`} alt="STOS logo" width="242" height="133" /><strong>A sales page that feels like yours.</strong><div><span>Your page</span><span>Inquiries</span><span>Insights</span></div></div></div>;
  if (id === "cho-kenh") return <div className="mock-browser mock-cho-kenh" role="img" aria-label="Chợ Kênh logo and an illustration of its TikTok channel catalog and inquiry workflow"><div className="mock-toolbar"><i /><i /><i /><span>growth-commerce-os.vercel.app/cho-kenh</span></div><div className="mock-cho-kenh-body"><div className="mock-market-hero"><img src={`${basePath}/cho-kenh-logo.png`} alt="" width="104" height="80" /><div><small>CHỢ KÊNH</small><strong>Find the right TikTok channel.</strong><p>Compare listings. Ask for a manual deal review.</p></div></div><div className="mock-market-list"><span>Channel catalog</span><span>Audit &amp; risk</span><span>Zalo inquiry</span></div><small className="mock-market-next">AI tools &amp; courses · coming soon</small></div></div>;
  if (id === "vibecode-kit") return <div className="mock-browser mock-terminal" role="img" aria-label="Illustration of the public Vibecode CLI"><div className="mock-toolbar"><i /><i /><i /><span>vibecode-product-kit</span></div><div className="mock-terminal-body"><p><em>$</em> vibecode init</p><p><b>✓</b> plan created</p><p><b>✓</b> evidence recorded</p><p><b>✓</b> quality gates ready</p><span>BUILD → VERIFY → RELEASE</span></div></div>;
  return <div className="mock-browser mock-churn" role="img" aria-label="Conceptual KKBox timeline: earlier events inform features; later events are excluded at the snapshot boundary. Measured results are in the case study."><div className="mock-toolbar"><i /><i /><i /><span>kkbox / local baseline</span></div><div className="mock-churn-body"><span>EVENTS OVER TIME</span><div className="mock-timeline"><div className="mock-past-events"><i /><i /><i /></div><span className="mock-cutoff">Snapshot</span><div className="mock-future-events"><i /><i /></div></div><strong>Past events only</strong><p>Feature construction → holdout evaluation</p><small>Conceptual diagram · measured results in case study</small></div></div>;
}

const projectEmojiCodes: Record<string, string> = { "growth-commerce-os": "1f4c8", stos: "1f3af", "cho-kenh": "1f6d2", "vibecode-kit": "1f6e0", "kkbox-baseline": "1f4ca" };
function ProjectEmoji({ id }: { id: string }) {
  return <img className="project-emoji" src={`${basePath}/emoji/${projectEmojiCodes[id]}.svg`} alt="" width="24" height="24" loading="lazy" />;
}

export function WorkSection({ projects }: { projects: Project[] }) {
  const { selected, chosen } = usePortfolioRole();
  const rolePriorities: Record<string, string[]> = {
    Recruiter: ["vibecode-kit", "growth-commerce-os", "stos", "cho-kenh", "kkbox-baseline"],
    Founder: ["growth-commerce-os", "stos", "cho-kenh", "vibecode-kit", "kkbox-baseline"],
    Engineer: ["vibecode-kit", "kkbox-baseline", "stos", "growth-commerce-os", "cho-kenh"],
    "Product designer": ["stos", "cho-kenh", "growth-commerce-os", "vibecode-kit", "kkbox-baseline"],
    Marketer: ["growth-commerce-os", "cho-kenh", "stos", "kkbox-baseline", "vibecode-kit"],
    Growth: ["growth-commerce-os", "stos", "cho-kenh", "kkbox-baseline", "vibecode-kit"],
    Data: ["kkbox-baseline", "growth-commerce-os", "cho-kenh", "stos", "vibecode-kit"],
    Investor: ["stos", "growth-commerce-os", "cho-kenh", "vibecode-kit", "kkbox-baseline"],
    Student: ["kkbox-baseline", "vibecode-kit", "growth-commerce-os", "stos", "cho-kenh"],
    "Fellow builder": ["vibecode-kit", "stos", "cho-kenh", "growth-commerce-os", "kkbox-baseline"],
    "Just curious": ["growth-commerce-os", "stos", "cho-kenh", "vibecode-kit", "kkbox-baseline"],
  };
  const priority = rolePriorities[selected] ?? rolePriorities.Recruiter;
  const orderedProjects = [...projects].sort((a, b) => priority.indexOf(a.id) - priority.indexOf(b.id));
  const [active, setActive] = useState(orderedProjects[0]?.id);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id.replace("project-", ""));
    }, { rootMargin: "-20% 0px -45% 0px", threshold: [0, 0.1, 0.4] });
    for (const project of orderedProjects) {
      const element = document.getElementById(`project-${project.id}`);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [projects, selected]);

  return <section className="work-section" id="work" aria-labelledby="work-title"><div className="section-shell"><div className="work-heading"><h2 id="work-title">Selected work</h2><div><a className="work-role-chip" href="#visitor">{chosen ? `You: ${selected}` : "Optional perspective"} · <span>{chosen ? "change" : "choose"}</span></a><p>{chosen ? `${selected} view: projects most relevant to your interests first.` : "Explore all five projects, or choose a perspective to change their order."}</p></div></div><nav className="work-mobile-index" aria-label="Jump to project">{orderedProjects.map((project) => <a key={project.id} className={active === project.id ? "is-active" : ""} href={`#project-${project.id}`} aria-current={active === project.id ? "location" : undefined}><span aria-hidden="true"><ProjectEmoji id={project.id} /></span>{project.name.replace("DUYTRUYENTHONG ", "").replace("Codex ", "")}</a>)}</nav><div className="work-layout"><nav className="work-index" aria-label="Jump to project"><p>{chosen ? "IN YOUR ORDER" : "PROJECT INDEX"}</p>{orderedProjects.map((project) => <a key={project.id} className={active === project.id ? "is-active" : ""} href={`#project-${project.id}`} aria-current={active === project.id ? "location" : undefined}><span aria-hidden="true"><ProjectEmoji id={project.id} /></span>{project.name.replace("DUYTRUYENTHONG ", "").replace("Codex ", "")}</a>)}</nav><div className="work-cards">{orderedProjects.map((project, index) => <article className={`work-card work-card-${index + 1}`} id={`project-${project.id}`} key={project.id}><div className="work-stamp"><strong>{project.status.includes("Live") ? "LIVE" : project.status.includes("Public") ? "PUBLIC" : "PROTOTYPE"}</strong><small>{project.status}</small></div><p className="project-kicker"><ProjectEmoji id={project.id} /> &nbsp; {project.name}</p><h3>{project.headline}</h3><p className="project-summary">{project.problem}</p><ProjectVisual id={project.id} /><div className="project-proof"><div><strong>{String(index + 1).padStart(2, "0")}</strong><span>{project.proof}</span></div><Link href={`/work/${project.id}`}>Case study <span aria-hidden="true">↗</span></Link></div></article>)}</div></div></div></section>;
}

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setFailed(false);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setFailed(true);
      setCopied(false);
    }
  };
  return <><button className="copy-email" type="button" onClick={copy} aria-label={`Copy email address ${email}`}>{copied ? "Copied ✓" : "Copy email"}</button><p className="copy-feedback" role="status">{failed ? "Copy unavailable. Select the email address above to copy it, or open it in your email app." : copied ? "Email address copied." : ""}</p></>;
}
