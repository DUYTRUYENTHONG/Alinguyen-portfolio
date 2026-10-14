# Ali Nguyen portfolio preview

Static-first Next.js and TypeScript portfolio for Ali Nguyen, branded
DUYTRUYENTHONG. Content is maintained in `src/data/portfolio.ts`.

## Local preview

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. Run `npm run typecheck`, `npm run lint`, and
`npm run build` for a static export in `out/`.

The proposed GitHub Pages repository is `DUYTRUYENTHONG/alitech`, at
`https://duytruyenthong.github.io/alitech/`. The workflow builds with
`NEXT_PUBLIC_SITE_URL` set to that URL and `NEXT_PUBLIC_BASE_PATH=/alitech`.
Local builds use `localhost:3000` in metadata and disallow indexing.
The LinkedIn URL and public KKBox repository link await owner input or
publication.

Design reference: https://itsjiathao.com/. The revised site follows its
page rhythm: a name-first hero, work strip, visitor chooser, highlights,
sticky project index, case-study pages, and contact prompts. All copy,
illustrations, and code here are original to this portfolio. The hero uses
Ali Nguyen's supplied portrait with a transparent-background cutout. Project
illustrations should be replaced by owner-provided screenshots when available.
The STOS logo was supplied by the owner and is used with the founder and builder
attribution confirmed in chat. Public STOS pages support its feature summary;
no adoption or revenue metric is claimed.
The DUYTRUYENTHONG logo was also supplied by the owner and appears with Growth
Commerce OS. Both logos are preserved as supplied.

For an exact preview of the GitHub Pages path, build with
`NEXT_PUBLIC_BASE_PATH=/alitech` and serve the generated `out/` directory
under `/alitech/`. The project has no server-side runtime requirement.

`PROFILE_README.md` is the draft for the username-matched GitHub repository.

Four owner-supplied CV files are downloadable from the site: Applied AI Engineer
(PDF), Business & Product (PDF), Business Development (PDF), and AI / Prompt
Engineer (DOCX). The two business PDFs are byte-identical as supplied. The
documents retain the printed name Nguyen Quang Duy, phone number, and original
portfolio URL; review their contents before approving public release.
