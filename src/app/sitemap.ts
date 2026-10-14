import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return [{ url: `${siteUrl.replace(/\/$/, "")}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
