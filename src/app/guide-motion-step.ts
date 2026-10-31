// Time-based damping gives the same travel speed on 60 Hz and 120 Hz screens.
// It only runs during a move, never as an idle render loop.
export function guideMotionStep(current: number, target: number, elapsed: number) {
  if (Math.abs(target - current) < .5) return target;
  return current + (target - current) * (1 - Math.exp(-Math.min(64, Math.max(0, elapsed)) / 85));
}
