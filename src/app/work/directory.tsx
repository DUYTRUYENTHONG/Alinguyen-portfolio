"use client";

import { PortfolioLink as Link } from "../portfolio-link";
import { useEffect, useState } from "react";
import { communityResource, projects } from "@/data/portfolio";
import { ProjectVisual } from "../experience";

const categories = ["All", "Commerce", "AI & data", "Developer tool"] as const;
const projectCategory: Record<string, (typeof categories)[number]> = {
  "growth-commerce-os": "Commerce",
  stos: "Commerce",
  "cho-kenh": "Commerce",
  "kkbox-baseline": "AI & data",
  community: "AI & data",
  "vibecode-kit": "Developer tool",
};
const featuredOrder = ["vibecode-kit", "community", "kkbox-baseline", "growth-commerce-os", "stos", "cho-kenh"];

const directoryProjects = [...projects.map((project) => ({ ...project, href: `/work/${project.id}`, cta: "Explore case study ↗" })), {
  id: communityResource.id,
  name: communityResource.name,
  headline: communityResource.headline,
  status: communityResource.license,
  role: "Creator and maintainer; shared freely with the community.",
  technologies: communityResource.tools.split(" · "),
  href: communityResource.href,
  cta: "Explore the free kit on GitHub ↗",
}];

export function WorkDirectory() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const visible = directoryProjects
    .filter((project) => category === "All" || projectCategory[project.id] === category)
    .sort((first, second) => featuredOrder.indexOf(first.id) - featuredOrder.indexOf(second.id));

  return <>
    <fieldset className="directory-filters" aria-busy={!ready}><legend className="sr-only">Filter projects by category</legend>
      {categories.map((item) => <button type="button" key={item} disabled={!ready} aria-pressed={category === item} onClick={() => setCategory(item)}>{item} <span>{item === "All" ? directoryProjects.length : directoryProjects.filter((project) => projectCategory[project.id] === item).length}</span></button>)}
    </fieldset>
    <p className="directory-count" role="status">Showing {visible.length} {visible.length === 1 ? "project" : "projects"}</p>
    <div className="directory-grid">
      {visible.map((project) => <Link className={`directory-card directory-${project.id}`} href={project.href} key={project.id}>
        <div className="directory-card-copy"><p>{project.status}</p><h2>{project.name.replace("DUYTRUYENTHONG ", "").replace("Codex ", "")}</h2><span>{project.headline}</span><div className="directory-card-meta"><span><b>Role</b> {project.role}</span><span><b>Built with</b> {project.technologies.slice(0, 3).join(" · ")}</span></div></div>
        {project.id === communityResource.id ? <div className="directory-career-workflow"><p>{communityResource.description}</p><ol>{communityResource.stages.map((stage) => <li key={stage.title}>{stage.title}</li>)}</ol><small>{communityResource.limits}</small></div> : <ProjectVisual id={project.id} />}
        <span className="directory-card-link">{project.cta}</span>
      </Link>)}
    </div>
  </>;
}
