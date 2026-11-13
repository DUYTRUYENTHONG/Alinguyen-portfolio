// IntersectionObserver delivers changed entries, not the complete visible set.
export function updateProjectVisibility(
  previous: Map<string, number>,
  updates: { id: string; visible: boolean; ratio: number }[],
  order: string[],
) {
  const visibility = new Map(previous);
  for (const update of updates) {
    if (update.visible && order.includes(update.id)) visibility.set(update.id, update.ratio);
    else visibility.delete(update.id);
  }
  const active = order.filter(id => visibility.has(id))
    .sort((a, b) => (visibility.get(b) ?? 0) - (visibility.get(a) ?? 0))[0];
  return { visibility, active };
}
