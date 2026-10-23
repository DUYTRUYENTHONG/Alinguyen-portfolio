# CV and link checks

All four destinations were checked by public GET and by actual native browser activation. Local and public browser downloads completed. All eight saved files match the corresponding public/repository SHA-256. The CV files were read, not rewritten. Initial locator/native activation timeouts were superseded after bringing controls fully into view; they are not broken-link findings.

| Category/action | Final public URL | HTTP / MIME / signature | Size | Identity / browser outcome |
|---|---|---|---|---|
| Applied AI engineering / Download PDF | [cv-applied-ai-engineer.pdf](https://duytruyenthong.github.io/Alinguyen-portfolio/cv-applied-ai-engineer.pdf) | 200 / `application/pdf` / `%PDF-1.4` | 5,853 bytes | Nguyen Quang Duy Applied AI Engineer CV; saved by browser |
| Business and product / Business & Product PDF | [cv-business-product.pdf](https://duytruyenthong.github.io/Alinguyen-portfolio/cv-business-product.pdf) | 200 / `application/pdf` / `%PDF-1.4` | 4,212 bytes | Nguyen Quang Duy Business and Product CV; saved by browser |
| Business and product / Business Development PDF | [cv-business-development.pdf](https://duytruyenthong.github.io/Alinguyen-portfolio/cv-business-development.pdf) | 200 / `application/pdf` / `%PDF-1.4` | 3,862 bytes | Nguyen Quang Duy Business Development CV; saved by browser |
| AI and prompt engineering / Download DOCX | [cv-prompt-engineer.docx](https://duytruyenthong.github.io/Alinguyen-portfolio/cv-prompt-engineer.docx) | 200 / `application/vnd.openxmlformats-officedocument.wordprocessingml.document` / `PK ZIP + word/document.xml` | 39,516 bytes | Word package with word/document.xml; readable text identifies the AI/prompt CV; saved by browser |

PDF responses have no Content-Disposition header; the same-origin `download` links saved files in this Chromium session. A direct PDF URL may intentionally open inline in a different browser; that is not a failed download. Safari file handling is not assessed. Downloads may acquire numeric suffixes to avoid overwriting existing files.

Raw results: `evidence/cv-files.json`, `evidence/public-browser-downloads.json`, `evidence/native-browser-downloads.json`, `evidence/saved-download-hashes.json`. File title/text identity was inspected with pypdf or Word XML; PDF typography/page-layout QA was outside this portfolio audit.

## Case studies and contact

Production build generated `/work/growth-commerce-os/`, `/work/stos/`, `/work/cho-kenh/`, `/work/vibecode-kit/`, and `/work/kkbox-baseline/`. KKBox directory → case → portfolio → Back/Forward was exercised. Other case paths are build/source verified, not all individually interaction tested in this audit.

KKBox evidence link points to `https://github.com/DUYTRUYENTHONG/kkbox-customer-churn-prediction/blob/main/docs/RESULTS.md`. Labels and internal routes agree. Every external service URL was not opened; external availability is Not assessed, not presumed healthy or broken.

Contact anchors use `mailto:nquangd1510@gmail.com`, plus `Engineering opportunity` and `AI and commerce workflow` subject variants. Copy-email succeeded; no mail client or send flow was activated.

Follow-up public route checks: all five returned HTTP 200 and their expected h1 identities; see `evidence/case-link-checks.json`. These HTTP identity checks do not replace the KKBox UI journey or constitute full interaction coverage of every case.