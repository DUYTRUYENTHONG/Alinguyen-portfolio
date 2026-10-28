/** A stale Work fragment from the retired tour must not reopen that tour's destination. */
export function startAtHeader(hash: string, navigationType: string, sameSiteReferrer: boolean, freshVisit = false) {
  if (navigationType === "back_forward") return false;
  if (freshVisit) return true;
  return !hash || hash === "#top" || (hash === "#work" && (navigationType === "reload" || !sameSiteReferrer));
}
