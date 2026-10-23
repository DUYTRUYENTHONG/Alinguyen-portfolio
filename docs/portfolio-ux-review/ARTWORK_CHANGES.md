# Separately authorized artwork patch

After requesting the audit, Ali supplied additional comments authorizing three logo-background removals and replacement illustrations in all three CV cards. Those comments expand the edit scope for this patch only. The audit baseline remains `6244bcd`; baseline screenshots/performance measurements do not describe this candidate. No general audit correction, commit, push or production deployment is included.

## Finished treatment

- Growth Commerce OS, STOS and Chợ Kênh highlight cards use transparent logo derivatives. STOS uses its ribbon S alone because the card already prints the name; the white-on-dark wordmark was not retained on a white surface. Original PNG assets remain untouched for comparison.
- Applied AI engineering: three cyan/violet cubes with separate front, top, side and base faces, plus conceptual node/link motifs.
- Business and product: the supplied hand/lightbulb/product concept re-created in layered SVG/CSS, with a separate hand backing, front hand, raised bulb and product tile.
- AI and prompt engineering: the cube composition with bracket and source motifs in a different arrangement.
- The supplied references guide the illustrations; the reference bitmaps are not embedded. No new capability claims, fake scores or miniature CV content were added.
- Cards, original headings/descriptions, file destinations, visible download wording and all four actions remain unchanged. The right-hand file remains DOCX.

## Interaction implementation

The repository does not have a connected interactive 3D plugin. The implementation uses native CSS perspective (1100px) and separate transformed HTML/SVG layers. A small client wrapper enhances only the illustration, clamps mouse tilt to ±3°, updates through a bounded animation frame, resets on pointer leave/visibility change and cancels pending work on cleanup. Touch does not depend on hover. Reduced motion disables tilt and transition. There are no loops, new dependencies, canvas renderers, external models or backend changes. Text and links stay outside every transformed scene.

## Files changed

- `src/app/cv-illustration.tsx` and `.module.css`: focused decorative 3D component and styles.
- `src/app/cv-download-section.tsx` and `.module.css`: replace paper diagrams; remove obsolete illustration styles.
- `src/app/highlights-section.tsx` and `.module.css`: transparent variants and unclipped mark edges.
- New assets: `public/duytruyenthong-logo-transparent.webp`, `public/stos-symbol-transparent.webp`, `public/cho-kenh-logo-transparent.webp`.
- `docs/portfolio-ux-review/`: audit, raw evidence, local-only scripts, candidate screenshots and this handoff.

## Asset provenance and prompts

Used the built-in image-generation tool in background-extraction mode, with true transparency requested. These are generative raster derivatives, not a claim of pixel-identical masking. Source marks were inspected before editing; output variants were visually checked at their UI size. The first STOS extraction damaged its white wordmark and was discarded; the final S-only derivative is the one used. Generated files remain in the Codex generated-images folder. The selected cutouts were encoded as small WebP assets with alpha retained (192px maximum dimension). Combined three-asset size: 42,866 bytes. No original image was overwritten.

Final prompt set:

**Growth input:** `public/duytruyenthong-logo.png`

> Use case: background-extraction. Edit target: the supplied DUYTRUYENTHONG logo. Remove only the dark navy square backdrop outside the purple/cyan interlocking D monogram. Retain the original monogram silhouette, colors, gradients and detail exactly; do not redraw, change the lettering, invent marks, add shadows, or add text. The faint rounded square frame surrounding the monogram is also background and should be removed. Isolate just the D monogram as a tightly centered transparent PNG logo cutout, with generous clean alpha outside its exact outer edge. This is a production brand asset, not a redesigned logo.

**STOS input:** `public/stos-logo-dark.png`

> Background-extraction for a small website logo. Isolate ONLY the existing purple folded-ribbon S monogram, retaining its exact silhouette and purple shading. Remove the dark rectangle completely. Do not include the white STOS wordmark because the website already prints the name beneath the logo. No letters, no added shapes, no border, no glow, no particles. Clean smooth edge. A single centered purple S ribbon on true alpha transparency, tight square composition suitable for a 64px UI logo. Do not redesign the S.

**Chợ Kênh input:** `public/cho-kenh-logo.png`

> Use case: background-extraction. Remove only the charcoal rectangular background surrounding the complete circular Chợ Kênh logo. Preserve the entire round emblem, its gold and purple rings, the inner dark purple fill, the stylized ck symbol and all small lettering exactly. Do not remove the internal purple circle; remove only the rectangle outside the outer gold circular rim. No redesigned details, no text changes, no extra border or shadow. Output a transparent PNG with clean alpha outside the intact circular emblem.

## Candidate QA actually completed

- `npm run typecheck`: passed.
- `npm run lint`: passed; 43 source files after extraction.
- Production `npm run build` with the Pages base path and public variables: passed; 14 generated outputs. Rebuilt after the final logo-style change.
- Browser candidate at 1440, 1280, 1024, 768, 390, 320 CSS pixels: document fits viewport, CV section settles at ~112px, four download actions remain, each at least 48px high, no decorative tab stops. Exact data in `artwork-preview/responsive-matrix.json`.
- Fine-pointer move produced ~2.54° X / ~2.71° Y tilt. Download-link rectangle remained identical before/after. Leaving the stage cleared both custom properties. Reduced motion cleared tilt and yielded a 0s scene transition.
- All three highlight logo variants load under `/Alinguyen-portfolio/`; computed backgrounds are transparent. Alpha metadata and file hashes are recorded in candidate evidence.
- With page scripts disabled, all three static sculptures, the section title and all four file links still render. Scripts were re-enabled and the candidate reloaded afterward.
- Baseline four browser downloads and identities remain applicable to the untouched CV files. Candidate link labels, paths, `download` attributes and target sizes were rechecked; CV bytes were not modified.
- Candidate desktop/tablet/mobile screenshots are in `artwork-preview/`. These are new captures, separate from baseline evidence.

## Remaining issues and publication

The five baseline findings remain open: enlarged-text reflow, callout obstruction, recurring text under reduced motion, unchosen-role attribution and direct-entry layout stability. This focused artwork patch does not fix them. Physical Safari, native mobile keyboard, real touch and WebKit remain unavailable. No new candidate performance benchmark is claimed.

Local review: `http://127.0.0.1:3022/Alinguyen-portfolio/?artwork=preview#cvs`. The audit server intentionally blocks optional external API connections. Do not interpret a local guide/counter-unavailable state as a production defect. The production website remains unchanged.
