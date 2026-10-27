import type { GuideBox } from "./guide-callout-placement";

// Prefer a stable empty edge pocket. In dense views choose the least occupied
// pocket, keeping the complete native button inside the safe viewport.
export function placeGuideActor(size: { width: number; height: number }, viewport: { width: number; height: number }, obstacles: GuideBox[], previous: { x: number; y: number } | null) {
  const left = viewport.width <= 1024 && viewport.width > viewport.height ? 64 : 16;
  const right = Math.max(left, viewport.width - size.width - left);
  const top = Math.min(112, Math.max(16, viewport.height - size.height - 24));
  const bottom = Math.max(top, viewport.height - size.height - 24);
  const preferred = Math.min(bottom, Math.max(top, viewport.height * .58));
  const area = (box: GuideBox) => obstacles.reduce((sum, obstacle) => sum + Math.max(0, Math.min(box.left + box.width + 10, obstacle.left + obstacle.width) - Math.max(box.left - 10, obstacle.left)) * Math.max(0, Math.min(box.top + box.height + 10, obstacle.top + obstacle.height) - Math.max(box.top - 10, obstacle.top)), 0);
  if (previous && previous.x === right && previous.y >= top && previous.y <= bottom && area({ ...size, left: right, top: previous.y }) === 0) return { left: right, top: previous.y };
  const ys = [preferred, top, bottom, ...obstacles.flatMap((box) => [box.top - size.height - 12, box.top + box.height + 12])];
  // Keep one side throughout the tour. Searching both edges made the actor
  // jump across the reading area whenever content scrolled underneath it.
  const candidates = ys.map((y) => ({ ...size, left: right, top: Math.min(bottom, Math.max(top, y)) }));
  const scored = candidates.map((candidate) => ({ ...candidate, overlap: area(candidate) }));
  scored.sort((a, b) => a.overlap - b.overlap || Math.abs(a.top - preferred) - Math.abs(b.top - preferred) || b.left - a.left);
  return { left: scored[0].left, top: scored[0].top };
}

