/** A stale Work fragment from the retired tour must not reopen that tour's destination. */
export function startAtHeader(hash: string, navigationType: string, sameSiteReferrer: boolean, freshVisit = false) {
  if (navigationType === "back_forward") return false;
  if (freshVisit) return true;
  return !hash || hash === "#top" || (hash === "#work" && (navigationType === "reload" || !sameSiteReferrer));
}

// Runs while parsing the home document, before fragment targets exist. The
// effect still handles restored scroll positions and navigation after hydration.
export const freshHomeEntryScript = `(() => {
  try {
    if (performance.getEntriesByType('navigation')[0]?.type === 'back_forward') return;
    if (sessionStorage.getItem('portfolio-home-visited-v1') === 'seen') return;
    if (location.hash !== '#top') history.replaceState(history.state, '', location.pathname + location.search + '#top');
  } catch {}
})();`;
