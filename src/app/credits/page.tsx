import { PortfolioLink as Link } from "../portfolio-link";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const metadata = { title: "Credits | Ali Nguyen", alternates: { canonical: `${siteUrl}/credits/` } };

export default function CreditsPage() {
  return <main className="credits-page section-shell">
    <Link href="/">← Back to portfolio</Link>
    <h1>Credits</h1>
    <p>Portfolio design, code, and case study writing by Ali Nguyen. Product screenshots and brand artwork were supplied by the owner.</p>
    <p>Project emoji graphics use <a href="https://github.com/jdecked/twemoji">Twemoji</a>, licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</p>
  </main>;
}
