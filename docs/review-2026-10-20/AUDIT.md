# Portfolio audit and proposed first slice — 20 October 2026

**Mode:** audit first. This report changes no application code, CV, configuration, or public content. The working tree already held unfinished visual-communication changes from the preceding request; they are preserved and are **not** part of the deployed baseline. No commit, push, deployment, form submission, or guide question was made for this audit.

**Follow-up:** After this baseline was recorded, Ali authorized redesign, CV corrections, QA, commit, push and deployment. This document retains its original pre-change observations; the implementation and release checks are recorded separately in `docs/qa/release-2026-10-20/`.

## Baseline and evidence policy

- **Live site:** https://duytruyenthong.github.io/Alinguyen-portfolio/
- **Repository:** `DUYTRUYENTHONG/Alinguyen-portfolio`, `main` at `f126d960830becf246307eb5bb466336d9281adf`. `git ls-remote origin refs/heads/main` matched the local base. The local tree is dirty with earlier, unpublished infographic work. Its new decision map and notes illustrations must not be mistaken for the live site.
- **Environment:** Windows, in-app Chromium browser, public GitHub Pages, and local read-only source inspection. Next.js 16.4 App Router, React 19.3, TypeScript, npm lockfile, self-hosted Inter/Archivo. Static export with `/Alinguyen-portfolio` base path and trailing slashes. CI in `.github/workflows/pages.yml` runs API tests/smoke, typecheck, Biome lint, build, then deploys on `main` push. No root repository test script.
- **Evidence labels:** **Observed** = inspected UI/source/document; **Owner-stated** = stated in portfolio/CV; **Corroborated** = separately inspected public evidence; **Inference** = reviewer interpretation; **Unknown** = unavailable or unverified. Live sites establish reachability, not adoption or business impact. Repository visibility alone does not prove sole authorship.
- **Visual capture:** [current live desktop first view](screenshots/live-home-desktop-1208.jpg) and [current CV choices](screenshots/live-cv-choices-1208.jpg), both 1209 × 597 JPEG. The [capture manifest](screenshots/manifest.json) records hashes, dimensions, URLs and times. The browser's mobile screenshot and forced 1440 capture disagreed with DOM dimensions, so they were discarded. [Earlier mobile capture](../portfolio-audit/screenshots/candidate-home-mobile.png) is historical evidence from 15 October, not a current mobile visual pass.

The site's statuses should remain distinct: **concept → prototype → implemented feature → deployed feature → evaluated result → measured business outcome**. The last state is not established for the portfolio projects inspected here.

## Executive assessment

The first screen identifies Ali Nguyen and Applied AI/product work, offers Work and AI CV paths, and uses a coherent neutral/blue design. The Work directory puts a public developer tool and a measured, qualified KKBox baseline first. Case studies distinguish public UI, local evaluation, planned AI, and unknown commercial impact. These are useful foundations.

The strongest friction is **cross-document evidence consistency**: the live KKBox case and [public results](https://github.com/DUYTRUYENTHONG/kkbox-customer-churn-prediction/blob/main/docs/RESULTS.md) give a qualified local holdout result, while both AI CV files still say real scores are unmeasured. Two Business download labels deliver byte-identical PDFs. The long homepage also places a large role picker and several narratives before the selected-work cases; a visitor can find work via the header/hero, but the in-page proof requires more scrolling. Prior mobile lab LCP remained high; no current field performance data is available.

Keep the current visual identity, existing five projects, accessible project limitations, direct contact path, original customer assets and relationship qualifier, and the distinction between live and proposed AI. Treat animations and the guide as optional aids, with their cost assessed before any removal.

## Inventory and recruiter walkthrough

**Routes:** Home; `/work/`; five `/work/{growth-commerce-os,stos,cho-kenh,vibecode-kit,kkbox-baseline}/` case pages; `/about/`; `/credits/`. Home has hero, two moving identity/status ribbons, optional 11-role audience selector and visitor count, Highlights, Applied AI expertise, signal-to-decision diagram, Selected work, interactive sales funnels, 15 customer/collaboration entries, About/principles/capabilities, four CV actions, three build notes, Contact, and footer. `/about/` repeats the CV choices and has the Sales/Commerce/Data relationship section. No language switch or contact form was found. Email uses `mailto:`. The guide sends questions to a separate API only if activated.

| Review depth | Observed path and result | Friction / interpretation |
| --- | --- | --- |
| ~10 seconds | Hero says “Ali Nguyen builds applied AI & digital products”; Work and AI CV actions are visible. | **Observed:** clear identity and action. **Inference:** rotating “I build …” and two ribbons compete with the fixed proposition. |
| ~60 seconds | Header → Work shows five projects; directory displays status, role, and technologies. Home Highlights show five builds. | **Observed:** useful short screening. A recruiter who scrolls Home encounters role selection, statement, ribbon, Highlights, expertise, and diagram before detailed work; hero navigation mitigates this. |
| ~3–5 minutes | Work → KKBox case gives problem, role, implementation, evidence, limits and source link. Other cases use the same structure and public screenshots where available. | **Observed:** substantial discussion prompts. **Unknown:** personal implementation boundaries and measured adoption for private commerce products remain thin; CV conflict undermines KKBox confidence. |

### Role-evidence matrix and positioning recommendation

These are **role hypotheses**, not claims about any particular employer's requirements. Missing portfolio evidence is not proof of missing ability.

| Direction | Stated direction and documented support | Inspectable projects | Main gap / recommendation |
| --- | --- | --- | --- |
| Applied AI / product engineering | Homepage title and 2+ years claim are **Owner-stated**. Python/data skills, public tool and KKBox evaluation are visible. | KKBox; Vibecode Product Kit; STOS for product context. | No inspected production RAG system or out-of-time KKBox validation. Lead with **applied AI prototypes and evaluated data work**, keep commercial/product context secondary. Do not imply senior or production ML scope. |
| Business/product analysis | Agency, solution consulting, customer discovery, commerce workflows are **Owner-stated** across About and CV. | Growth Commerce OS; STOS; Chợ Kênh. | Decisions and role are described, but actual requirements artifacts and outcome measures are scarce. Add source-backed decision examples when available. |
| Business development / commercial growth | Digital marketing, funnel, content, TikTok Shop and lead workflows are **Owner-stated**. | Growth Commerce OS; Chợ Kênh; STOS. | Funnels are conceptual and no sourced conversion/retention outcome was inspected. Frame this as commercial-product experience, not proven growth impact. |

**Recommended primary narrative for approval:** “Applied AI and product engineering grounded in customer and commerce problems.” Keep separate Business/Product and commercial paths through Work/About/CVs. Do not change the title or role positioning until the owner approves wording.

### Project evidence review

| Project | Well-supported strength | Most useful unanswered question | Status boundary |
| --- | --- | --- | --- |
| KKBox | **Corroborated:** public results give source commit, official-data hashes, 2017-02-28 cutoff, 75/25 within-cohort split, 0.217324 log loss and 0.819295 ROC AUC; no raw data is redistributed. | How would an untouched later cohort and calibration change the estimate? | Evaluated local baseline; no production model, intervention, or business outcome. |
| Vibecode Product Kit | **Observed:** public repository and CLI/CI description are inspectable. | Which specific before/after task shows practical utility and Ali's contribution? | Public tool; adoption not measured here. |
| Growth Commerce OS | **Observed:** public site responds and case shows owner-supplied homepage capture and service journey. | Which requirements and implementation decisions did Ali personally own? | Live service site, not verified lead/revenue impact. |
| STOS | **Observed:** live product site responds and case has captures for page, templates, login and registration. | Which features and tests are in production versus presented in the public product UI? | Live product website; AI suggestions planned, adoption unmeasured. |
| Chợ Kênh | **Observed:** live catalog responds and case describes manual inquiry/transfer review. | Which real transactions or user interviews, if any, can be documented safely? | Live marketplace UI; no automated checkout/escrow or completed-deal claim. |

For technical roles foreground **KKBox + Vibecode + STOS**; for business/product foreground **Growth Commerce OS + STOS + Chợ Kênh**. These are ordering proposals, not deletion requests.

## Visitor journey and section-by-section decisions

| Area | Decision | Evidence and concrete recommendation |
| --- | --- | --- |
| Navigation and hero | **Keep / Clarify** | Work, About, CV, Contact paths are explicit. Keep fixed proposition and two direct actions. Evaluate whether the rotating subline helps or slows comprehension. Do not require a role choice. |
| Audience selector, count, guide | **Simplify after measurement** | 11 roles are optional and the selected role persists in session storage. Live counter displays browser-based counts; backend truth not checked. Guide stores optional interests locally and calls an API only on use. Test whether these elements aid discovery before changing them. |
| Highlights | **Keep / Clarify** | Five distinct builds and links. “REAL PROJECTS. PRACTICAL IMPACT.” can read as an outcome claim when impact is not measured; propose sourced wording below. |
| Applied AI expertise | **Keep** | Prototype, local result, public tool and planned STOS functionality are differentiated. Link to KKBox result is available through its case. Preserve caveats. |
| Signal, Sales/Commerce/Data, funnels | **Clarify / Simplify** | Home diagram, About relationship cards, and two interactive funnels explain adjacent concepts. Audit each visual's unique job; keep only diagrams that add a decision or workflow insight. Existing funnel counts say illustrative. |
| Selected work and cases | **Reorder proposal / Clarify** | Five cases are findable from header and directory. Bring a compact selected-work entry closer to Highlights, and add source-backed personal decisions to commercial cases when available. |
| Customers and collaborations | **Keep** | Live page lists 15 entries, not 16; source `customers` array also has 15. Relationship qualifier is visible. Do not add endorsements or outcomes. Confirm intended roster before any count-based copy or layout change. |
| About, principles, capabilities | **Keep / Clarify** | Experience claims are owner-stated, working principles readable, four capability groups scannable. Evidence links for a few high-signal skills would help more than adding more tool names. |
| CVs | **Clarify, P1** | Four live files return 200 and correct PDF/DOCX MIME types. Two Business PDFs have identical SHA-256; both AI CVs contain obsolete KKBox “scores unmeasured” text. See REC-01/02. |
| Notes | **Keep** | Three notes connect KKBox, public kit, and commerce to evidence links. Earlier unpublished local diagrams are a separate visual slice requiring review. |
| Contact and footer | **Keep** | Email, copy button, topic-specific mailto links, GitHub and CV paths are visible. No production form submission was made. Credits and rights notice are linked. |

**Current in-page order:** Hero → ribbons/role picker → Highlights → AI expertise → signal map → Selected work → funnels → customers → About/capabilities → CVs → notes → Contact. **Proposed order for discussion:** Hero → compact Highlights → Selected work → AI expertise → optional audience/guide discovery → signal/commerce explanation → customers → About/capabilities → CVs → notes → Contact. This would require checking guide scroll behavior and anchors. No move is authorized yet.

**Representative proposal, not implementation:** Desktop: concise hero with Work/CV actions, then a three-project proof row whose status and evidence links remain visible. Mobile: the same actions and one project per row; role selection follows proof and stays optional. Use existing `--canvas #f7f7f7`, `--ink #08090b`, `--muted #6c7076`, `--line #e9e9e9`, `--blue #326bff`, Archivo headings and Inter body. Real product screenshots should depict real UIs; conceptual diagrams must say they are conceptual; numeric charts require source, units and context. Motion should keep text/links stable and respect reduced motion.

### Copy proposals requiring approval

| Original | Proposed | Reason / source |
| --- | --- | --- |
| AI PDF/DOCX: “Real KKBox model scores and business outcomes remain unmeasured.” | “The official-data local holdout recorded 0.217324 log loss and 0.819295 ROC AUC. Out-of-time performance and business impact remain unmeasured.” | Align two CVs with the [public result record](https://github.com/DUYTRUYENTHONG/kkbox-customer-churn-prediction/blob/main/docs/RESULTS.md); retain the within-cohort qualifier nearby. Owner approval needed before editing CVs. |
| Business Development PDF currently repeats the Business/Product headline and content. | Keep the Business/Product PDF; make the second CV a genuinely focused Business Development version, beginning “BUSINESS DEVELOPMENT \| SOLUTION CONSULTING \| DIGITAL COMMERCE” and reordering only existing, evidenced experience and project examples. | Distinguish the two promised downloads without adding outcomes or credentials. Existing experience in the current Business PDF is the source; owner approval of the final document text is needed. |
| Highlights: “REAL PROJECTS. PRACTICAL IMPACT.” | “Public builds. Evidence and limits in each case.” | “Impact” can imply measured outcomes absent from the cases. Source is the five case records; owner approval needed. |
| Ribbon accessible label: “Verified portfolio status” | “Project status” | Statuses mix live websites, public source and a local evaluation; this avoids stronger implied external verification. Owner approval needed. |

## Findings register

Each recommendation is a proposal; priority reflects visitor impact, not aesthetic taste.

| ID / priority | Location and observation (evidence status) | Visitor impact and recommendation | Confidence / effort / acceptance test |
| --- | --- | --- | --- |
| **REC-01 / P1** | AI PDF and prompt DOCX say KKBox scores are unmeasured; Home/case/public results give a qualified real-data local result. **Observed conflict; public result corroborates recorded metrics, not independent rerun.** | A reviewer sees conflicting evidence. Update both CVs to qualified local metrics, keep out-of-time and impact limits. | **High**, exact extracted text and public result; **small–medium**. Extract both published files after edit and match site wording, scope and source link. |
| **REC-02 / P1** | `cv-business-product.pdf` and `cv-business-development.pdf` are byte identical (4,097 bytes, SHA-256 `89D0A913DFAEFBF7E9759C23B1FEAD4ACD8C16F8AD7E46AC9D7C179F682E32F1`), despite two labels. **Observed.** | A visitor expects distinct versions. Either make two genuinely distinct, approved documents or present one honest download; preserve all paths until a choice is approved. | **High**, hash and extracted text; **small–medium**. Both labels lead to intended, distinct documents or UI transparently explains one file. |
| **UX-01 / P2** | Role picker and multiple narratives precede detailed work on Home; Work navigation mitigates. **Observed source/live order; impact is inference.** | Short screenings can stop at summaries. Test a compact work preview nearer Highlights without hiding personalization. | **Medium**, visitor behavior unknown; **medium**. At 10/60 seconds, role, project, contribution, CV and evidence are discoverable in browser tasks. |
| **REC-03 / P2** | Product cases describe role and public UI but limited source-backed architecture, test outcomes or personal decision artifacts. **Observed.** | Technical contribution is harder to assess. Obtain one safely publishable decision/test artifact per priority case. | **High** on presentation gap, **medium–large** effort pending evidence. Case clearly names role, constraint, implementation, validation and limits with source. |
| **UX-02 / P2** | “Practical impact” and “Verified portfolio status” exceed the precision of mostly unmeasured business outcomes. **Observed wording; implication is inference.** | Could overstate proof. Approve narrower copy without reducing project visibility. | **Medium**, semantic reading varies; **small**. Copy differentiates deployed UI, public source, evaluated local model and business outcomes. |
| **TECH-01 / P2** | Prior controlled mobile Lighthouse recheck (15 Oct) reported 7.33 s median lab LCP; current live field data and this audit's current lab run are unavailable. **Historical observed result.** | Loading may delay first impression. Profile current deployment on low-end conditions before optimizing. | **Medium**, dated lab evidence; **medium**. Same-condition before/after plus 75th-percentile field data when available; no INP claim from TBT. |
| **UX-03 / P2** | Site source has 15 customer entries; owner earlier requested 16 in a static display. **Observed source/live roster; intended missing entry unknown.** | Risk of a missing collaboration or inaccurate count. Ask owner to identify missing entry before changing names/logos. | **High** on count, **low** on intended roster; **small** after evidence. Approved roster appears once, uncropped, with relationship qualifier. |
| **A11Y-01 / P2** | 320–1440 DOM width checks found no document overflow; live mobile menu opened and Escape returned focus. Full zoom, screen reader, focus-obscured and contrast audit not completed. **Observed partial pass.** | WCAG 2.2 AA cannot be claimed. Run a dedicated keyboard/screen-reader/zoom pass, especially floating header and guide. | **High** for tested states, **unknown** for full conformance; **medium**. Record checks for 1.4.10 Reflow, 2.4.7 Focus Visible, 2.4.11 Focus Not Obscured, and 2.5.8 Target Size where applicable. |

No P0 issue was reproduced. None of these findings is a judgment about Ali's ability or hiring outcome.

## Verification baseline and limits

- **Live browser:** Home, Work directory, KKBox case, About and Credits accessibility trees inspected. Work→KKBox navigation was exercised. Mobile menu opened at 390 CSS px and Escape closed it with focus returned to the trigger. DOM reflow widths 1440, 1280, 1024, 768, 390 and 320 had `documentElement.scrollWidth <= innerWidth`; this is not a full visual or 200% zoom check. Current desktop screenshot was captured. Mobile screenshot capture was unreliable, so current mobile visuals are **Not assessed**.
- **Files and links:** all four live CV URLs returned HTTP 200 with expected PDF/DOCX MIME types. The three public product URLs, Work/About/Credits, robots and sitemap returned 200 on HEAD. The KKBox results and Vibecode repository returned 200. HTTP reachability does not prove downstream flows, CI state or actual file saving. No real contact message was sent.
- **CV contents:** PDFs were extracted with bundled `pypdf`; prompt DOCX with bundled `python-docx`. Applied AI PDF and prompt DOCX share the stale KKBox claim. Business PDFs share identical bytes. Visual CV layout/print rendering was **Not assessed**.
- **SEO/sharing:** source defines route titles, canonical URLs, Open Graph metadata, sitemap and robots; the Home live canonical resolved. Social crawler previews and index status were **Not assessed**. No bilingual UI was found.
- **Performance:** [15 October controlled lab report](../portfolio-audit/PERFORMANCE_REPORT.md) is historical baseline only. Its release recheck mobile median LCP was 7.33 s and CLS 0.0178; real-user LCP/INP/CLS unavailable. Current live performance, low-end physical devices and third-party request waterfall were **Not assessed**. Targets are [LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 at the field 75th percentile](https://web.dev/articles/vitals); lab TBT is not INP.
- **Accessibility:** native headings, links, radio controls, tab structure, skip link, focus styles and reduced-motion CSS were observed in source/UI. Full keyboard journey, text enlargement, contrast calculation, screen reader, 200% zoom, and [focus-not-obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum) testing are **Not assessed**. [320 CSS px reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow) had only a DOM overflow check. No WCAG conformance claim is made.
- **Privacy/security:** frontend stores a browser visitor ID, optional guide interests and session role; visitor and guide POSTs go to the separate Vercel API. The UI describes hashed visitor storage; the deployed database/configuration was **Not assessed**. No API request was deliberately submitted for this audit.

## Independently reviewable implementation slices

| Slice | Scope, files and expected value | Dependencies and acceptance criteria |
| --- | --- | --- |
| **1. CV evidence consistency (recommended first)** | Align AI PDF and prompt DOCX with the qualified KKBox result; make Business Development PDF distinct using only existing experience. `public/cv-*`, `src/data/portfolio.ts`, Home/About CV components only if labels change. Restores recruiter trust at the download step. | Owner approves exact wording and distinct-CV direction. Preserve four actions and formats; extract/render every final file, compare download labels and content, verify all live paths after any later publication. |
| 2. Contribution evidence | Add one approved role/decision/test artifact per selected commerce case. `src/data/portfolio.ts`, `src/app/work/[slug]/page.tsx`, `public/` only for licensed evidence. | Owner-supplied source and redaction approval. No invented outcomes. |
| 3. Work discovery | Prototype compact selected-work placement and optional audience selector. Home composition and scoped CSS. | Approval of order; browser task test at 10/60 seconds and six widths; retain anchors/guide behavior. |
| 4. Visual communication | Review the unpublished diagram work already in this tree as a discrete slice; compare live baseline against local candidate. | Approval of each visual's explanatory purpose and asset rights; responsive, reduced-motion and adjacent-section QA. No automatic merge/push. |
| 5. Performance/accessibility | Profile current mobile delivery, then fix the measured bottleneck; complete focused WCAG keyboard/zoom checks. | Same-condition lab comparison and documented manual results. No unsupported field-metric claim. |

**Approval request:** approve **Slice 1, CV evidence consistency**, including the qualified KKBox wording and a genuinely distinct Business Development PDF based only on already documented experience. Until then, this audit stops here. Publishing or deploying any slice remains a separate explicit action.
