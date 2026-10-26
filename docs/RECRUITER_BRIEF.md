# Recruiter brief · Ali Nguyen

**Focus:** applied AI prototypes, product engineering, customer data, and digital commerce. I work under the name Ali Nguyen; my CVs use Nguyen Quang Duy. [Portfolio](https://duytruyenthong.github.io/Alinguyen-portfolio/) · [Applied AI CV](https://duytruyenthong.github.io/Alinguyen-portfolio/cv-applied-ai-engineer.pdf) · [Contact](mailto:nquangd1510@gmail.com?subject=Engineering%20opportunity)

## What a reviewer can inspect

| Capability | Evidence | What it establishes |
| --- | --- | --- |
| TypeScript, React, Next.js, accessible UI, static deployment | [Portfolio source](../src/app/), [project data](../src/data/portfolio.ts), [Pages workflow](../.github/workflows/pages.yml) | A public application and its build pipeline. The site is a portfolio, not evidence of production AI traffic. |
| JavaScript and Node.js tooling, CLI design, tests, CI | [Vibecode Product Kit](https://github.com/DUYTRUYENTHONG/vibecode-product-kit), [CLI documentation](https://github.com/DUYTRUYENTHONG/vibecode-product-kit/blob/main/docs/CLI.md), [checks](https://github.com/DUYTRUYENTHONG/vibecode-product-kit/blob/main/.github/workflows/ci.yml) | Public source for an offline developer tool. Adoption has not been measured here. |
| Customer-facing product and commerce workflows | [Growth Commerce OS](https://growth-commerce-os.vercel.app/en), [STOS](https://stosvn.vercel.app/stos), [Chợ Kênh](https://growth-commerce-os.vercel.app/cho-kenh) | Reachable service, sales-page, and marketplace websites. These links do not establish revenue, retention, or customer counts. |
| Python, DuckDB, Pandas, scikit-learn, temporal feature evaluation | [KKBox source and results](https://github.com/DUYTRUYENTHONG/kkbox-customer-churn-prediction/blob/main/docs/RESULTS.md) and [case study](https://duytruyenthong.github.io/Alinguyen-portfolio/#project-kkbox-baseline) | Public baseline, synthetic leakage check, source audit, and official-data local holdout: 0.217324 log loss, 0.819295 ROC AUC. This is not an out-of-time test. |
| LLM APIs, prompts, retrieval-grounded answers | [Applied AI expertise](https://duytruyenthong.github.io/Alinguyen-portfolio/#ai-expertise), [AI and prompt CV](https://duytruyenthong.github.io/Alinguyen-portfolio/cv-prompt-engineer.docx) | [Live guide evaluation](evidence/AI_GUIDE_EVALUATION.md): 12/16 HTTP 200 responses, four errors, nine heuristic passes. A small authored regression set, not a factual-accuracy benchmark or production support SLA. |

## Skills in context

- **Software delivery:** JavaScript, TypeScript, React, Next.js, Node.js, API integration, GitHub Actions, testing, and release documentation. Public code is available in the portfolio and Vibecode repositories.
- **Data and AI:** Python, SQL, PostgreSQL, Pandas, scikit-learn, snapshot-date feature design, holdout evaluation, LLM API and prompt workflows, and retrieval-augmented generation prototypes. The linked CV and case study describe work that is not all available as public source.
- **Product and commerce:** customer discovery, sales funnels, content and lead workflows, Google Business Profile, TikTok Shop, Power BI, and DAX. These skills come from owner-supplied experience and the public product context; public dashboards and business impact measurements are not provided.

## Good starting points for an interview

1. Walk through a [portfolio implementation decision](../src/app/) or the [Vibecode CLI](https://github.com/DUYTRUYENTHONG/vibecode-product-kit/blob/main/docs/CLI.md), including tests and limits.
2. Discuss the [KKBox snapshot-date design](https://duytruyenthong.github.io/Alinguyen-portfolio/#project-kkbox-baseline), the measured local holdout, and what remains before a production or out-of-time claim.
3. Review a [live commerce workflow](https://stosvn.vercel.app/stos) and separate visible functionality from unmeasured outcomes.

**Evidence boundary:** The GitHub account has public portfolio, developer-tool, and KKBox baseline repositories. STOS and Chợ Kênh are linked as live websites; their private implementation is not offered as public source. The KKBox result is a local within-cohort holdout, and the portfolio guide is a live navigation assistant with a published baseline evaluation. The PostgreSQL warehouse is verified locally with PGlite; hosted operation is pending. No research publication, customer uplift, or future-cohort performance is claimed here.

## Traffic analytics evidence

The [pipeline](../analytics/README.md) exports daily Upstash aggregates into PostgreSQL reporting tables and views. Ten automated tests cover transactional replay, corrections, rollback, isolation, backfills and persistence. A real aggregate snapshot was loaded and replayed in persistent local PGlite. The [public demonstration](https://duytruyenthong.github.io/Alinguyen-portfolio/evidence/#analytics) uses synthetic data; it does not expose customer counts or imply a hosted warehouse.
