<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Owner-directed layout freeze — 2026-10-28

The owner has frozen the restored portfolio layout. The approved visual baseline
is commit `005121b74ac6b1ddab59f0ca76b4ae289676acd0`, restored by rollback commit
`e38974c71232cc53bbe189f67cc0b83609034a39`.

- Preserve section order, hero composition, navigation, cards, spacing,
  typography, colors, responsive behavior, actor placement, and animations.
- Do not redesign, reorder, remove, or visually optimize these elements under a
  general request to improve, review, QA, optimize, or deploy the project.
- Report proposed visual changes first. Implement them only when the owner
  explicitly requests or approves that specific change; approval is limited to
  that scope and does not lift the rest of this freeze.
- Functional, accessibility, security, and content work may proceed within the
  requested scope while preserving the approved appearance. If a fix requires
  a visual change, explain it and obtain explicit approval before implementing.
- Do not reapply the reverted changes in `26e8603` or `176817d` without explicit
  owner authorization. This freeze does not undo code or content by itself.

Approved exception on 2026-10-28: the owner requested a first-visit entrance
from the left with a brief jump and concise bubble directing visitors to choose
a role. Only the owner welcome motion and bubble copy may change for this task;
the rest of the layout freeze remains in effect.

Approved exception on 2026-10-31: repair the role guide's abrupt movement and
unreliable interaction. Scope: smooth settled repositioning, a stable tap/focus
target, readable dismissible introductions and responsive bubble behavior.
The surrounding portfolio layout and the owner welcome remain frozen.
