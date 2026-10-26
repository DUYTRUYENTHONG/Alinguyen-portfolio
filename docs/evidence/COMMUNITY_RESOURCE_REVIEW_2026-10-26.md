# Community resource addition — 2026-10-26

## Source review
Repository: https://github.com/DUYTRUYENTHONG/vietnam-career-agent-kit
Reviewed main: 73a77b7002b2e59a24df0be5ae873b12f4690401.
Read README, MIT license and architecture; inspected module inventory and preparation/execution class entrypoints. This was a source/content review, not an execution or security certification of the kit.

Supported presentation: free MIT-licensed Python/SQLite tooling, private local workspaces, text CV/JD import, confirmed profile evidence, tailored drafts, progress records, and approved host-browser actions. Optional model/agent services may cost separately. Network job connectors and standalone unattended workers are not implemented. No hiring outcomes are claimed.

## Placement and design
Dedicated #community section immediately after Applied AI expertise, before the signal-to-decision illustration. Kept the five featured builds, their counts and existing project navigation unchanged. Personal CV downloads remain distinct. Reuses section-shell, ink/canvas/line/blue tokens and existing typography. Scoped CSS, server-rendered content, decorative CSS/SVG documents, three workflow stages, English setup/source and Vietnamese guide links. No dependencies or backend changes.

Content source: communityResource in src/data/portfolio.ts.

## QA
- Browser geometry at 320, 390, 768, 1024, 1280 and 1440px: no page or section horizontal overflow; links at least 44px high; one column on narrow mobile, two columns on tablet/desktop.
- Desktop screenshot visually reviewed; mobile screenshot capture has the existing embedded-browser scaling limitation, so mobile evidence uses DOM geometry rather than claiming real-device screenshots.
- Keyboard Tab reaches the source link with a visible solid focus outline.
- Reduced-motion emulation: illustration transition duration 0s.
- Local screenshot: artifacts/community-qa/desktop.png. Responsive measurements: artifacts/community-qa/responsive.json.
- Real iPhone/Safari not tested.
- Typecheck, lint and production build are required before commit; GitHub Pages workflow additionally runs existing API, analytics and guide checks before deployment.
- Final local results: npm run typecheck, npm run lint and npm run build all passed; 15 static pages generated. git diff --check passed.
