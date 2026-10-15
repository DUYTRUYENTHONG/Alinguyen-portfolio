# Repository map — 15 October 2026

## Runtime and deployment

`package.json` and `package-lock.json` define a private npm project with Next.js 16.4, React 19.3, strict TypeScript (`tsconfig.json`), Biome linting, and self-hosted Inter/Archivo variable fonts. `next.config.ts` sets `output: "export"`, `trailingSlash: true`, and `basePath` from `NEXT_PUBLIC_BASE_PATH`. `.github/workflows/pages.yml` runs `npm ci`, typecheck, lint, and build with `/Alinguyen-portfolio`, then uploads `out/`; deployment depends on a passing build. The public visitor counter uses a separate Vercel API (`visitor-api/`) and must not move into the static Pages build. `counter/` contains related counter materials.

## App and content

| Path | Responsibility |
| --- | --- |
| `src/app/layout.tsx` | Shared HTML shell, fonts, metadata defaults, and `PortfolioExperienceProvider`. |
| `src/app/page.tsx` | Static homepage composition: hero, visitor, highlights, work, funnel, feedback, About, CVs, and contact. |
| `src/app/experience.tsx` | Shared interactive header/menu, role picker, project visuals, customer carousel, and other homepage controls. |
| `src/app/guide-character.tsx`, `src/app/visitor-stats.tsx` | Tour guide and visitor-role/count UI. The counter calls the public external API. |
| `src/app/funnel-experience.tsx`, `src/app/funnel.css` | Interactive five- and six-stage funnel demonstrations. |
| `src/app/work/page.tsx`, `src/app/work/directory.tsx` | Work landing page and client-side category filter. |
| `src/app/work/[slug]/page.tsx`, `src/app/case-depth.tsx` | Five static project case routes and keyboard-operable reading-depth tabs. |
| `src/app/about/page.tsx`, `src/app/credits/page.tsx` | About/CV and attribution routes. |
| `src/app/portfolio-link.tsx` | Base-path-aware internal navigation suited to static export. |
| `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/opengraph-image.png` | Search and sharing output. |
| `src/data/portfolio.ts` | Shared identity, project claims, statuses, customer labels, capabilities, and CV paths. |
| `src/app/styles.css` | Global color/spacing primitives and page/component styling; `funnel.css` holds the specialized funnel visuals. |
| `public/`, `assets/` | Served logos, portrait, CVs, project captures/previews; owner source material. |

## Reuse and maintenance observations

`SiteHeader`, `ProjectVisual`, `PortfolioLink`, project data, and page metadata patterns are reused across routes. The shared data file prevents contradictory status labels. `styles.css` also contains many single-line, page-specific rules and some repeated button/card values; centralizing proven common patterns would reduce drift, but a broad CSS refactor is not needed for this audit. The original Motion dependency was removed in the local candidate after confirming its role-tile use could be handled with native radio controls and CSS.

There is no `test` script or committed E2E suite. QA used transient Playwright/Lighthouse tools under ignored `work/qa-tools/`, with reproducible results in this audit folder. Browser coverage includes Chrome journeys, Firefox/WebKit mobile smoke checks, static routes/assets, and responsive captures. A persistent automated test harness, screen-reader pass, and low-end-device field performance data remain gaps.

Deployment-specific concerns are the repository subpath, static nested routes, generated metadata URLs, and keeping backend credentials out of public JavaScript. The local and production asset/link checks documented in this folder verify the current paths without introducing a redirect fallback or server-only Pages feature.
