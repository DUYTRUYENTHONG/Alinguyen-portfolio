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

Four owner-supplied CV files are downloadable from the site: Applied AI Engineer
(PDF), Business & Product (PDF), Business Development (PDF), and AI / Prompt
Engineer (DOCX). The two business PDFs are byte-identical as supplied. The
documents retain the printed name Nguyen Quang Duy, phone number, and original
portfolio URL; review their contents before approving public release.

The customer carousel lists ten names supplied by Ali Nguyen. It contains no
testimonial quotes or client performance claims. The Bà Chi and Cô Ba logos
come from local owner files. Toàn Thắng, Hưng Phú Thịnh, Biên Lan, and Bách
Việt logos come from their apparent official websites. Đại An, 4U Home, Dê
Cúc Phương City, and Pacific use name cards until exact logo files or official
brand pages are confirmed. Review every client name and logo before release.
