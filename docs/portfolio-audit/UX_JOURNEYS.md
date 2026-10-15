# User journey revalidation

The latest detailed record is [USER_JOURNEYS.md](USER_JOURNEYS.md). This file is retained for continuity with the earlier audit brief.

Tested against the local static export at the real GitHub Pages subpath, using Google Chrome at 1440×900 and 390×844. The [machine-readable journey log](journey-checks.json) records 12 passing checks and no page errors. Browser QA blocked the visitor API request to avoid recording test traffic. These are observed paths, not claims about every visitor.

| Journey | Tested route and actions | Result and remaining friction |
| --- | --- | --- |
| Recruiter | Home first screen → engineering Work CTA → AI CV URL → contact `mailto:`. | Professional identity, primary CTA, and downloadable PDF were visible or reachable; PDF returned 200. Home is long, but direct links avoid requiring a full scroll. |
| Engineering manager | Work directory → AI & data filter → KKBox case → technology/facts → Deep dive → refresh → return to selected work. | Filter showed one project; case name, role, technology list, limits, and proof were present; tab and refresh worked. The local prototype still lacks real KKBox evaluation results and a public source link. |
| Business collaborator | Work directory → Commerce filter → STOS case facts and owner-supplied screenshot preview → original full-resolution image. | Three commerce projects were shown, STOS role was legible, preview decoded, and the original PNG link was retained. This portfolio audit did not open the separate STOS product site. |
| Mobile visitor | 390 px Home → menu open → Escape/focus return → engineering CTA → Work anchor; fresh-load project and Contact anchors; widths 360–1920 px checked for overflow. | Menu and anchors worked; focus returned to the trigger and horizontal overflow was zero. The guide kept the selected Engineer role when scrolling from the role section to Work. |

[Firefox 157 and WebKit 27.2](nonchromium-checks.json) also passed a narrower mobile smoke test: menu opened, Escape closed it, Work anchor updated, page errors were absent, and horizontal overflow was zero. A full assistive-technology session and slow-network user test remain outside this pass.

The candidate [Work screenshot](screenshots/candidate-work-directory.png) and [STOS case screenshot](screenshots/candidate-case-stos.png) show the increased prominence of engineering evidence and project facts. The [baseline captures](baseline-capture-manifest.json) and [candidate captures](candidate-capture-manifest.json) support visual comparison without treating intentional content changes as regressions.
