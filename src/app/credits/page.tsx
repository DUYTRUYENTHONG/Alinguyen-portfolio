import { PortfolioLink as Link } from "../portfolio-link";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const metadata = { title: "Credits | Ali Nguyen", alternates: { canonical: `${siteUrl}/credits/` } };

export default function CreditsPage() {
  return <main className="credits-page section-shell">
    <Link href="/">← Back to portfolio</Link>
    <h1>Credits</h1>
    <p>Portfolio design, code, and case study writing by Ali Nguyen. Product screenshots and most brand artwork were supplied by the owner. The KKBOX icon comes from its <a href="https://apps.apple.com/tw/app/kkbox-%E9%9F%B3%E6%A8%82-podcast/id300915900">App Store listing</a>.</p>
    <p>The evidence-led AI writing was informed by <a href="https://saurav02022.github.io/">Saurav Kumar&apos;s portfolio</a>. The visual design and copy here were made for this site.</p>
    <p>Project emoji graphics use <a href="https://github.com/jdecked/twemoji">Twemoji</a>, licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</p>
    <p>Original portfolio design, code, writing, and owner-created artwork © 2026 Nguyen Quang Duy (Ali Nguyen). All rights reserved. Public availability does not grant permission to reuse them. Third-party marks and materials remain with their respective owners; see the repository <a href="https://github.com/DUYTRUYENTHONG/Alinguyen-portfolio/blob/main/LICENSE">rights notice</a> and <a href="https://github.com/DUYTRUYENTHONG/Alinguyen-portfolio/blob/main/docs/ASSET_PROVENANCE.md">asset provenance</a>.</p>
  </main>;
}
