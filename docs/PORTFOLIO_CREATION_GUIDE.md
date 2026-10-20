# How this portfolio was created

This guide makes the project understandable to recruiters, admissions reviewers, and authorized collaborators. It explains the work and its checks; it does **not** grant a license to reuse the original design or code. See [LICENSE](../LICENSE).

## 1. Start with an evidence inventory

The portfolio separates what can be seen from what is planned or still being evaluated. Its main content record is [`src/data/portfolio.ts`](../src/data/portfolio.ts). Before adding a claim, record its owner, status, public destination, and evidence limit.

| Kind | Acceptable wording | Evidence to link |
| --- | --- | --- |
| Live page or product | “Live website” or the specific available workflow | Reachable page and current product behavior. |
| Public tool | “Public source” and the implemented functions | Repository, code, documentation, and checks. |
| Prototype | “Prototype” with its present boundary | Reproducible code or an explicit design note. |
| Local model result | Metric, split, cohort, and limitations together | Dataset provenance, evaluation method, and result report. |
| Planned capability | “Planned” or “proposed” | Roadmap or design note; do not describe it as live. |

For example, the KKBox churn result is a local within-cohort holdout on official data. Its snapshot-date and leakage checks belong next to the metric. It is not a Kaggle leaderboard result or proof of future retention impact. Customer and collaboration logos identify owner-confirmed relationships, not endorsements or performance outcomes.

## 2. Map the visitor journey

The homepage moves from an adaptable introduction through selected work, applied AI expertise, project details, customers and collaborations, working principles, CVs, and contact. The role selector changes the first-page emphasis for a session or explicit entry URL; it does not manufacture a different evidence record for each person. The named guide characters help visitors navigate. Their optional AI answers come from a separate server endpoint and must cite approved public knowledge.

The shared editorial palette, typography, layout shell, focus style, and reduced-motion rules are in [`src/app/styles.css`](../src/app/styles.css). Focused sections use colocated CSS Modules. The collaboration marks remain front-facing; shallow depth is applied to their display surfaces. Principle and expertise illustrations are conceptual, not screenshots of completed customer work.

## 3. Understand the application boundary

| Area | Location | Responsibility |
| --- | --- | --- |
| Routes and sections | [`src/app/`](../src/app/) | Static pages, accessible content, interaction, metadata, and scoped visual styles. |
| Portfolio facts | [`src/data/portfolio.ts`](../src/data/portfolio.ts) | Identity, links, projects, collaborations, capabilities, and principle copy. |
| Public assets | [`public/`](../public/) | Logos, portraits, screenshots, and downloadable CVs. Preserve each asset's provenance and aspect ratio. |
| Visitor and guide API | [`visitor-api/`](../visitor-api/) | Server-side counter, approved-knowledge retrieval, model call, rate limits, and secret handling. |
| Deployment | [`.github/workflows/pages.yml`](../.github/workflows/pages.yml) | Checks, static export, and GitHub Pages deployment after a push to `main`. |
| Evidence briefs | [`docs/RECRUITER_BRIEF.md`](RECRUITER_BRIEF.md), [`docs/ACADEMIC_BRIEF.md`](ACADEMIC_BRIEF.md) | Concise paths for different reviewers. |

Next.js exports the frontend as static files. It cannot safely hold a model key or store visitor data. The API is separately hosted on Vercel; browser-facing `NEXT_PUBLIC_` values contain public URLs only. Never place Groq or Upstash secrets in the static build.

## 4. Run an authorized local preview

Requirements: Node.js 22, npm, and the committed lockfile.

```sh
npm ci
npm run dev
```

Visit `http://localhost:3000`. The core pages and downloads do not need credentials. For the optional live guide and visitor counter, follow [`visitor-api/README.md`](../visitor-api/README.md) and configure the server project separately. When its API is unavailable, the guide shows static portfolio links.

To edit the portfolio, update the content record first, then the relevant section or case page, then the recruiter/admissions briefs and CV source if the fact changed. Keep project names, statuses, destinations, and limits consistent. Add new artwork only when its source and rights are known; document external marks on the [Credits page](../src/app/credits/page.tsx).

## 5. Check a release candidate

```sh
npm run typecheck
npm run lint
npm --prefix visitor-api ci
npm --prefix visitor-api test
npm --prefix visitor-api run smoke:production
```

The production smoke test contacts the already deployed guide API; it is a live dependency check, not a substitute for unit tests. For a Pages-path build, set these **public** variables and run `npm run build`:

```text
NEXT_PUBLIC_BASE_PATH=/Alinguyen-portfolio
NEXT_PUBLIC_SITE_URL=https://duytruyenthong.github.io/Alinguyen-portfolio
NEXT_PUBLIC_VISITOR_API_URL=https://ali-portfolio-visitor-api.vercel.app/api/visit
NEXT_PUBLIC_GUIDE_API_URL=https://ali-portfolio-visitor-api.vercel.app/api/guide
```

Inspect `out/` and the real page at desktop and mobile widths. Check headings, keyboard focus, reduced motion, logo integrity, all four CV files, the guide fallback, URLs under the base path, and horizontal overflow. Review changed files for secrets and personal information. Record the commit SHA that was checked.

## 6. Publish and verify

The repository is [`DUYTRUYENTHONG/Alinguyen-portfolio`](https://github.com/DUYTRUYENTHONG/Alinguyen-portfolio). The [Pages workflow](../.github/workflows/pages.yml) runs on a push to `main`, checks the API and frontend, exports `out/`, and deploys it. Afterward, confirm the workflow succeeded and inspect the [live portfolio](https://duytruyenthong.github.io/Alinguyen-portfolio/) and its asset and download links. A green local build alone is not proof of a successful public deploy.

The repository remains public so reviewers can inspect implementation and evidence. Public access also makes cloning and inspection possible. The [rights notice](../LICENSE) clarifies that the original work is not licensed for reuse; no script, CSS trick, or GitHub setting can make a publicly delivered design impossible to copy. Keeping source private in the future would be a separate hosting and evidence decision, and the rendered public page would still be inspectable.
