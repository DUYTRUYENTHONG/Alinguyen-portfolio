import type { MetadataRoute } from "next";
import { projects } from "@/data/portfolio";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const root = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const lastModified = new Date();
  return [
    { url: `${root}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${root}/work/`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${root}/about/`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    ...projects.map((project) => ({ url: `${root}/work/${project.id}/`, lastModified, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
