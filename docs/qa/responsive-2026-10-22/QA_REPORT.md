# Responsive release QA — 22 October 2026

Decision: **PASS_WITH_RISK** for the existing GitHub Pages target. Baseline: `8fe1c56`. The candidate is the commit containing this report. No new dependencies or API/database changes are included.

## Repairs

- The previous chat input computed to 12.96px and was automatically focused on opening. It could trigger Safari input zoom. It now uses 16px text and opens with focus on the 44px close control.
- The old fixed panel used viewport-height CSS without visual viewport events or safe-area insets. A focused dialog hook now follows `visualViewport` resize/scroll events through a bounded animation frame, uses safe-area spacing, and removes its listeners on close. A short viewport gets a compact header.
- A native modal dialog, portaled to the body, places the panel above navigation and makes the background inert. Both scrolling roots are locked while preserving the layout of deferred sections. Header and composer remain stationary; conversation and expanded preferences scroll independently. Closing restores page position and character focus. Tab and Shift+Tab wrap within the visible controls.
- Preferences moved into the conversation so expanding them cannot displace the composer. The question input stays mounted while a reply is pending. Offline navigation links close the modal before navigating.
- Existing anchor alignment covered only Work and CVs. It now also settles the other listed homepage sections and project anchors after deferred layout changes.

## Checks completed

| Check | Observed result |
| --- | --- |
| `npm run typecheck` | Passed after the final source changes. |
| `npm run lint` | Passed; 41 files checked. |
| Pages-configured `npm run build` | Passed; 14 generated static outputs including routes and metadata. Base path and API URLs match the Pages workflow. |
| `npm --prefix visitor-api test` | 17/17 passed, including the existing guide, traffic and original visitor contract tests. |
| `npm --prefix visitor-api run smoke:production` | Passed grounded answer, approved citation, motion shape and CORS checks. |
| Chat matrix | Eleven viewport cases from 320px through 1440px, including 440×956, 440×360 and 956×440. With preferences expanded, the panel and composer stayed inside the viewport; input text remained 16px and transcript height remained positive. [Measurements](chat-matrix.json). |
| Whole-site layout | Nine public page routes at seven widths: 320, 390, 440, 768, 1024, 1280 and 1440px. All 63 checks found no document overflow, horizontally clipped heading/paragraph boxes, or broken loaded image elements. Lazy images not yet loaded are not proven by this check. [Measurements](routes-matrix.json). |
| Homepage | Additional measurements at ten widths, plus mobile visual inspection of About, Work directory, Highlights, expertise, funnel, collaborations, working principles, CVs and Contact. [Measurements](home-matrix.json). |
| Anchors | Nine section/project anchors checked at 390px and 1440px. All settled within 1px of their configured scroll margin. [Measurements](anchor-checks.json). |
| Keyboard and close | Fourteen consecutive Tab presses in the production export remained in the chat. Escape removed the dialog, restored character focus and restored the recorded page position. |
| Navigation | Mobile menu opened on About; Download CVs navigated home, closed the menu and placed CVs at its 112px offset. Offline chat → CVs closed the dialog and reached the same offset. |
| Scrolling, zoom and motion | Backdrop wheel scrolling left the underlying page at the same scroll position. 200% pinch zoom changed the visual viewport from 440×956 to 220×478 while keeping the dialog and composer visible. Coarse-pointer/touch media and reduced-motion mode were exercised in Chromium. |
| Guide workflow | A real submitted KKBox question returned a qualified local-holdout answer and a link to the public results document. Intentional request blocking exercised the unavailable state and working fallback links. |
| Downloads | All four exported CV destinations returned HTTP 200, the expected PDF/DOCX content type and matching file signatures. |
| Source review | Reviewed modal lifecycle, focus, viewport event cleanup, static rendering, safe links and scope. `git diff --check` passed. |

The static export was served at `http://localhost:3001/Alinguyen-portfolio/`. The visitor-count endpoint was blocked in the QA browser to avoid recording test visits. Only public guide questions were submitted. Browser layout measurements and screenshots were captured through the in-app Chromium browser; they are not physical-device results.

## Limits

- Physical iPhone 17 Pro Max Safari, its native keyboard, VoiceOver and hardware safe-area behavior were unavailable. The keyboard-related checks use a reduced viewport and visual-viewport zoom; they do not establish a real iOS keyboard pass. Next verification: open the live guide on that phone, type, rotate, expand preferences, send, scroll the answer and close.
- `npm audit --omit=dev --fetch-timeout=15000 --fetch-retries=0` could not complete because the npm advisory endpoint timed out. No dependencies changed. No fresh vulnerability-scan pass is claimed.
- Current field performance and full assistive-technology conformance were not measured.

## Evidence and recovery

The [capture manifest](capture-manifest.json) records screenshot sizes and hashes. Representative images: [phone chat](chat-440.jpg), [320px chat](chat-320.jpg), [short viewport](chat-short-viewport.jpg), [landscape](chat-landscape.jpg), [desktop](chat-desktop.jpg), [mobile expertise](expertise-mobile.jpg) and [mobile CVs](cvs-mobile.jpg).

Publication uses the existing `main` → GitHub Actions → GitHub Pages workflow. Verify the workflow result and live dialog after pushing. To recover, revert this release commit and let the same workflow publish the previous frontend. The separate Vercel API and its secrets remain outside this release.

### Registry outage during publication

The first publication run, [39713794172](https://github.com/DUYTRUYENTHONG/Alinguyen-portfolio/actions/runs/39713794172), stalled in `npm ci`. npm's [status page](https://status.npmjs.org/) reported degraded package installation beginning at 02:33 UTC on 22 October. The runner log confirmed an npm cache hit for the unchanged lockfile. The workflow now prefers cached packages and bounds registry requests to 20 seconds with one retry. Installation integrity, lifecycle scripts, automatic audit behavior, tests and every existing deployment gate remain enabled. This change can use available cache during an outage; it cannot supply a package absent from both cache and registry.
