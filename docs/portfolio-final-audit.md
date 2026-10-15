# Portfolio final audit — 15 October 2026

## Release follow-up — 15 October 2026

After this audit, the owner explicitly requested a QA check, source and documentation push, and GitHub Pages deployment. Commit [`7c0a9f9`](https://github.com/DUYTRUYENTHONG/Alinguyen-portfolio/commit/7c0a9f9fc5cd02859c8a92d9abaa278105a341ad) was pushed to `main` and deployed by [GitHub Actions run 38680356558](https://github.com/DUYTRUYENTHONG/Alinguyen-portfolio/actions/runs/38680356558), with both build and deploy jobs passing.

The release build passed typecheck, lint, and static export locally and in GitHub Actions. The public Home, Work, About, Credits, three named product case-study routes, robots.txt, and sitemap.xml returned HTTP 200. A fresh browser load displayed the revised Applied AI title and hero, and the live visitor counter returned counts. A previously open browser tab initially showed the old version; the public HTML advertises a 600-second cache lifetime, and a fresh URL loaded the deployed version.

The audit verdict and mobile performance findings below are retained as the pre-release assessment. Public deployment does not resolve the measured mobile LCP or substitute for the outstanding non-Chromium, low-end-device, and content-evidence checks.

**Release verdict: NOT READY.** The portfolio now leads with Ali Nguyen's Applied AI and product work, its principal recruiter actions are visible in the first mobile viewport, and the main routes work in the tested Chromium browser. The mobile lab LCP remains 8.28 seconds, well above the 2.5-second good-experience threshold. The visitor-count backend and non-Chromium browsers were not verified in this pass. This is a release gate, not a claim that the current public site is broken.

## Scope and method

- Inspected the Next.js 16.4.0 / React 19.3.0 App Router static-export source, npm scripts and lockfile, CSS, fonts, image assets, motion code, metadata, privacy-sensitive frontend code, Git status, and GitHub Pages workflow. No extra runtime package or architecture change was introduced.
- Inspected the existing local development page at port 3001, the public GitHub Pages homepage before changes, and local production exports. The public site still contains the prior version; this audit did not deploy.
- Benchmarked unchanged and final local production exports on ports 3003 and 3006 using Lighthouse 13.5.0, headless Chromium, its default mobile simulation, and the same `http-server` configuration (`-c-1`, no compression). Three runs were made for each version. Medians below are medians of each metric independently. The visitor API was deliberately disabled in these builds to avoid writing production visitor data.
- Used the in-app Chromium browser for desktop and mobile rendering, keyboard interactions, navigation, and console checks. Viewports checked: 360×740, 390×844, 768×1024, 900×720, 1024×768, 1440×900, and 1920×1080. Document horizontal overflow was zero at each tested width.
- Before and after screenshots from equivalent Lighthouse runs: mobile [before](audit-before-mobile.jpg) / [after](audit-after-mobile.jpg), desktop [before](audit-before-desktop.jpg) / [after](audit-after-desktop.jpg). Full machine-readable Lighthouse results are retained locally in ignored `work/audit/` files.

## Assessment and findings

The existing visual language is coherent: restrained black and white surfaces, blue action color, Inter/Archivo typography, rounded navigation, and a consistent card style. The role picker, tour guide, case-study depth controls, and interactive funnels give it personality. The first screen previously gave marketing and sales equal or greater prominence than the requested Applied AI engineering identity and offered no direct work or CV action. The revised hierarchy is clearer without replacing the design.

| Priority | Finding and user impact | Cause | Resolution |
| --- | --- | --- | --- |
| P1 | Recruiters could misread the target role and had to search for technical work or a CV. | Sales-first hero and metadata; no first-screen CTA. | Applied AI/product headline and supporting copy, visible Work and AI CV actions, aligned About/Work/contact copy. Existing project status labels remain distinct. |
| P1 | Mobile LCP was dominated by a 1,364,921-byte portrait PNG. | Oversized raster asset with browser grayscale filter. | Two responsive grayscale WebP variants (22,188 and 63,566 bytes), correct intrinsic dimensions, eager high-priority hero loading; About portrait is lazy loaded. |
| P1 | The homepage sent many customer logos during initial loading. | Below-the-fold carousel images were eager and lacked dimensions. | Lazy decoding/loading and explicit image dimensions. Project cover dimensions were added as well. |
| P1 | Work, About, and case-study shares pointed search engines to the homepage canonical URL and inherited its social title. | Canonical and Open Graph title only defined at the root. | Unique route canonicals and relevant Open Graph titles/descriptions on key pages. Generated HTML was inspected. |
| P1 | Static hosting produced console 404s for prefetched route payloads. This wasted requests and made navigation depend on fallback behavior. | Next client links requested route payload URLs not emitted at the requested paths by the static export. | Internal routes now use a small base-path-aware native link component. Work → case study → browser Back and mobile About navigation work without console errors. |
| P1 open | Mobile LCP and client work remain high. | The first-screen portrait remains the LCP element; the long interactive page also hydrates substantial JavaScript and performs layout/animation work. | Image and navigation changes improved measurements, but further profiling and a bounded motion/client-boundary optimization are needed before calling the site fast. |
| P2 open | Several product case studies describe public UI and owner role but provide limited implementation architecture, testing detail, or source-linked decisions. | Verified technical evidence for private products was not supplied. | No details or outcomes were invented. Add source-backed diagrams, tests, and personal contribution details when available. |

No P0 defect was found in the tested routes. Existing live-product, public-tool, and local-prototype distinctions were preserved. The customer logos and tour guide remain in place.

## Mobile performance

| Lighthouse lab metric (median, 3 runs) | Before | Final | Change |
| --- | ---: | ---: | ---: |
| Performance score | 49 | 55 | +6 points |
| First Contentful Paint | 2.733 s | 2.738 s | +0.005 s |
| Largest Contentful Paint | 16.147 s | 8.276 s | −7.871 s |
| Speed Index | 5.158 s | 4.828 s | −0.330 s |
| Total Blocking Time | 761 ms | 504 ms | −257 ms |
| Cumulative Layout Shift | 0.0007 | 0.0178 | +0.0171; still below 0.1 |
| Total transfer | 3,136,263 B | 1,321,036 B | −1,815,227 B |
| Script transfer | 642,575 B | 634,404 B | −8,171 B |

Before Performance scores ranged from 39 to 60; final scores ranged from 53 to 58. Lighthouse is a throttled lab estimate and showed notable machine variance, especially in Total Blocking Time. The final three runs scored 100 for Accessibility, Best Practices, and SEO; these are automated checks, not full conformance proofs. The public, **older** deployment had a separate three-run mobile median of 57 Performance and 9.69-second LCP; network and hosting differ, so it is not used as the paired before/after comparison. No real-user LCP, INP, or CLS field data was available. The standard field targets are LCP ≤2.5 s, INP ≤200 ms, and CLS ≤0.1 at the 75th percentile; no field INP result is claimed here.

The remaining ~634 KB script transfer and multi-second style/layout work warrant targeted profiling. The image savings should not be treated as proof that the whole page now meets a mobile performance target. This local server did not use production compression or CDN caching, so a later public measurement is still necessary.

A separate **single-run desktop** Lighthouse check scored 71 before and 94 after, with LCP 2.815 s before and 1.504 s after. This is a visual and directional check, not a desktop median or field measurement.

## Functional, accessibility, and SEO verification

- `npm run typecheck`, `npm run lint`, and `npm run build` passed. The repository has no unit, integration, or E2E test script; browser checks supplied representative end-to-end coverage instead.
- Local static-export HTTP checks returned 200 for Home, Work, About, Credits, all five case-study routes, the AI CV PDF, Open Graph image, robots.txt, and sitemap.xml. Generated Home, Work, About, Credits, and KKBox case-study HTML had the intended canonical URLs; Work/About/case Open Graph titles were route specific.
- Browser checks covered the primary Work CTA, an Engineer role selection and consistent guide asset, Work category filtering, Work-to-case navigation, case-study tab selection with ArrowRight, browser Back, the mobile menu and Escape focus return, About navigation, CV URL, and `mailto:` contact destination. No console errors appeared in the final route checks. External product destinations were not opened; the user specifically asked not to open STOS.
- The menu, radio group, tabs, links, headings, skip link, and focus styles use native/semantic controls. `prefers-reduced-motion` rules exist for the main animation groups. Automated Accessibility scored 100 in the final mobile runs. This does **not** certify WCAG 2.2 AA; a screen reader pass, detailed contrast review, and Firefox/WebKit keyboard pass remain outstanding.
- Source review found no exposed secret value in the tracked frontend files. The only visitor integration configuration is a public endpoint variable; its backend was outside this audit. Structured-data JSON escapes `<`, and links opening a new tab include `noopener noreferrer`. There is no contact form to submit; email actions were inspected, not sent.

## Remaining risks and next release steps

1. **Performance:** Profile the interactive homepage on a representative low-end device, especially animation and hydration cost, then remeasure. Do not drop the tour-guide or funnel behavior solely to raise a score. Large, lazy product-gallery PNGs should also receive bounded preview versions before a full case-study media pass.
2. **Content evidence:** Obtain source-backed architecture, implementation challenges, testing/evaluation, and individual role details for the commercial product case studies. Keep prototype and business outcomes explicitly unmeasured until documented.
3. **Verification:** Test the visitor-count API against a disposable staging store, then test Firefox and WebKit (including reduced motion and keyboard use). A public deployment and real-user Core Web Vitals check require a separate release decision. LinkedIn/social previews must be checked at the final public URL.
4. **Release:** Review this local preview and approve the exact deployment before changing the public GitHub Pages site. The audit brief requires authorization before deployment; this pass was not deployed.

These outstanding items prevent a **READY** or **READY WITH MINOR ISSUES** verdict. The frontend is more coherent and the tested journeys work, but the remaining mobile LCP and unverified integration are material to a confident public release.
