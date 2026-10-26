# Actor bubbles and portfolio preview — 2026-10-26

## Changes
- Removed arrows from the floating and inline Ask buttons.
- Enabled measured speech bubbles on mobile; removed whole-card collision exclusions while retaining actual text/image/control obstacles.
- Search nearby clear pockets first. A bounded speech-card overlay is used when the page is too crowded; it clears after ten seconds, reappears on hover/focus, and opens chat on activation.
- Re-measure after React message updates and bubble resizing. Keep the one-tap chat action and reduced-motion support.
- Use the existing portrait for the avatar favicon / Apple touch icon.
- Replace the sharing image with an AI-assisted portrait composition and a short professional introduction. Social previews are static. The page portrait has restrained fine-pointer 3D hover motion, disabled for reduced motion.

## Verification
- npm run test:guide: 21 passed.
- npm run typecheck: passed.
- npm run lint: passed.
- npm run build: passed, 15 static pages.
- git diff --check: passed.
- Local browser: desktop bubble visible, label has no arrow, one-tap opens chat; a suggested question returned a source-linked response from the existing production guide endpoint.
- 390x844: no horizontal overflow; input, Send and Close within viewport; mobile bubble displayed.
- 956x300 reduced-height landscape: input, Send and Close within viewport. This is Chromium viewport emulation, not a real Safari keyboard test.
- Unit checks additionally cover 320px, portrait and landscape callout bounds.
- Exported HTML includes production-base-path favicon, Open Graph image and Twitter large-image metadata.
- Screenshot: artifacts/actor-preview-qa/actor-bubble-desktop.png (local, ignored).

## Limits
Real iPhone Safari and social-network preview cache refresh were not tested. Sharing services may retain the previous preview until they re-fetch the URL. Context cards use authored portfolio text; only the opened conversation sends questions to the AI endpoint.
