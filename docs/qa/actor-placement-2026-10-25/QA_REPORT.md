# Actor placement release QA — 2026-10-25

## Change

Source baseline: 397601c16588c616c9c0506322d54d5b7efe1109. Anonymous public portfolio.

The previous actor followed a fixed reading line and could overlap the proof ribbon. The new geometry checks content and artwork, measures the full button including its label, preserves an empty pocket while it stays clear, and adds edge clearance. The statement has enough bottom whitespace to accommodate the actor. The highlights feature is explicitly marked as an obstacle. Dense viewports use the least occupied edge pocket; this does not guarantee zero overlap at every possible scroll position.

The target stays stationary during pointer hover and keyboard focus. Manual arrow-key walking/jumping was removed to prevent moving the control into content. Character artwork motion, role context, and real chat remain. No API/data/content changes.

## Commands — PASS

- `npm run typecheck`
- `npm run lint` — 46 source files
- `npm run test:guide` — 18 tests, including eight actor geometry checks
- `npm --prefix visitor-api test` — 17 tests
- `npm --prefix visitor-api run smoke:production` — grounded response, approved citation, motion schema and CORS
- `npm run build` — static export, 14 generated pages
- `git diff --check`

## Browser — PASS within stated scope

Local static export at http://127.0.0.1:3022/Alinguyen-portfolio/ in Chromium IAB.

- Screenshots and bounds at 1440x900, 1280x800, 1024x844, 768x844, 440x956, 390x844, 320x568 and 956x440: complete actor target inside viewport; no document horizontal overflow; actor clear of proof ribbon in reported statement transition.
- Initial tablet capture exposed overlap with the highlights feature's number. Added explicit obstacle boundary and repeated the final viewport captures.
- Mobile anchors visitor, highlights, work, AI expertise, customers, about, CVs and contact: no horizontal document overflow. Reduced-motion artwork animation computed as `none`.
- Enter opens real chat; Escape closes and returns focus to actor.
- Landscape 956x200 visible-area simulation: close, question input and send inside viewport, close 44px, send/input 48px high. This is a viewport simulation, not an iOS keyboard test.
- Screenshots and measurement JSON: `artifacts/actor-placement-2026-10-25/` (local evidence, ignored by git).

## NOT TESTED

Physical iPhone 17 Pro Max Safari, native iOS keyboard/safe-area behavior and native 200% browser zoom are unavailable in this environment. No claim of physical-device acceptance or exhaustive link/network coverage. Existing API smoke passed; local audit server intentionally blocks external API calls.

## Release

Push main through existing GitHub Pages workflow; verify candidate workflow and public actor after deployment. No workflow or backend configuration changes.
