import { capabilities, expertise, identity, principles, projects } from "@/data/portfolio";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: identity.name,
    alternateName: identity.brand,
    jobTitle: identity.title,
    description: identity.proposition,
    email: identity.email,
    sameAs: [identity.github, identity.service],
  };

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Ali Nguyen, back to top">
          <span className="brand-mark" aria-hidden="true">AN</span>
          <span><strong>Ali Nguyen</strong><small>DUYTRUYENTHONG</small></span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#expertise">Expertise</a>
          <a href="#work">Work</a>
          <a href="#approach">Approach</a>
          <a className="nav-contact" href="#contact">Contact <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <main id="main">
        <section className="hero section-shell" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" /> AI, data & commerce</p>
            <h1 id="hero-title">AI & Data Engineer<br /><em>for <span className="no-break">E-commerce.</span></em></h1>
            <p className="hero-value">{identity.proposition}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">View projects <span aria-hidden="true">↗</span></a>
              <a className="button button-secondary" href="#contact">Get in touch</a>
            </div>
          </div>
          <div className="hero-side">
            <div className="signal-top"><span>FOCUS / 2026</span><span>01—04</span></div>
            <div className="signal-lines" aria-hidden="true"><i /><i /><i /><i /><i /></div>
            <p>From raw signals<br />to useful decisions.</p>
            <div className="signal-bottom"><span>Data → Models → Action</span><span>ALi / DTT</span></div>
          </div>
        </section>

        <section className="expertise section-shell section-pad" id="expertise" aria-labelledby="expertise-title">
          <div className="section-heading"><p className="eyebrow">What I work on</p><h2 id="expertise-title">Engineering across the commerce decision loop.</h2></div>
          <div className="expertise-grid">
            {expertise.map((item) => <article className="expertise-item" key={item.number}>
              <span className="item-number">{item.number}</span><h3>{item.title}</h3><p>{item.detail}</p>
            </article>)}
          </div>
        </section>

        <section className="work section-pad" id="work" aria-labelledby="work-title">
          <div className="section-shell">
            <div className="section-heading"><p className="eyebrow">Selected work</p><h2 id="work-title">Projects with clear status and evidence.</h2><p className="section-intro">A live service website, a published developer tool, and a new local churn baseline. Each entry separates what exists from what remains to be measured.</p></div>
            <div className="project-list">
              {projects.map((project, index) => <article className="project" key={project.id}>
                <div className="project-index">{String(index + 1).padStart(2, "0")}</div>
                <div className="project-main"><p className="project-status">{project.status}</p><h3>{project.name}</h3><p className="project-problem">{project.problem}</p>
                  <dl className="project-details"><div><dt>For</dt><dd>{project.users}</dd></div><div><dt>My role</dt><dd>{project.role}</dd></div><div><dt>Approach</dt><dd>{project.approach}</dd></div><div><dt>Evidence</dt><dd>{project.outcome}</dd></div></dl>
                  <div className="project-footer"><ul className="tag-list" aria-label={`${project.name} technologies`}>{project.technologies.map((tech) => <li key={tech}>{tech}</li>)}</ul>{project.link && <a className="text-link" href={project.link.href}>{project.link.label} <span aria-hidden="true">↗</span></a>}</div>
                </div>
              </article>)}
            </div>
          </div>
        </section>

        <section className="case-study section-shell section-pad" id="approach" aria-labelledby="approach-title">
          <div className="section-heading"><p className="eyebrow">Behind the build</p><h2 id="approach-title">A baseline that makes its limits visible.</h2></div>
          <div className="case-grid"><div className="case-lead"><span className="case-label">CASE STUDY / KKBOX PROTOTYPE</span><p>Churn models need a reliable answer to one question: what did we know about a customer when the prediction would have been made?</p></div>
            <div className="case-steps"><div><span>01 / Context</span><p>Public competition data frames a subscription-retention problem. Data access follows Kaggle terms; raw records are excluded from the repository.</p></div><div><span>02 / Implementation</span><p>Transaction and listening events are aggregated only through a chosen snapshot date. A logistic-regression baseline reports holdout metrics when a user runs it on eligible data.</p></div><div><span>03 / Result & lesson</span><p>A synthetic fixture tests that future events are excluded. Real-dataset performance and commercial impact remain unmeasured; reproducibility comes before a headline score.</p></div></div>
          </div>
        </section>

        <section className="capabilities section-pad" aria-labelledby="capabilities-title"><div className="section-shell"><div className="section-heading"><p className="eyebrow">Technical capabilities</p><h2 id="capabilities-title">Tools chosen for the problem.</h2></div><div className="capability-grid">{capabilities.map((group) => <div key={group.group}><h3>{group.group}</h3><p>{group.items.join(" · ")}</p></div>)}</div></div></section>

        <section className="principles section-shell section-pad" aria-labelledby="principles-title"><div className="section-heading"><p className="eyebrow">Engineering principles</p><h2 id="principles-title">Build trust into the work.</h2></div><ol>{principles.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ol></section>

        <section className="contact section-pad" id="contact" aria-labelledby="contact-title"><div className="section-shell contact-inner"><div><p className="eyebrow">Contact</p><h2 id="contact-title">Let&apos;s make the next decision clearer.</h2><p>For AI, data, and commerce engineering conversations, email me or explore the work above.</p></div><div className="contact-actions"><a className="button button-light" href={`mailto:${identity.email}`}>Email Ali <span aria-hidden="true">↗</span></a><a href={identity.github}>GitHub <span aria-hidden="true">↗</span></a><a href={identity.service}>DUYTRUYENTHONG <span aria-hidden="true">↗</span></a></div></div></section>
      </main>
      <footer className="site-footer"><span>© {new Date().getFullYear()} Ali Nguyen</span><span>DUYTRUYENTHONG · AI & Data for E-commerce</span><a href="#top">Back to top ↑</a></footer>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: fixed local JSON-LD content is serialized and angle brackets are escaped */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    </>
  );
}
