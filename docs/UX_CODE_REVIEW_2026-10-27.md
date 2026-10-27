# UX/UI code review — 2026-10-27

## Scope and verdict

Reviewed portfolio navigation, the actor/chat interaction, responsive project discovery, keyboard access, and scrolling work. Applied the code-reviewer and code-review-and-quality skills, followed by a separate bounded static review. No blocking regressions were found in that review. This is a targeted UX release, not a full security audit or a physical-device certification.

## Findings addressed

| Priority | Finding | Change |
| --- | --- | --- |
| P1 | Long assistant replies exceeded the API's 500-character prior-turn limit, making subsequent questions fail. | Keep the full visible transcript; send at most four prior turns, each capped at 500 characters. |
| P2 | The mobile menu trapped keyboard focus among links while its close button sat outside the dialog. Resizing to desktop could leave the page scroll-locked. | Use a native modal dialog, place Close inside it, and dismiss at the 768px desktop breakpoint. |
| P2 | Closing chat always focused the moving actor, even when the inline Ask button opened it. | Restore the actual opening button without scrolling. |
| P2 | Malformed API suggestions/citation labels could reach React rendering; the timeout ended before reading the response body. | Validate the reply fields and retain the timeout through JSON decoding. |
| P2 | Community-section chat sent a section name unsupported by the deployed API. | Keep the visible community label but send the neutral supported portfolio context. This does not add career-kit knowledge to the RAG corpus. |
| P2 | Actor placement recalculated obstacle overlap repeatedly during sorting and measured hidden callouts. | Score each candidate once, skip inactive callout measurement, and skip placement while chat is open. |

## Verification

- Guide regression tests: 26 passed, including long replies, malformed response values, and community-context compatibility.
- Lint, TypeScript, and the production static build passed.
- Browser: 320px home and work directory had no horizontal overflow; all six projects and the AI/data filter (including the career kit) rendered correctly.
- Browser: mobile menu at 390×844 opened as a native modal; Close received focus; Escape closed it and returned focus to Open menu. Resizing to 956×440 closed the modal and restored page scrolling.
- Browser: mobile Download CVs closed the menu and reached the CV section at its expected header offset.
- Browser: closing chat returned focus to its inline Ask button. Two successive live API requests completed with assistant replies and no error.
- Actor helper microbenchmark: 80 obstacle rectangles, 500 placements, warmed Node process; 4987.17 ms before and 341.46 ms after. Same placement returned. This is a synthetic helper measurement, not a page-performance or real-device FPS claim.
- Mobile checks used viewport emulation. Physical iPhone Safari and the iOS keyboard were not available.

## Existing strengths

Native chat dialog and visual-viewport sizing, reduced-motion CSS, explicit source citations, optional interaction consent, and project filters already provide useful foundations. These remain in place.

## Fresh-visit actor correction

The owner reported that refreshing at the header still hid the actor. The visibility rule was waiting for the visitor-role section to enter the viewport. Removed that gate and added a hero context; the actor stays available from the header and still hides while chat is open. Its unpositioned pre-hydration state is hidden to prevent a corner flash.

Browser verification: fresh desktop entry and reload show `data-active=true` at scroll position zero; selecting the actor opens chat. At 440×956 the actor fits inside the viewport without intersecting the heading or primary actions. At 956×440 it fits inside the safe margins; text-line bounds and screenshot confirm it does not cover the heading or rotating text. The removed welcome overlay remains absent.
