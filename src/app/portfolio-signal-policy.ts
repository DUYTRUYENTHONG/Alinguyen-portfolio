export const signalConsentKey = "ali-project-signals-v1";
export const signalConsentDays = 30;
export function validSignalConsent(value: unknown, now = Date.now()): value is { browserId: string; expiresAt: number } {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.browserId === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(item.browserId) &&
    typeof item.expiresAt === "number" && item.expiresAt > now && item.expiresAt <= now + signalConsentDays * 86400000;
}

export function signalProjectForLink(href: string, currentOrigin: string, basePath: string): string | null {
  let url: URL;
  try { url = new URL(href, currentOrigin); } catch { return null; }
  if (!["https:", "http:"].includes(url.protocol)) return null;
  const path = url.pathname.replace(/\/$/, "");
  const cases: Record<string, string> = { "kkbox-baseline": "kkbox-results", "vibecode-kit": "vibecode-kit", "growth-commerce-os": "growth-commerce-os", stos: "stos", "cho-kenh": "cho-kenh" };
  if (url.origin === currentOrigin) {
    const prefix = `${basePath}/work/`;
    if (path.startsWith(prefix)) return cases[path.slice(prefix.length)] ?? null;
  }
  if (url.protocol !== "https:") return null;
  const approved: Record<string, string> = {
    "https://growth-commerce-os.vercel.app/en": "growth-commerce-os",
    "https://growth-commerce-os.vercel.app/cho-kenh": "cho-kenh",
    "https://stosvn.vercel.app/stos": "stos",
    "https://github.com/DUYTRUYENTHONG/vibecode-product-kit": "vibecode-kit",
    "https://github.com/DUYTRUYENTHONG/kkbox-customer-churn-prediction": "kkbox-results",
    "https://github.com/DUYTRUYENTHONG/kkbox-customer-churn-prediction/blob/main/docs/RESULTS.md": "kkbox-results",
  };
  return approved[`${url.origin}${path}`] ?? null;
}
