# Conversational portfolio companion — 2026-10-24

## Review and design

The existing actor had an unlabelled visual launcher, a brief contextual callout that disappears on crowded layouts, and no floating callout on mobile. Real AI conversation already existed in the dialog. This update makes that working service more discoverable and gives the conversation stronger visual hierarchy.

- Visible Ask-name label and a minimum 48px-wide mobile actor target.
- Shallow CSS perspective over the existing character artwork, a soft contact shadow, bounded pointer tilt, and existing semantic greeting/thinking/reply gestures. This is layered character artwork, not a rigged 3D model or WebGL scene.
- Larger readable callouts with a 6.5-second introduction window, still subject to content-obstacle checks. Mobile uses the labelled actor and existing in-flow invitation rather than an obstructive automatic bubble.
- Conversation header with character presence, a contextual greeting bubble, project-related suggested questions, distinct user/assistant bubbles, and a request-driven thinking state.
- Existing AI endpoint, approved citations, privacy preferences and visual-viewport dialog behavior retained. Requests still require a visitor action. No fabricated answers or automatic API calls were added.
- Pending-request ref guards against duplicate sends; failed requests restore the question for retry.

## Issue found during QA

Resizing the underlying page changed the guide's active section and therefore the context inside an open chat. The section is now captured when opening the dialog. Retesting all six widths preserved Growth Commerce OS as the context.

## Verification

- `npm run typecheck`: passed.
- `npm run lint`: passed, 44 files.
- `npm run test:guide`: passed, 5 obstacle-placement tests.
- `npm run build`: passed, 14 static pages generated.
- `npm --prefix visitor-api test`: passed, 17 tests.
- `npm --prefix visitor-api run smoke:production`: passed grounded answer, citation, motion contract and CORS checks.
- IAB Chromium at 1440, 1280, 768, 430, 390 and 320px: no page overflow; dialog contained within the viewport; close, input and send controls reachable. Layout and control measurements are in responsive-checks.json.
- 956 × 200px short landscape/keyboard-height approximation: close, input and send controls remained within the visible viewport. This is not an actual iOS keyboard test.
- Enter on the actor opened the native modal; Escape closed it and returned focus to the actor.
- Reduced-motion emulation: actor animation name none, model transform none.
- Pointer response produced bounded rotations (sample X 3.13°, Y −4.05°); pointer leave resets the variables.
- The intentionally restrictive local server blocked the AI request: the unavailable state appeared, the submitted question was restored, and fallback links remained present. This tests failure recovery, not successful AI delivery.

Screenshots: actor-desktop.png and conversation-{width}.png. They establish layout only. A real user-initiated answer will be checked separately on the deployed candidate, with live evidence stored in the ignored artifacts directory.

## Limits

No physical iPhone/Safari or native browser-zoom session is connected. Real iOS keyboard and 200% browser zoom are not claimed as tested. Existing assets remain raster artwork; depth is a CSS presentation treatment. No speech recording, microphone access or audio output was introduced.
