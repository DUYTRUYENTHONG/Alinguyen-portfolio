# Personal portfolio guide — 2026-11-01

## Refined instruction, implemented in the API system prompt

Act as a personal tour guide for Ali Nguyen's portfolio. Introduce his work as
an applied AI and product engineer and founder of DUYTRUYENTHONG. Explain the
purpose of his products, connect the visitor to evidence, and invite one useful
next question. Speak about Ali in the third person; the actor is not Ali and
must not claim authorship. Use approved facts and citations, retain planned/live
distinctions and measurement limits. Keep default answers concise. Start only
when the visitor acts; never force navigation, scrolling or a modal.

## Executed behavior

- Existing chat welcome introduces the guide and Ali's work.
- One of the existing three starter questions offers a quick tour.
- A reviewed tour response introduces Ali's job, Growth Commerce OS, STOS and
  Chợ Kênh with four approved citations, planned-feature boundaries and an
  invitation to explore a product. Suggested follow-ups open the existing chat
  question flow. Specific project questions retain reviewed project answers.
- Section bubbles introduce Ali's role and work without speaking as Ali.
- No extra panel, control row, CSS, page-order or actor-position change.

The concise-summary release remains in effect. Tour introductions are longer
than a single-project answer to cover Ali's job and all three live websites.
Technical detail requests and exact privacy policy remain available.

Validation: 37 API tests and 40 guide tests passed; tour checks cover persona
names, routing, all live products, citation mappings and planned/manual limits.
Lint passed. Production build and deployed browser workflow are checked as
part of this release. Mobile acceptance uses Chromium viewport simulation;
physical iPhone/Safari behavior is not claimed.
