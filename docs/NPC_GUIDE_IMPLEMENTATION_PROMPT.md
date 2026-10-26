> Superseded: the owner requested removal of the welcome/tour card on 2026-10-26. The actor now opens chat directly. The earlier implementation and QA below are historical.

# NPC portfolio guide — implementation prompt and acceptance

## Executed implementation prompt
Act as a senior interaction designer and frontend engineer for Ali Nguyen's existing portfolio. Repair the missing introduction at its cause: the actor had the has-inline-message class, which both CSS and positioning logic used to suppress the bubble while the replacement lived above the role grid.

Create a lightweight NPC-style companion using existing persona assets, approved introductions, typography and colors. After a visitor chooses a role, show an anchored, dismissible conversation card that stays visible until a choice or dismissal. Keep it independent of scroll-based actor positioning and of the five-second decorative greeting. Do not steal focus on an automatic greeting. Manual opening should focus a control; Escape/minimize should return focus to the actor.

Offer an optional three-stop tour using existing page anchors. Growth/marketing/founder perspectives visit work, funnel and AI evidence; learning/building perspectives visit work, evidence and the community kit; other perspectives visit work, evidence and CVs. Advance only when the visitor chooses. Provide an explicit AI-chat action using the existing source-grounded backend. Do not make hidden model calls, invent results or imply authored tour lines are generated replies.

Use an arrival greeting, directional emphasis when the tour advances, perspective, contact shadows and restrained hover response. Preserve reduced-motion support and static readability. These are 2.5D effects on existing raster characters, not a rigged 3D character or real lip-sync. Keep text outside transformed artwork.

Separate the interactive card from the actor button so links/buttons are not nested. Use real anchor links, minimum 44px targets, clear focus, a visible sticky minimize control and bounded scrolling in short landscape viewports. Keep the chat's existing visual-viewport keyboard handling.

## QA contract
- Reproduce selection of Growth and verify Rio's introduction stays visible past the old timeout.
- Start and advance the finite tour; verify destination and progress, plus finish/minimize/reopen.
- Open AI chat, close it and verify actor recovery.
- Check 320/390/440px portrait, tablet/desktop and short landscape bounds, focus, reduced motion and no horizontal overflow.
- Run guide tests, typecheck, lint, build and existing release gates. Report emulation versus real-device limits honestly.

## QA results — 2026-10-26

- Growth/Rio introduction reproduced and verified persistent beyond the old five-second timeout.
- Three tour destinations verified in the browser; corrected a React/native-anchor timing issue that initially skipped the first destination.
- Checked bounds at 320×568, 390×844, 440×956, 956×440, 768×1024, and 1440×900. Corrected mobile viewport-width overflow and rechecked 320px: card begins at x=8 with no page overflow. All guide choice targets are at least 44px high.
- Chat handoff, text entry, close, and actor reopening verified. Input, send, and close fit at 320×568.
- Reduced-motion animation override corrected and verified as `animation-name: none`.
- `npm run test:guide`: 24 passed. `npm run lint`, `npm run typecheck`, and production `npm run build`: passed.
- Browser checks use Chromium emulation. Physical iPhone Safari, its software keyboard, and true rigged 3D animation are not claimed.

## Entry and chat update — 2026-10-26

- Removed the welcome/tour overlay and its automatic saved-role opening behavior.
- Actor and inline Ask buttons open the existing AI chat directly.
- Fresh homepage entries start at the header. Direct/reloaded stale `#work` URLs normalize to `#top`; explicit CV links, same-site Work return links, and Back/Forward remain available.
- QA: lint, TypeScript, 23 guide tests and the production static build passed. Browser checks covered saved roles, popup absence, direct chat opening, CV anchor/reload, stale Work reload, and 390×844 / 844×390 layouts. No horizontal overflow; chat close/send controls remained within the viewport.
- Mobile checks used browser viewport emulation, not physical iPhone Safari or the iOS keyboard.
