# Phone keyboard workflow checks — 2026-11-01

## Acceptance boundary

No physical iPhone 17 Pro Max, iOS simulator or Safari session is available on
this Windows workspace. This is Chromium viewport QA and source review, not
real-device Safari or native-keyboard acceptance. Representative CSS viewport
sizes do not reproduce Safari's keyboard, browser chrome or safe-area behavior.

## Finding fixed

The production browser returned HTTP 429 during the tour check. Network response
status was inspected without exposing request headers. The chat described this
as generic unavailability, which could be confused with the earlier timeout.
The request helper now preserves HTTP status and the chat explicitly explains
the daily request limit. HTTP 429 is still not retried. Quotas are unchanged.

## Completed workflow

Production browser admission was exhausted, so further interactive checks used
the actual API handler on an isolated localhost server with in-memory admission
and no external model. The deterministic tour/product routes were unchanged.
This does not reset, bypass or change production quotas.

- Focused input, Enter to send tour, then Growth Commerce OS follow-up at
  440x440 (portrait keyboard-height simulation): cited answers returned; input
  stayed focused; input/send/close inside viewport; no horizontal overflow.
- Rotate to 956x220 (landscape keyboard-height simulation), type and submit
  Chợ Kênh follow-up: cited answer returned; input stayed focused; all three
  controls inside viewport; transcript retained 81px of scrollable height.
- Portrait transcript height was 301px. Text and citations remain scrollable.
- A typed unsent draft survived rotation to 956x440. Closing returned focus to
  the actor and restored the document scroll lock.
- Source review: dialog tracks visualViewport height/width/offsetTop/offsetLeft
  and listens for viewport resize and scroll; input uses 16px text; existing
  safe-area spacing and compact/short modes remain intact.
- 45 guide tests and lint passed, including status retention and non-retry of
  rate-limited requests. No CSS, layout, actor placement or backend change.
- Evidence: ignored `artifacts/phone-keyboard-2026-11-01/` screenshots and bounds.

## Real iPhone Safari check still needed

Screen-record Safari with the page URL visible. Open the guide in portrait,
focus the input, type a tour request, and send using the keyboard. Keep the
keyboard open, rotate to landscape, ask about STOS, then return to portrait.
Scroll the reply and tap a citation; return and close the guide. Capture the
keyboard edge, bubble start, input, send and close throughout, especially any
jump, clipping, lost draft or keyboard dismissal. Record iOS/Safari version,
display zoom and whether the page is a normal Safari tab or Home Screen app.

Real-device QA remains pending; no claim of iPhone Safari certification is made.
