import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../experience";
import { WorkDirectory } from "./directory";

export const metadata: Metadata = {
  title: "Work | Ali Nguyen",
  description: "Commerce products, AI and data prototypes, and developer tooling by Ali Nguyen.",
};

export default function WorkPage() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader inner />
    <main className="directory-page" id="main">
      <div className="directory-intro"><h1>Selected work</h1><p>Commerce products, customer data, and practical tools built around clearer decisions.</p></div>
      <WorkDirectory />
    </main>
    <footer className="site-footer"><span>Ali Nguyen · DUYTRUYENTHONG</span><Link href="/">Home ↑</Link></footer>
  </>;
}
