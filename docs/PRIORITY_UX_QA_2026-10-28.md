# Priority UX and answer-coverage release — 28 October 2026

## Changes

- Compact homepage introduction, followed immediately by three inspectable
  projects: KKBox, Vibecode, and Growth Commerce OS. Removed the oversized
  homepage portrait and repetitive rotating headline. Detailed work remains below.
- Persistent role-specific introduction inside the selected card, using the same
  persona copy as the floating actor. A 550 ms selection entrance settles once;
  reduced-motion users receive the stable state immediately.
- GitHub profile follows Get in touch in desktop and mobile navigation.
- Owner-approved experience correction: 3+ years in AI engineering and product
  building, shared by the portfolio and guide knowledge. Historical audit records
  remain unchanged.
- Reviewed live-product inventory includes all three public websites and separate
  numbered citations. Generated answers missing a named project's citation are
  rejected. Added the free community career kit to guide knowledge.

## Local verification

- At 390 × 844, first project evidence section starts around 708 px down, versus
  the previous work section around 6,549 px. This is layout measurement, not a
  conversion or performance claim.
- No horizontal overflow across 320, 390, 440, 493, 693, 768, 900, 956, 1024,
  1280 and 1440 px. All eleven role introductions fit their selected cards.
- Mobile menu includes GitHub after Get in touch; Escape restores trigger focus.
- Reduced-motion mode disables selection/intro animations.
- Chat input and close fit portrait 390 × 844 / 440 × 956 and landscape 956 × 440,
  plus simulated available-height states 390 × 350 / 956 × 260. Send remains
  inside the short landscape viewport. No browser console errors observed.
- 35 frontend guide tests, 33 API tests, and 14 analytics tests passed. API tests
  include complete English/Vietnamese inventory, feature-question routing,
  missing cross-project citations, correct cross-project citations, and retained
  rate limiting. TypeScript, lint, and the production static-export build passed.

The live inventory is a reviewed answer path, not an LLM benchmark. Citation
coverage recognizes named projects; it does not prove every sentence follows
from its source. The earlier 16-request baseline remains historical evidence.
A physical iPhone/Safari keyboard, real-user performance, and native 200% zoom
were not tested. Release completion also requires a production build, the Pages
workflow, the separate Vercel API deployment, and production smoke checks.

## Live-review follow-up

The first live comparison returned the two expected citations but added
unsupported commercial wording. Manual review caught the issue that the
citation-only smoke check missed. Direct project comparisons now return exact,
labelled approved-source summaries, with a separate source for each project.
Two further regression tests cover this route and the retained generation guard;
the API suite now contains 35 tests (84 across the three suites). This does not
establish semantic correctness for every generated answer.
