import type { Metadata } from "next";
import { PortfolioLink as Link } from "../portfolio-link";
import { SiteHeader } from "../experience";
import { WorkDirectory } from "./directory";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Work | Ali Nguyen",
  description: "Applied AI and data prototypes, developer tools, and live commerce products by Ali Nguyen.",
  alternates: { canonical: `${siteUrl}/work/` },
  openGraph: { title: "Selected work | Ali Nguyen", description: "Applied AI and data prototypes, developer tools, and live commerce products by Ali Nguyen." },
};

export default function WorkPage() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader inner />
    <main className="directory-page" id="main">
      <div className="directory-intro"><h1>Selected work</h1><p>Applied AI prototypes, developer tools, and live commerce products, with clear evidence and limits.</p></div>
      <WorkDirectory />
    </main>
    <footer className="site-footer"><span>Ali Nguyen · DUYTRUYENTHONG</span><Link href="/">Home ↑</Link></footer>
  </>;
}
