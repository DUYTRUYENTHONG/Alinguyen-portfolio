# Ali Nguyen · Applied AI and Product Engineer

**Nguyen Quang Duy (Ali Nguyen)** builds applied AI prototypes, developer tools, customer analytics, and digital commerce products through [DUYTRUYENTHONG](https://growth-commerce-os.vercel.app/en).

[Portfolio and case studies](https://duytruyenthong.github.io/Alinguyen-portfolio/) · [Selected work](https://duytruyenthong.github.io/Alinguyen-portfolio/work/) · [About](https://duytruyenthong.github.io/Alinguyen-portfolio/about/) · [Email](mailto:nquangd1510@gmail.com)

## For recruiters

I work across product engineering and applied AI: translating customer problems into web workflows, building testable prototypes, and checking what the evidence supports. My experience spans digital marketing and commerce operations as well as software and data work.

| Expertise | What I can show |
| --- | --- |
| Applied AI and retrieval | A knowledge-assistant prototype with source retrieval, prompt design, and review against representative questions. It is not a deployed support service. |
| Data and machine learning | A local KKBox churn baseline using snapshot-date customer features, a synthetic future-event leakage check, and a logistic-regression holdout. Real-data scores are pending. |
| Product engineering | [Vibecode Product Kit](https://github.com/DUYTRUYENTHONG/vibecode-product-kit), a public JavaScript tool with an offline CLI, reusable Codex assets, and CI checks. |
| Digital commerce | [Growth Commerce OS](https://growth-commerce-os.vercel.app/en), [STOS](https://stosvn.vercel.app/stos), and [Chợ Kênh](https://growth-commerce-os.vercel.app/cho-kenh) show service, sales-page, and marketplace workflows. These public pages do not establish adoption or revenue results. |

**Skills and tools:** Python, SQL, PostgreSQL, Pandas, scikit-learn, JavaScript, TypeScript, React, Next.js, Node.js, GitHub Actions, testing, Power BI, DAX, LLM API and prompt workflows, retrieval-augmented generation prototypes, customer discovery, sales funnels, and lead workflows. The linked work and CVs give context for each area; this list does not imply production experience with every tool.

**CVs:** [Applied AI Engineer (PDF)](https://duytruyenthong.github.io/Alinguyen-portfolio/cv-applied-ai-engineer.pdf) · [AI and Prompt Engineer (DOCX)](https://duytruyenthong.github.io/Alinguyen-portfolio/cv-prompt-engineer.docx) · [Business and Product (PDF)](https://duytruyenthong.github.io/Alinguyen-portfolio/cv-business-product.pdf)

## For master's admissions

I studied Computer Science at Vietnamese-German University (2021–2026). My CV lists Linear Algebra, Statistics, and Discrete Mathematics among selected coursework. I am interested in reliable applied AI, retrieval-grounded question answering, temporal evaluation of customer models, and the design of useful human-facing systems. These are research interests, not claims of publications or completed graduate research.

My strongest project examples for an academic discussion are:

1. **Leakage-aware evaluation:** the [KKBox case study](https://duytruyenthong.github.io/Alinguyen-portfolio/#project-kkbox-baseline) explains why customer features must stop at a chosen snapshot date. The synthetic leakage test is available in the local prototype; external-data results still need validation.
2. **Grounded AI responses:** my knowledge-assistant prototype explores retrieving source material before generating an answer and reviewing responses against questions. It has no published accuracy benchmark or production deployment.
3. **Reproducible engineering:** [Vibecode Product Kit](https://github.com/DUYTRUYENTHONG/vibecode-product-kit) exposes its source, CLI, templates, and automated checks for inspection.

For study or supervision inquiries, [email me](mailto:nquangd1510@gmail.com?subject=Master%27s%20admission%20inquiry) and see the [Applied AI CV](https://duytruyenthong.github.io/Alinguyen-portfolio/cv-applied-ai-engineer.pdf). Degree completion, grades, research outputs, and recommendations should be verified directly with me and the university.

## Selected work and status

| Project | Status | Evidence |
| --- | --- | --- |
| [Growth Commerce OS](https://growth-commerce-os.vercel.app/en) | Live service website | Public service pages and demos; business impact unmeasured here. |
| [STOS](https://stosvn.vercel.app/stos) | Live product website | Sales pages, templates, inquiries, and illustrative insights; AI suggestions are planned. |
| [Chợ Kênh](https://growth-commerce-os.vercel.app/cho-kenh) | Live marketplace pages | Catalog, listing details, and Zalo inquiry flow; no automated checkout or escrow. |
| [Vibecode Product Kit](https://github.com/DUYTRUYENTHONG/vibecode-product-kit) | Public developer tool | Source and CI are available for review. |
| [KKBox churn baseline](https://duytruyenthong.github.io/Alinguyen-portfolio/#project-kkbox-baseline) | Local prototype | Synthetic leakage check; public code and real-data scores pending. |

## Repository notes

Static-first Next.js and TypeScript portfolio for Ali Nguyen, branded
DUYTRUYENTHONG. Content is maintained in `src/data/portfolio.ts`.

## Local preview

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. Run `npm run typecheck`, `npm run lint`, and
`npm run build` for a static export in `out/`.

The GitHub Pages repository is `DUYTRUYENTHONG/Alinguyen-portfolio`, at
`https://duytruyenthong.github.io/Alinguyen-portfolio/`. The workflow builds with
`NEXT_PUBLIC_SITE_URL` set to that URL and `NEXT_PUBLIC_BASE_PATH=/Alinguyen-portfolio`.
Local builds use `localhost:3000` in metadata and disallow indexing.
The visitor counter uses the independent Vercel API in `visitor-api/` backed by
Upstash Redis. Set `NEXT_PUBLIC_VISITOR_API_URL=https://ali-portfolio-visitor-api.vercel.app/api/visit`
in `.env.local` for local development. The GitHub Pages workflow sets the same
public URL for its build. One browser UUID counts once; choosing a different role
updates the role totals without adding another visitor.
The working-hours panel uses the live `Asia/Ho_Chi_Minh` clock and the visitor's
browser time zone. Its 09:00–18:00 overlap is a planning comparison, not a promise
of immediate availability.
The LinkedIn URL and public KKBox repository link await owner input or
publication.

The DUYTRUYENTHONG logo was also supplied by the owner and appears with Growth
Commerce OS. Both logos are preserved as supplied.

Ali Nguyen also supplied the Chợ Kênh logo and identified the marketplace as
his product. Its live public pages show a TikTok channel catalog, filters,
listing details, Zalo inquiries, and a manual intermediary consultation flow.
The intermediary page states that automated checkout and escrow are unavailable.
AI tools and courses are owner-described plans, not live offerings. No
transactions or buyer outcomes are claimed.

For an exact preview of the GitHub Pages path, build with
`NEXT_PUBLIC_BASE_PATH=/Alinguyen-portfolio` and serve the generated `out/` directory
under `/Alinguyen-portfolio/`. The portfolio pages are static; live visitor totals
require the separate API.

`PROFILE_README.md` is a draft for the username-matched GitHub repository. That repository remains private at the owner's request, so this public README and the pinned repository carry the detailed profile.

Four CV files are downloadable from the site: Applied AI Engineer (PDF),
Business & Product (PDF), Business Development (PDF), and AI / Prompt Engineer
(DOCX). All are generated from the shared, evidence-conscious record in
`scripts/generate-ai-cvs.py`; run that script with Python, ReportLab, and
python-docx to update them. The two business PDFs intentionally share one
business-and-product CV. All files use the current GitHub Pages URL and
distinguish prototypes from live products and unmeasured results. They retain
the printed name Nguyen Quang Duy and the previously public phone number;
review their contents before approving public release.

The dark perspective grid and project-specific AI explanations were inspired by
Saurav Kumar's portfolio (`https://saurav02022.github.io/`). The CSS, colors,
copy, and layout are original to this site; the reference is credited on the
Credits page.

The customer carousel lists fifteen names confirmed by Ali Nguyen. It contains no
testimonial quotes or client performance claims. The Bà Chi and Cô Ba logos
come from local owner files. Toàn Thắng, Hưng Phú Thịnh, Biên Lan, and Bách
Việt logos come from their apparent official websites. Đại An, 4U Home, Dê
Cúc Phương City, and Bản Tôi logos were supplied by the owner. Pacific uses a
name card. Zalo Official Account, Vantage, Dupoin, and DBG Markets were
confirmed as collaborations by Ali Nguyen; their logo backgrounds were removed
from supplied visual references. Review every client name and logo before release.
