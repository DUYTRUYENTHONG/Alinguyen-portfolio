# Release verdict — 15 October 2026

**DEPLOYED WITH A DOCUMENTED PERFORMANCE LIMIT.** The owner subsequently authorized a public push and deployment. The portfolio source changes are live on [GitHub Pages](https://duytruyenthong.github.io/Alinguyen-portfolio/) at commit `cef4dab`; the [Pages build and deploy](https://github.com/DUYTRUYENTHONG/Alinguyen-portfolio/actions/runs/38712125820) succeeded. The remaining mobile lab LCP is above the 2.5 s good-experience target and needs separate profiling.

| Gate | Result | Evidence |
| --- | --- | --- |
| Dependencies, typecheck, lint, export | PASS | `npm ci` succeeded in an independent clean workspace; `npm run typecheck`, `npm run lint`, and the Pages-configured `npm run build` completed. GitHub Actions repeated the install and build. `npm audit --omit=dev --audit-level=high` found zero vulnerabilities. |
| Live Pages assets and metadata | PASS | [Final production assets](final-production-asset-checks.json): nine routes, 60 checked same-origin assets, zero problems. Direct case routes, CV, favicon, Open Graph image, robots, and sitemap were covered. |
| Live navigation and interactions | PASS | [Chrome journeys](journey-checks.json): 12/12, no page errors. Filters and case tabs were also checked with delayed JavaScript to confirm they wait for hydration. [Final production links](final-production-link-checks.json): 24 internal targets, zero issues. |
| Responsive and browser smoke | PASS in sampled states | [Candidate captures](candidate-capture-manifest.json) cover six widths; [Firefox/WebKit smoke](nonchromium-checks.json) passed mobile menu, Escape, Work anchor, overflow, and page-error checks. |
| Automated accessibility and SEO | PASS with limits | Local candidate Lighthouse Accessibility and SEO scored 100. This is not a WCAG certification or social-crawler check. |
| Mobile performance | OPEN | [Release recheck](release-lighthouse-summary.json): median simulated mobile score 67, LCP 7.33 s, TBT 194 ms, CLS 0.0178. The earlier public baseline measured 8.28 s LCP in a paired local setup. Results varied across runs; real-user LCP/INP is unavailable. |
| Visitor-count backend | NOT REVALIDATED | Browser QA blocked the API to avoid creating false visits. Test with a disposable store before drawing conclusions about live counts. |
| Content evidence | LIMITED | Cases distinguish live sites and a local prototype; private architecture, product adoption, and business outcomes have not been independently verified. |
| GitHub profile discovery | PASS | The public [DUYTRUYENTHONG profile](https://github.com/DUYTRUYENTHONG) website field and repository homepage point to the portfolio Pages URL. |

## Follow-up

1. Profile portrait paint, fonts, and hydration on a representative low-end device; compare a new public mobile Lighthouse run with real-user Core Web Vitals when available. Do not infer INP from TBT.
2. Verify visitor counting against a disposable backend store, then perform a controlled public check that does not inflate real statistics.
3. Review customer-logo permissions, CV contents, and private product evidence before adding stronger outcome claims.
4. Perform a screen-reader and physical-device accessibility pass and inspect social previews after crawler caches refresh.

Rollback, if needed: revert the relevant source commit(s) on `main` and let the Pages workflow publish the revert. Do not force-push the owner's branch.
