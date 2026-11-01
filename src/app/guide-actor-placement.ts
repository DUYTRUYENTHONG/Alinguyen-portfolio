// One fixed home for the floating guide; scrolling does not move its tap target.
export function placeGuideActor(size: { width: number; height: number }, viewport: { width: number; height: number }, safeArea: { right: number; bottom: number } = { right: 0, bottom: 0 }) {
  const landscapeMargin = viewport.width <= 1024 && viewport.width > viewport.height ? 64 : 16;
  const right = Math.max(landscapeMargin, safeArea.right + 12);
  const bottom = Math.max(24, safeArea.bottom + 12);
  return { left: Math.max(12, viewport.width - size.width - right), top: Math.max(12, viewport.height - size.height - bottom) };
}
