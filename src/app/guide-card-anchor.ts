import type { GuideBox } from "./guide-callout-placement";

// While the selected card's portrait is visible, it is the guide's visual
// anchor. Do not draw a second copy at the viewport edge.
export function guideCardAnchor(portrait: GuideBox | null, viewport: { width: number; height: number }): GuideBox | null {
  if (!portrait) return null;
  const left = Math.max(12, portrait.left);
  const top = Math.max(Math.min(112, viewport.height / 4), portrait.top);
  const right = Math.min(viewport.width - 12, portrait.left + portrait.width);
  const bottom = Math.min(viewport.height - 24, portrait.top + portrait.height);
  return right - left >= 24 && bottom - top >= 24 ? { left, top, width: right - left, height: bottom - top } : null;
}
