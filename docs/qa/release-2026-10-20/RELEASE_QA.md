# Portfolio release QA — 20 October 2026

**Candidate:** `d2a2cc8c8d6d6c27e25e6071e72460f821227e3e` on `main`. **Decision:** PASS_WITH_RISK for the existing GitHub Pages deployment. The remaining limits below are not known P0/P1 failures.

## Changes checked

- Selected work now follows Highlights. The Highlights link and direct `#work` anchor place its heading below the floating navigation. The guide's section order follows the page order; role-based project ordering remains available.
- The former orbit graphic is a labeled, conceptual signal → workflow → decision map. Build notes have three compact conceptual diagrams. KKBox artwork shows a snapshot boundary rather than an implied performance trend.
- All four download paths remain. The Applied AI PDF, Prompt DOCX and Business/Product PDF now describe the **official-data local within-cohort** KKBox holdout: 0.217324 log loss and 0.819295 ROC AUC on 970,960 labels with a 2017-02-28 snapshot. The documents explicitly exclude out-of-time, leaderboard, production and business-impact interpretations. Business Development is a separate PDF grounded in existing experience.
- The public README explains the four documents and the distinction between the two business versions. Original design, brand assets and evidence boundaries remain as described in the visual plan and Credits.

## Verification performed

| Gate | Result |
| --- | --- |
| `npm ci` and `npm --prefix visitor-api ci` | Passed. The first root install hit a Windows SWC file lock from the active dev server; it passed after the server was stopped. Both dependency audits reported zero vulnerabilities. |
| `npm run typecheck`, `npm run lint` | Passed after the final code changes. |
| Pages-configured `npm run build` | Passed, 14 static pages. Export HTML contains Work before Applied AI, both new diagram areas, the `/Alinguyen-portfolio` asset path, and four CV links. All four CV files are present in `out/`. |
| `npm --prefix visitor-api test` | Passed, 6/6 guide API tests. |
| `npm --prefix visitor-api run smoke:production` | Passed grounded answer, approved citation, motion shape and CORS checks. |
| CV source and output | Extracted all three PDFs with `pypdf` and the DOCX with `python-docx`: qualified scores appear in the relevant AI/product documents, obsolete “scores unmeasured” text is absent, and Business/Product and Business Development have distinct hashes. Rendered and visually inspected the three PDF first pages. |
| Browser | In-app Chromium inspected the desktop Work anchor, desktop/mobile signal map and mobile notes. Clicking Highlights → Work placed the heading below the navigation. DOM reflow at 320, 390, 768, 1024, 1280 and 1440 CSS px reported no document overflow. Four CV links remain in the page. |
| Source review | `git diff --check` passed; staged text had zero credential-token pattern matches. The new diagrams use original inline SVG/CSS and no new third-party assets. |

[Capture manifest](capture-manifest.json) records image hashes and dimensions. Review images: [selected work](work-desktop.jpg), [desktop map](../visual-communication/desktop-map.png), [mobile map](../visual-communication/mobile-map.png), and [mobile notes](../visual-communication/mobile-notes.png).

## Limits and recovery

- The DOCX renderer could not run because LibreOffice is not installed. DOCX text and structure were checked, but page-level visual QA is open. PDF first pages were visually reviewed; the Applied AI second page was text-checked, not visually rendered.
- Current mobile LCP and field Core Web Vitals were not measured in this release. The 15 October lab LCP in the [earlier report](../../portfolio-audit/PERFORMANCE_REPORT.md) remains an open performance issue. No full WCAG or screen-reader conformance claim is made.
- Local browser checks do not establish successful real-world file saving, third-party adoption, customer results or business impact.
- To roll back the UI and document changes, revert `d2a2cc8` on `main` and let the same Pages workflow redeploy. The separate visitor API and its environment variables were not changed.

After deployment, verify the GitHub Pages workflow succeeds, the public page reflects the new order and artwork, all four CV URLs resolve with their expected media types, and the Work anchor clears the navigation.
