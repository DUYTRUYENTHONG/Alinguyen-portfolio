# About: visual workbench — 2026-10-24

## Design and scope

Replaced the four small, similar illustrations with larger distinct scenes in a two-by-two grid: source/ownership boundary, separate technical and outcome evidence, redacted information with a protective cover, and modular building blocks with an inspection lens. A decorative Scope / Test / Explain line echoes verbs already in the introduction. The capability index uses simple icons and readable text rows.

Reuses the section-shell container, Archivo/Inter typography, neutral surfaces, existing ink/line/blue palette and useOnceVisible utility. Depth is lightweight HTML/CSS with inline SVG. Text remains flat; only decorative layers move on fine-pointer hover. No external assets, models, dependencies, fabricated scores, certification claims or new expertise were added.

Changed implementation: about-work-section.tsx and about-work-section.module.css. The section is used only on the homepage. Its id and heading association remain intact. Original introductory paragraph, four principle titles/descriptions, and all four capability groups/19 entries still come from the existing sources without wording changes.

## Actual verification

- `npm run typecheck`: passed.
- `npm run lint`: passed, 45 files.
- `npm run test:guide`: passed, 10 tests.
- `npm run build`: passed, all 14 static pages generated.
- `npm --prefix visitor-api test`: passed, 17 tests.
- `npm --prefix visitor-api run smoke:production`: passed.
- `git diff --check`: passed.
- IAB Chromium: 1440, 1280, 1024, 768, 390 and 320px. Four principle cards and 19 capability entries at every width; no page overflow. Two columns through tablet, one on narrow mobile.
- Fresh #about navigation at all six widths: heading y=196–215px, clear of the fixed navigation.
- Essential headings/descriptions: computed transform none. Decorative SVGs: aria-hidden=true, focusable=false.
- Fine-pointer hover changes only scene/layer transforms; card headings and copy stay stationary.
- Reduced-motion emulation: entrance animation none, scene transition 0s, resting 3D depth retained.
- Enlarged default text: 32px root size (200% of the normal 16px), no page overflow or overflowing card headings at 390px.
- Visual review included the introduction, principle scenes, capability index, and transition into the unchanged CV section.

Evidence: about-{width}.png, about-desktop.png, about-enlarged-text.png and responsive-checks.json in this directory. Some close-ups show the cards at a scrolled position. Later fresh-navigation captures include the heading.

## Limitations

Enlarged-text emulation is not a native 200% browser-zoom test. No physical iPhone/Safari session is connected. The decorative scenes are conceptual illustrations, not evidence of a completed workflow, measured outcome or security certification.
