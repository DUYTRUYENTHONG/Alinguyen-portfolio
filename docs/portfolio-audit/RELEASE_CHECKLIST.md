# Release checklist — deployed portfolio

The owner authorized publishing after the original local audit. Source commit `cef4dab` is live through the successful [GitHub Pages workflow](https://github.com/DUYTRUYENTHONG/Alinguyen-portfolio/actions/runs/38712125820). See [release verdict](RELEASE_VERDICT.md) for scope and limits.

| Gate | Status | Evidence |
| --- | --- | --- |
| Clean install, typecheck, lint, static export | PASS | Independent `npm ci`, local `npm run typecheck`, `npm run lint`, Pages-configured `npm run build`, and GitHub Actions build completed. |
| GitHub Pages routes and assets | PASS | [Nine live routes and 60 assets](final-production-asset-checks.json) returned 200 with no problems. |
| Internal links | PASS | [24 live internal targets](final-production-link-checks.json) returned 200 with no issues. |
| Recruiter, engineering, collaborator, mobile journeys | PASS | [12/12 live Chrome checks](journey-checks.json), no page errors. CV, contact, filters, keyboard tabs, direct hashes, Back/Forward, and mobile menu were covered. |
| Pre-hydration controls | PASS | A delayed-JavaScript browser check confirmed Work filters and case tabs stay disabled until their handlers are ready. |
| Responsive layout | PASS in sampled widths | [Candidate captures](candidate-capture-manifest.json): no overflow at 360, 390, 768, 1024, 1440, or 1920 px. |
| Non-Chromium smoke | PASS, limited scope | [Firefox and WebKit](nonchromium-checks.json) passed mobile menu, Escape, Work anchor, overflow, and page-error checks. |
| Automated accessibility and SEO | PASS with limits | Local Lighthouse Accessibility and SEO scores of 100; no full WCAG audit was performed. |
| Mobile performance | OPEN | [Performance report](PERFORMANCE_REPORT.md): simulated mobile LCP median 7.33 s in the release recheck, above the 2.5 s target. Field LCP and INP are unavailable. |
| Visitor-count service | NOT REVALIDATED | Browser QA blocked the production API to avoid recording test visitors. |
| GitHub profile link | PASS | Public profile website field and repository homepage resolve to the Pages portfolio. |

## Next checks

Profile mobile LCP on a low-end device, verify the visitor service with a disposable store, and complete a screen-reader pass. These checks remain open; they are not claimed as release passes.
