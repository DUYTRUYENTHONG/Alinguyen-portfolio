# Portfolio link preview

The shared-link card uses Ali’s real portrait and a concise introduction.
The owner subsequently approved a separate animated HTML preview at `/intro/`,
with motion restricted to that preview. Preserve the main portfolio layout and
the static shared-link image.

Copy: **Ali Nguyen · Applied AI and Product Engineer**

> I build practical AI, data and commerce workflows.

The 1733 × 907 PNG `public/opengraph-image.png` uses the existing real owner
portrait in a black suit, with his name, professional title and short intro.
The owner explicitly chose the real portrait instead of the cartoon.

`src/data/social-preview.ts` defines the absolute image URL, dimensions, MIME type
and alternative text. Root Open Graph and Twitter metadata reference this
image, with `?avatar=real-v2` to distinguish this card from the earlier one.
Home metadata supplies the canonical Open Graph URL.

The portrait image remains at `/opengraph-image.png` for existing
case-study references and cached consumers. It lives in `public/` so that
Next.js file-based image metadata does not override the explicit share card.

Messaging apps decide whether to display an image and may cache old cards.
The card is a static image. The `/intro/` HTML page has decorative AI, analytics,
data, workflow, growth and marketing icons moving behind the real portrait and
short introduction. Motion uses CSS transforms and opacity, can be paused, and
automatically stops for reduced-motion preferences. No external animation
library, AI service or new tracking is added. A fresh link with a query parameter can help distinguish a new
share, but does not guarantee a platform cache refresh.

Verify the exported home HTML contains one `og:image` and one `twitter:image`,
both referencing the real portrait image, with the correct dimensions and
alternative text. Verify the image returns HTTP 200 after deploy.
Actual rendering in the owner’s messaging app remains a device/platform check.

Reference: [Open Graph structured image properties](https://ogp.me/#structured).

## Animated HTML preview QA — 2026-11-01

- Tested the production static export in Chromium at 320 × 740, 390 × 844,
  768 × 1024, 1280 × 800 and 956 × 440. No horizontal overflow; the real portrait
  loaded at each size. Interactive targets were at least 44 px high.
- Pause changed every animated background element to `animation-play-state:
  paused`. Enter on Play resumed them with a visible keyboard focus outline.
- Emulated `prefers-reduced-motion: reduce`: all background animation names
  became `none`, and the control displayed the disabled “Motion reduced” state.
- The portfolio link opened the existing homepage at `#top`; the GitHub link
  uses the existing approved profile URL. No console errors in the static preview.
- Lint and production build passed. The homepage components, layout, metadata,
  and shared-link image were not modified in this change.
- Native Safari/iPhone testing was not performed. Screenshots and responsive
  bounds are in ignored `artifacts/animated-intro-2026-11-01/`.
