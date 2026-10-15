"use client";

import { PortfolioLink as Link } from "../portfolio-link";
import { useState } from "react";
import { projects } from "@/data/portfolio";
import { ProjectVisual } from "../experience";

const categories = ["All", "Commerce", "AI & data", "Developer tool"] as const;
const projectCategory: Record<string, (typeof categories)[number]> = {
  "growth-commerce-os": "Commerce",
  stos: "Commerce",
  "cho-kenh": "Commerce",
  "kkbox-baseline": "AI & data",
  "vibecode-kit": "Developer tool",
};

export function WorkDirectory() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const visible = projects.filter((project) => category === "All" || projectCategory[project.id] === category);

  return <>
    <fieldset className="directory-filters"><legend className="sr-only">Filter projects by category</legend>
      {categories.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item} <span>{item === "All" ? projects.length : projects.filter((project) => projectCategory[project.id] === item).length}</span></button>)}
    </fieldset>
    <p className="directory-count" role="status">Showing {visible.length} {visible.length === 1 ? "project" : "projects"}</p>
    <div className="directory-grid">
      {visible.map((project) => <Link className={`directory-card directory-${project.id}`} href={`/work/${project.id}`} key={project.id}>
        <div className="directory-card-copy"><p>{project.status}</p><h2>{project.name.replace("DUYTRUYENTHONG ", "").replace("Codex ", "")}</h2><span>{project.headline}</span></div>
        <ProjectVisual id={project.id} />
        <span className="directory-card-link">Explore case study ↗</span>
      </Link>)}
    </div>
  </>;
}
