# Portfolio link preview

Owner-approved scope: the shared-link card only, with Ali’s current cartoon
avatar and a concise introduction. Preserve the portfolio layout. No additional
introduction page or new homepage animation.

Copy: **Ali Nguyen · Applied AI and Product Engineer**

> I build practical AI, data and commerce workflows.

The 1200 × 630 PNG `public/ali-intro-social-v1.png` uses the existing owner avatar
(`public/guide-art/ali-owner.webp`). It was rendered from a temporary HTML
composition at full opacity after fonts and the avatar loaded. The temporary
page is not part of the shipped site.

`src/data/social-preview.ts` defines the absolute image URL, dimensions, MIME type
and alternative text. Root Open Graph and Twitter metadata reference this
versioned image. Home metadata supplies the canonical Open Graph URL.

The previous portrait image remains at `/opengraph-image.png` for existing
case-study references and cached consumers. It now lives in `public/` so that
Next.js file-based image metadata does not override the explicit share card.

Messaging apps decide whether to display an image and may cache old cards.
The card is a static image; HTML/CSS/JavaScript animation is not part of this
implementation. A fresh link with a query parameter can help distinguish a new
share, but does not guarantee a platform cache refresh.

Verify the exported home HTML contains one `og:image` and one `twitter:image`,
both referencing the new image, with the correct dimensions and alternative
text. Verify both the new image and legacy image return HTTP 200 after deploy.
Actual rendering in the owner’s messaging app remains a device/platform check.

Reference: [Open Graph structured image properties](https://ogp.me/#structured).
