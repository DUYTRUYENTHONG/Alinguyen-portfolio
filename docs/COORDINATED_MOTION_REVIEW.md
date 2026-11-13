# Coordinated journey motion review

Local review candidate; not promoted to production. Base: `3f6a48b9719363ec8a3addb147db8c02ce782d5c`. The separate prerequisite commit `7b05f27` preserves byte-pinned experiment JSON fixtures in Windows Git archives; neither fixture content nor expected hashes changed.

## Preview and reproduction

The live-connected exported preview is http://[::1]:3001/Alinguyen-portfolio/ . Its export is `artifacts/coordinated-motion-source/out-live-final`. It uses the Pages workflow's public API URLs, not the test responder. Legacy local ports 3034 and 3037 redirect to this preview.

Run `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test`, then `npm run build` with:

```powershell
$env:NEXT_PUBLIC_BASE_PATH='/Alinguyen-portfolio'
$env:NEXT_PUBLIC_SITE_URL='https://duytruyenthong.github.io/Alinguyen-portfolio'
$env:NEXT_PUBLIC_VISITOR_API_URL='https://ali-portfolio-visitor-api.vercel.app/api/visit'
$env:NEXT_PUBLIC_GUIDE_API_URL='https://ali-portfolio-visitor-api.vercel.app/api/guide'
npm run build
node scripts/preview-export.mjs out --redirect-legacy
```

QA fixtures are deliberately separate. Build with `NEXT_PUBLIC_VISITOR_API_URL=http://127.0.0.1:3040/api/visit` and `NEXT_PUBLIC_GUIDE_API_URL=http://127.0.0.1:3040/api/guide`, then run `node scripts/qa-motion-server.mjs out`. This serves http://[::1]:3041/Alinguyen-portfolio/ and never forwards to a provider. Questions containing `delayed`/`close` take 5000 ms; `failure` returns 503; others succeed immediately. Never deploy this fixture build.

## Twelve moments

| Moment | Trigger and actual implementation | Fallback | Verification |
|---|---|---|---|
| 1. Hero | Existing home visibility owner accents portrait caption once. Fine-pointer CTA arrow moves 2 px; press/focus retain stationary link targets. | Links and resting portrait are present without new JS; reduced motion removes movement. | Source checked; native role CTA used. Accent timing and fine-pointer hover still need visual sign-off. |
| 2. Menu | Native dialog `open`: 220 ms, 5 px entrance and backdrop fade. Existing controller owns Escape, focus and scroll lock. | Closed dialog is explicitly hidden; reduced motion shows open state immediately. | Open frame, Escape/reopen, native Work link, and desktop-breakpoint closure observed. No remaining open backdrop or body lock. |
| 3. Role | Actual checked radio immediately marks selection; only decorative icon settles for 160 ms. Existing owner updates recommendation and order. | Selected mark is CSS state, not animation completion. Existing hydrated role behavior unchanged. | Data selected, KKBox recommendation and Data order observed in trace. Rapid native keyboard switching Data → Investor → Student also settled on Student with the matching recommendation/order. |
| 4. Work entrance | Existing home observer owns divider and eligible schematic art: 320 ms, art delay 40 ms. Real heading/copy stays readable. Product images stay still. | Existing fast-scroll/focus/hash/history settling; resting content without JS. | Native project-index journey observed. Exact intermediate animation frames not captured. |
| 5. Work navigation | Native `:target` edge and actual `aria-current=location` marker; existing indexes and order preserved. | Native links, focus outline and target outline. | Native Enter to KKBox changed hash and current marker while retaining Data order. |
| 6. KKBox | Past event dots cue at 0/120/240 ms, finish by 440 ms; last past event stays blue. Snapshot never moves; future remains subdued. | Full static diagram and explanation; reduced motion removes cue. | Last-past color, future border and unmoved Snapshot computed states checked. Ordered intermediate timing is source-verified, not recorded. |
| 7. Vibecode | One existing prompt line gets a 320 ms accent; all terminal output remains visible. No fake execution or CI result added. | Fully visible terminal; reduced motion removes cue. | Source and CSS specificity checked; visual timing pending. |
| 8. Case reading | Mounted post-hydration observer settles conceptual art once. Selected tab gets accent. Newly inserted real sections receive brief inset cue. | Native/current React tab state; hash/history/reduced motion settle art. | Right and Home changed selection immediately; case content remained visible. Right/Left/Home/End selected the expected tabs; settled focus matched selected tab. |
| 9. Gallery | Still images, stationary native links, focus/hover frame and caption accent. | Full-size image and live-product links unchanged. | Work directory → STOS case → full-size mobile PNG opened a new tab. No 320 px overflow. |
| 10. Guide panel | Actual dialog `open` gives 220 ms entrance; launcher placement and tour owner unchanged. | Escape/close is immediate; reduced motion removes entrance. | Open, Escape while pending, and reopen after completion observed. |
| 11. Guide feedback | Actual busy markup drives secondary-avatar/dot cue. DOM observer accents actual new answer/error once, including fast batched completion. | Real status, error and fallback links remain visible without decorative JS. | Delayed success, fast success, bounded failure (two attempts), close midrequest, reopen and live reduced-motion preference change observed. One current answer, no stale busy. Fixtures only; zero provider calls. |
| 12. Contact | Real resolved clipboard status determines success/error accent; button remains 160×44 px. No new announcement or fake success. | Existing denial message and native mailto. Reduced motion cancels decorative accent. | Dimensions and classifier tests pass. Browser clipboard permission remained unresolved; native success/denial paths require manual confirmation. |

No new scroll listener, dependency, router, telemetry or provider is introduced. The existing home motion controller retains its existing scroll listener. No application state depends on animation completion. Case art's completion event only updates decorative metadata. Existing About/AI Expertise visibility markers and Highlights sequencing are retained, not replaced. No new CSS scroll-driven timeline was added; this pass does not promise reverse-scroll replay.

## Evidence and checks

Clean isolated source excludes unrelated in-progress project-finder changes in the working tree. Clean `npm ci` passed for frontend, visitor API and analytics. Typecheck and lint passed; frontend tests **54/54**, API tests **68/68**, analytics **14/14**. Both real-endpoint and visibly labelled fixture exports built with the Pages base path. The final build includes the reduced-motion specificity guards.

Evidence is in `artifacts/coordinated-motion/`: `baseline.json`, `interaction-trace.json`, before frames, and these matched sequences:

- A: `a-start-role.jpg`, `a-middle-data-selected.jpg`, `a-middle-project-index.jpg`, `a-end-kkbox.jpg`.
- B: `b-start-menu.jpg`, `b-middle-product-case.jpg`, `b-end-image.jpg` (native image opened in a new tab).
- C: `c-start-guide.jpg`, `c-middle-loading.jpg`, `c-end-answer.jpg`; also `c-failure.jpg`, `c-closed-pending.jpg`, `c-reopen-completed.jpg`.
- Reduced-motion run: preference switched during the session, `reduced-middle-loading.jpg`, `reduced-end-answer.jpg`; computed panel/dot animation names were `none` while actual busy/answer states remained visible.

The browser interface used here provides screenshots, not a supported normal-speed video recorder. These are interaction-linked start/middle/end frames with timestamps/state receipts, **not clips or proof of 60 fps smoothness**. Screenshot transport sizes may differ from CSS viewport sizes; trace records actual `innerWidth/innerHeight`. Do not use frames named `after-320-*` as narrow-width proof; their trace shows 390 px. Correct captures are `verified-320-*`.

Actual 390×844, 1440×900 and 320 px home/case checks showed no horizontal document overflow. A 720×450 reflow equivalent to a 1440×900 viewport at 200% also showed no overflow; **native browser 200% zoom was not verified**. This is desktop browser QA, not a claim of physical iPhone Safari testing.

Fresh-entry policy was observed separately: a fresh QA entry normalized to `#top`; later native role/work/index jumps retained their hashes. Native Back/Forward preserved the role-section and case URLs separately from fresh-entry normalization. Script-disabled STOS retained its heading and all five full-size image links, with no overflow; JavaScript-only features are not claimed before hydration. Native clipboard permissions, full restored-scroll precision, and video-quality visual timing remain review gaps. No conversion improvement or measured engagement uplift is claimed. This is an inspectable candidate, not a completed production release gate.

## Changed ownership

- `src/app/styles.css`: coordinated tokens, hero/menu/role/work/case/gallery/contact state styling.
- `src/app/guide-motion.css`, `src/app/guide-assistant.css`: scoped guide dialog/busy feedback and reduced-motion overrides.
- `src/lib/home-motion.js`: reuses existing visibility lifecycle for caption/art sequencing.
- `src/lib/journey-feedback.js`, `src/instrumentation-client.js`: actually mounted, post-hydration decorative case/result/clipboard controller.
- `test/guide-journey-feedback.test.mjs`: clipboard truth and guide pending/result transitions.
- `scripts/qa-motion-server.mjs`: local-only deterministic failure/delay responder.

Project facts, master CV, native destination URLs, production Groq API contract and actor placement rules are unchanged.

Final re-capture on the final fixture export: A uses final-a-start/selected/index/end.jpg (10,485 ms from start to end); B uses final-b-start/middle/end.jpg; C uses final-c-start/middle/end.jpg; reduced-motion uses final-reduced-start/middle/end.jpg. These supersede the earlier C screenshot that preceded the browser paint. Final reduced loading dots computed animation-name: none. The final B destination is the native 390×7507 PNG in a new tab.
