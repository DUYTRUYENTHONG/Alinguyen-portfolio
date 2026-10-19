# Ali Nguyen portfolio

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

`PROFILE_README.md` is the draft for the username-matched GitHub repository.

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
