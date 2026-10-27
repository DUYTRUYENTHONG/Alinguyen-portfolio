// Pure screen-space helpers shared by navigation and the regression tests.
export const requiredGuideClips = ["idle_loop", "walk_forward", "sprint_forward", "gesture_point_left", "gesture_point_right"];

export function validateGuideAsset(gltf) {
  const missing = requiredGuideClips.filter((name) => !gltf.animations.some((clip) => clip.name === name));
  const mouth = gltf.scene.getObjectByName("Head_Mouth_Node");
  if (!mouth || missing.length) throw new Error(`Invalid tour guide asset: ${!mouth ? "missing Head_Mouth_Node; " : ""}missing clips: ${missing.join(", ") || "none"}`);
  return mouth;
}

export function screenToNDC(x, y, width, height) {
  return { x: x / width * 2 - 1, y: 1 - y / height * 2 };
}

export function boxesOverlap(a, b) {
  return a.left < b.left + b.width && a.left + a.width > b.left && a.top < b.top + b.height && a.top + a.height > b.top;
}

export function actorBox(point, width, height) {
  return { left: point.x - width / 2, top: point.y - height, width, height };
}

// Sample at no more than 4 CSS px of travel; expand obstacles by the same
// amount so thin dividers cannot fall between samples. Test the whole body.
export function clearCurve(curve, size, viewport, obstacles) {
  const steps = Math.max(2, Math.ceil(curve.getLength() / 4));
  for (let step = 0; step <= steps; step++) {
    const box = actorBox(curve.getPointAt(step / steps), size.width, size.height);
    if (box.left < 12 || box.top < 96 || box.left + box.width > viewport.width - 12 || box.top + box.height > viewport.height - 12) return false;
    if (obstacles.some((obstacle) => boxesOverlap(box, { left: obstacle.left - 4, top: obstacle.top - 4, width: obstacle.width + 8, height: obstacle.height + 8 }))) return false;
  }
  return true;
}

// The bubble stays near the projected mouth, including at viewport edges.
export function bubblePosition(head, size, viewport) {
  const left = Math.max(12, Math.min(head.x - size.width / 2, viewport.width - size.width - 12));
  const above = head.y - size.height - 18;
  const below = above < 96;
  const top = below ? head.y + 22 : above;
  if (size.width > viewport.width - 24 || top < 96 || top + size.height > viewport.height - 12) return null;
  return { left, top, below, tail: Math.max(16, Math.min(head.x - left, size.width - 16)) };
}
