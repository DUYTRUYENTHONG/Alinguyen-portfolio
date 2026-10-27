export type GuideBox = { left: number; top: number; width: number; height: number };

const overlaps = (a: GuideBox, b: GuideBox) => a.left < b.left + b.width + 6 && a.left + a.width + 6 > b.left && a.top < b.top + b.height + 6 && a.top + a.height + 6 > b.top;

// A message is optional; never trade readable content for a visible bubble.
export function placeGuideCallout(actor: GuideBox, bubble: { width: number; height: number }, viewport: { width: number; height: number }, obstacles: GuideBox[]) {
  const margin = 12;
  const minTop = 104;
  if (bubble.width > viewport.width - margin * 2 || bubble.height > viewport.height - minTop - margin) return null;
  const candidates = [
    { left: actor.left + actor.width + margin, top: actor.top + actor.height * .3 - bubble.height / 2 },
    { left: actor.left - bubble.width - margin, top: actor.top + actor.height * .3 - bubble.height / 2 },
    { left: actor.left + (actor.width - bubble.width) / 2, top: actor.top - bubble.height - margin },
    { left: actor.left + (actor.width - bubble.width) / 2, top: actor.top + actor.height + margin },
  ];
  // Slide only along the actor's immediate sides to fit between nearby text
  // and dividers; never search elsewhere in the viewport.
  const sideTops = [actor.top, actor.top + actor.height - bubble.height,
    ...obstacles.map((box) => box.top + box.height + margin)
      .filter((top) => top >= actor.top - bubble.height + 24 && top <= actor.top + actor.height - 24)];
  for (const top of sideTops) {
    candidates.push({ left: actor.left - bubble.width - margin, top });
    candidates.push({ left: actor.left + actor.width + margin, top });
  }
  for (const candidate of candidates) {
    const box = { ...bubble, left: Math.max(margin, Math.min(candidate.left, viewport.width - bubble.width - margin)), top: Math.max(minTop, Math.min(candidate.top, viewport.height - bubble.height - margin)) };
    // Clamping must not turn an attached bubble into a distant floating panel.
    const gapX = Math.max(0, actor.left - box.left - box.width, box.left - actor.left - actor.width);
    const gapY = Math.max(0, actor.top - box.top - box.height, box.top - actor.top - actor.height);
    if (Math.hypot(gapX, gapY) <= margin * 2 && !overlaps(box, actor) && !obstacles.some((obstacle) => overlaps(box, obstacle))) return { left: box.left - actor.left, top: box.top - actor.top };
  }
  return null;
}
