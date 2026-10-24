# Collaboration carousel — 2026-10-24

## Scope

Restored the customer collection to one horizontal carousel instead of the full static grid. Preserved the current 15 entries, original order, 14 original image assets, one text-only name, five external destinations, section anchor, heading, and relationship qualification. No changes to the About section or shared content data.

The earlier carousel was a duplicated continuously moving marquee. This version uses a single semantic list with native horizontal scrolling, snap alignment, Previous/Next controls, a visible range, and an exposed scrollbar. It does not autoplay. Touch users can swipe, keyboard users can activate the native buttons and tab to existing links. With JavaScript unavailable the native scrollable list remains usable.

## Verification

- `npm run typecheck`: passed.
- `npm run lint`: passed, 44 files.
- `npm run test:guide`: passed, 5 tests.
- `npm run build`: passed, all 14 static pages generated.
- `npm --prefix visitor-api test`: passed, 17 tests.
- `npm --prefix visitor-api run smoke:production`: passed grounded answer, approved citation, motion shape and CORS checks.
- `git diff --check`: passed.
- IAB Chromium responsive checks: 1440, 1280, 1024, 768, 390 and 320px; 15 entries present, no page overflow, no loaded broken logo images. Original images use contain sizing and retain aspect ratios.
- Enter on Next and Space on Previous: navigation works. Traversed through entry 15; Next disables at the end. Previous disables at the start.
- Reduced-motion emulation: carousel navigation uses instant movement. No automatic repeating motion.
- Coarse-pointer emulation: both controls remain 46 × 46px; no hover requirement.
- Enlarged default text: 32px root size (200% of 16px), no page overflow; controls remain usable. This is text-size emulation, not a physical Safari/browser-zoom test.
- Visual review: desktop and mobile screenshots include the heading, qualification, collection, and transition into About.

Evidence: `carousel-{width}.png`, `carousel-desktop.png`, `carousel-mobile.png`, `carousel-mobile-next.png`, `carousel-enlarged-text.png`, and `responsive-checks.json` in this directory.

## Limits

No physical iPhone/Safari was connected. Touch checks used coarse-pointer emulation; a physical swipe was not tested. Existing external brand destinations were preserved; this change does not certify their availability. Offscreen images remain lazy loaded.
