"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { LayoutGroup, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { ReactNode } from "react";
import type { Project } from "@/data/portfolio";
import { customers } from "@/data/portfolio";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const RoleContext = createContext<{ selected: string; setSelected: (role: string) => void } | null>(null);

export function PortfolioExperienceProvider({ children }: { children: ReactNode }) {
  const [selected, setSelectedState] = useState("Recruiter");
  useEffect(() => {
    const saved = window.sessionStorage.getItem("portfolio-visitor-role");
    if (saved && roles.some((role) => role.label === saved)) setSelectedState(saved);
  }, []);
  const setSelected = (role: string) => {
    setSelectedState(role);
    window.sessionStorage.setItem("portfolio-visitor-role", role);
  };
  return <RoleContext.Provider value={{ selected, setSelected }}>{children}</RoleContext.Provider>;
}

function usePortfolioRole() {
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
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuPanel = useRef<HTMLDivElement>(null);

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
      const focusable = Array.from(menuPanel.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
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
          <Link className={activePage === "#top" ? "nav-active" : ""} href={navHref("#top")}>Ali Nguyen</Link>
          {navItems.slice(1).map((item) => <Link className={activePage === item.href ? "nav-active" : ""} key={item.href} href={navHref(item.href)}>{item.label}</Link>)}
          <span className="nav-clock">DUYTRUYENTHONG · AI / DATA</span>
        </nav>
        <button ref={menuButton} className="menu-trigger" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
          <span className="menu-glyph" aria-hidden="true"><i /><i /><i /></span>
        </button>
      </header>
      <div className={`menu-backdrop ${open ? "is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <div ref={menuPanel} id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu" inert={!open}>
        <nav aria-label="Mobile navigation">{navItems.map((item) => <Link key={item.href} href={navHref(item.href)} onClick={() => setOpen(false)}>{item.label}</Link>)}</nav>
        <p>ALI NGUYEN · DUYTRUYENTHONG</p>
      </div>
    </>
  );
}

const focusPhrases = ["sales funnels", "qualified lead pathways", "commerce intelligence"];

export function RotatingFocus() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % focusPhrases.length), 3200);
    return () => window.clearInterval(timer);
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

export function VisitorPicker({ projects }: { projects: Project[] }) {
  const { selected, setSelected } = usePortfolioRole();
  const role = roles.find((item) => item.label === selected) ?? roles[0];
  const recommended = projects.find((project) => project.id === role?.project);

  return (
    <section className="visitor section-shell" id="visitor" aria-labelledby="visitor-title">
      <div className="visitor-heading"><h2 id="visitor-title">Hello stranger,<span className="visitor-heading-tail"> who are you?</span></h2></div>
      <LayoutGroup id="visitor-strip"><fieldset className="role-grid"><legend className="sr-only">Choose your perspective</legend>
        {roles.map((item) => <RoleTile key={item.label} item={item} selected={selected} onSelect={setSelected} />)}
      </fieldset></LayoutGroup>
      <div className="visitor-result" aria-live="polite">
        {recommended && <><span>RECOMMENDED FOR {selected.toUpperCase()}</span><a href={`#project-${recommended.id}`}>{recommended.name} <span aria-hidden="true">↗</span></a></>}
      </div>
    </section>
  );
}

const roleSpring = { type: "spring" as const, stiffness: 400, damping: 40 };
const liftSpring = { type: "spring" as const, stiffness: 150, damping: 13, mass: 1 };

function RoleTile({ item, selected, onSelect }: { item: (typeof roles)[number]; selected: string; onSelect: (role: string) => void }) {
  const active = selected === item.label;
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 180, damping: 24 });
  const y = useSpring(pointerY, { stiffness: 180, damping: 24 });

  return <motion.div layout="position" layoutDependency={selected} transition={reducedMotion ? { duration: 0 } : roleSpring} className={`role-cell ${active ? "is-selected" : ""}`}>
    <motion.label
      className={`role-card role-${item.tone} ${active ? "is-selected" : ""}`}
      initial="rest"
      whileHover={reducedMotion || active ? undefined : { y: -11.5, scale: 1.014, boxShadow: "0 24px 44px -14px rgba(11,21,51,.2), 0 6px 12px -4px rgba(11,21,51,.08)" }}
      whileTap={reducedMotion || active ? undefined : { y: -4, scale: .985 }}
      transition={reducedMotion ? { duration: 0 } : liftSpring}
      onPointerMove={(event) => {
        if (reducedMotion || active || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - rect.left) / rect.width - .5) * 8);
        pointerY.set(((event.clientY - rect.top) / rect.height - .5) * 8);
      }}
      onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}
    >
      <input type="radio" name="visitor-role" value={item.label} checked={active} onChange={() => onSelect(item.label)} />
      <motion.span key={active ? "active" : "rest"} className="role-icon" aria-hidden="true" style={active || reducedMotion ? undefined : { x, y }} animate={active ? { opacity: 1, scale: 1, y: 0 } : undefined} initial={active && !reducedMotion ? { opacity: 0, scale: .85, y: 10 } : false} transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 24, mass: .8, delay: active ? .08 : 0 }}><img src={`${basePath}/role-art/${item.icon}.webp`} alt="" width="362" height="362" loading="lazy" /></motion.span>
      <span className="role-card-copy">{active && <small>THAT&apos;S YOU</small>}<strong>{item.label}</strong>{active && <em>{item.description}</em>}</span>
    </motion.label>
  </motion.div>;
}

const statement = "I turn messy commerce signals into clearer sales journeys — linking audience insight, useful systems, and practical decisions across marketing, e-commerce, and lead generation.";
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

export function CustomerCarousel() {
  const rail = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = (index: number) => {
    const next = (index + customers.length) % customers.length;
    const container = rail.current;
    const card = container?.children[next] as HTMLElement | undefined;
    if (container && card) {
      const left = card.getBoundingClientRect().left - container.getBoundingClientRect().left + container.scrollLeft;
      container.scrollTo({ left, behavior: "smooth" });
    }
    setActive(next);
  };

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => goTo(active + 1), 4500);
    return () => window.clearInterval(timer);
  }, [active, paused]);

  return (
    <section className="customer-section" id="feedback" aria-labelledby="customers-title">
      <div className="section-shell">
        <div className="customer-heading"><div><p className="eyebrow">Customers &amp; collaborations</p><h2 id="customers-title">Built for real businesses.</h2><p>Customer names shared by Ali Nguyen. Individual testimonials are not quoted here.</p></div></div>
        <section className="customer-rail" ref={rail} aria-roledescription="carousel" aria-label="Customer names and logos" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }} onScroll={(event) => {
          const container = event.currentTarget;
          const nearest = [...container.children].reduce((best, child, index) => {
            const distance = Math.abs(child.getBoundingClientRect().left - container.getBoundingClientRect().left);
            return distance < best.distance ? { index, distance } : best;
          }, { index: 0, distance: Infinity });
          setActive(nearest.index);
        }}>
          {customers.map((customer, index) => {
            const content = <><span className="customer-index">{String(index + 1).padStart(2, "0")}</span><span className="customer-mark">{"logo" in customer ? <img src={`${basePath}/${customer.logo}`} alt="" loading="lazy" /> : <span aria-hidden="true">{customer.name.split(" ").filter(Boolean).slice(-2).map((part) => part[0]).join("")}</span>}</span><strong>{customer.name}</strong>{"href" in customer && <span className="customer-link-cue">Visit brand ↗</span>}</>;
            return "href" in customer ? <a className="customer-card" key={customer.name} href={customer.href} target="_blank" rel="noopener noreferrer" aria-label={`${customer.name} — visit brand website`}>{content}</a> : <div className="customer-card" key={customer.name}>{content}</div>;
          })}
        </section>
      </div>
    </section>
  );
}

export function ProjectVisual({ id }: { id: string }) {
  if (id === "growth-commerce-os") return <div className="mock-browser mock-growth" role="img" aria-label="DUYTRUYENTHONG logo in an illustration of the Growth Commerce OS service site"><div className="mock-toolbar"><i /><i /><i /><span>growth-commerce-os.vercel.app</span></div><div className="mock-growth-body"><div className="mock-growth-brand"><img src={`${basePath}/duytruyenthong-logo.png`} alt="" width="92" height="92" /><span>DUYTRUYENTHONG</span></div><strong>Growth Commerce OS</strong><p>Content · Channels · Commerce</p><div className="mock-growth-bars"><i /><i /><i /><i /></div></div></div>;
  if (id === "stos") return <div className="mock-browser mock-stos" role="img" aria-label="STOS logo and an illustration of its sales page, inquiry, and insights workflow"><div className="mock-toolbar"><i /><i /><i /><span>stosvn.vercel.app/stos</span></div><div className="mock-stos-body"><img src={`${basePath}/stos-logo-dark.png`} alt="STOS logo" width="242" height="133" /><strong>A sales page that feels like yours.</strong><div><span>Your page</span><span>Inquiries</span><span>Insights</span></div></div></div>;
  if (id === "cho-kenh") return <div className="mock-browser mock-cho-kenh" role="img" aria-label="Chợ Kênh logo and an illustration of its TikTok channel catalog and inquiry workflow"><div className="mock-toolbar"><i /><i /><i /><span>growth-commerce-os.vercel.app/cho-kenh</span></div><div className="mock-cho-kenh-body"><div className="mock-market-hero"><img src={`${basePath}/cho-kenh-logo.png`} alt="" width="104" height="80" /><div><small>CHỢ KÊNH</small><strong>Find the right TikTok channel.</strong><p>Compare listings. Ask for a manual deal review.</p></div></div><div className="mock-market-list"><span>Channel catalog</span><span>Audit &amp; risk</span><span>Zalo inquiry</span></div><small className="mock-market-next">AI tools &amp; courses · coming soon</small></div></div>;
  if (id === "vibecode-kit") return <div className="mock-browser mock-terminal" role="img" aria-label="Illustration of the public Vibecode CLI"><div className="mock-toolbar"><i /><i /><i /><span>vibecode-product-kit</span></div><div className="mock-terminal-body"><p><em>$</em> vibecode init</p><p><b>✓</b> plan created</p><p><b>✓</b> evidence recorded</p><p><b>✓</b> quality gates ready</p><span>BUILD → VERIFY → RELEASE</span></div></div>;
  return <div className="mock-browser mock-churn" role="img" aria-label="Illustrative churn feature timeline, not a performance chart"><div className="mock-toolbar"><i /><i /><i /><span>kkbox / local prototype</span></div><div className="mock-churn-body"><span>SNAPSHOT DATE</span><div className="mock-timeline"><i /><i /><i /><i /><i /></div><strong>Past events only</strong><p>Feature construction → holdout evaluation</p><small>Illustration · no measured model score</small></div></div>;
}

export function WorkSection({ projects }: { projects: Project[] }) {
  const { selected } = usePortfolioRole();
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
  const projectIcons: Record<string, string> = { "growth-commerce-os": "◈", stos: "✦", "cho-kenh": "◇", "vibecode-kit": "▣", "kkbox-baseline": "◉" };
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

  return <section className="work-section" id="work" aria-labelledby="work-title"><div className="section-shell"><div className="work-heading"><h2 id="work-title">Selected work</h2><div><a className="work-role-chip" href="#visitor">You: {selected} · <span>change</span></a><p>{selected} view: projects most relevant to your interests first.</p></div></div><nav className="work-mobile-index" aria-label="Jump to project">{orderedProjects.map((project) => <a key={project.id} className={active === project.id ? "is-active" : ""} href={`#project-${project.id}`} aria-current={active === project.id ? "location" : undefined}><span aria-hidden="true">{projectIcons[project.id]}</span>{project.name.replace("DUYTRUYENTHONG ", "").replace("Codex ", "")}</a>)}</nav><div className="work-layout"><nav className="work-index" aria-label="Jump to project"><p>IN YOUR ORDER</p>{orderedProjects.map((project) => <a key={project.id} className={active === project.id ? "is-active" : ""} href={`#project-${project.id}`} aria-current={active === project.id ? "location" : undefined}><span aria-hidden="true">{projectIcons[project.id]}</span>{project.name.replace("DUYTRUYENTHONG ", "").replace("Codex ", "")}</a>)}</nav><div className="work-cards">{orderedProjects.map((project, index) => <article className={`work-card work-card-${index + 1}`} id={`project-${project.id}`} key={project.id}><div className="work-stamp"><strong>{project.status.includes("Live") ? "LIVE" : project.status.includes("Public") ? "PUBLIC" : "PROTOTYPE"}</strong><small>{project.status}</small></div><p className="project-kicker">{projectIcons[project.id]} &nbsp; {project.name}</p><h3>{project.headline}</h3><p className="project-summary">{project.problem}</p><ProjectVisual id={project.id} /><div className="project-proof"><div><strong>{String(index + 1).padStart(2, "0")}</strong><span>{project.proof}</span></div><Link href={`/work/${project.id}`}>Case study <span aria-hidden="true">↗</span></Link></div></article>)}</div></div></div></section>;
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
