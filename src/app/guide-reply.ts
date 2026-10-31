export type GuideCitation = { sourceId: string; label: string; url: string };
export type GuideTurn = { role: "user" | "assistant"; text: string; citations?: GuideCitation[] };
export type AnswerMotion = "nod" | "curious" | "point" | "none";
const allowedHosts = new Set(["duytruyenthong.github.io", "github.com", "growth-commerce-os.vercel.app", "stosvn.vercel.app"]);

function safeLink(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && allowedHosts.has(url.hostname) && !url.username && !url.password;
  } catch { return false; }
}

// The API accepts four turns of at most 500 characters each. Keep the full
// transcript on screen while sending only the bounded conversational context.
export function recentGuideTurns(turns: GuideTurn[]) {
  return turns.slice(-4).map(({ role, text }) => ({ role, text: text.slice(0, 500) }));
}

// The new community section has no dedicated context in the deployed API yet.
// Keep its visible label while using the API's neutral portfolio context.
export function guideRequestSection(section: string) {
  return section === "Shared with the community" ? "Explore the portfolio" : section;
}

export function parseGuideReply(value: unknown) {
  if (!value || typeof value !== "object" || !("answer" in value) || typeof value.answer !== "string" || !value.answer.trim()) throw new Error("Invalid guide reply");
  const citations = "citations" in value && Array.isArray(value.citations)
    ? value.citations.filter((item): item is GuideCitation => Boolean(item) && typeof item === "object" && typeof item.sourceId === "string" && typeof item.label === "string" && safeLink(item.url)).slice(0, 8) : [];
  const suggestions = "suggestions" in value && Array.isArray(value.suggestions)
    ? [...new Set(value.suggestions.filter((item): item is string => typeof item === "string" && Boolean(item.trim()) && item.length <= 80))].slice(0, 2) : [];
  const motion: AnswerMotion = "motion" in value && (value.motion === "nod" || value.motion === "curious" || value.motion === "point" || value.motion === "none") ? value.motion : "none";
  return { answer: value.answer, citations, suggestions, motion };
}
