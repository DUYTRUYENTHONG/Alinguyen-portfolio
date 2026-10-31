import { knowledge } from "./guide-knowledge.js";
import { namedProjectSources } from './guide-evidence.js';

const normalize = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
const words = (text) => [...new Set(normalize(text).match(/[a-z0-9]+/g) ?? [])].filter((word) => word.length > 2 || word === "ai");
const stopWords = new Set(["the", "and", "for", "you", "your", "about", "can", "what", "how", "with", "this", "that", "are", "from", "have", "show", "tell", "please", "which"]);

export function retrieveGuideSources(question, { role = "", section = "" } = {}, signals = {}) {
  const query = words(question).filter((word) => !stopWords.has(word));
  const context = words(`${role} ${section}`).filter((word) => !stopWords.has(word));
  const explicitProject = /\b(kkbox|vibecode|stos|cho kenh|growth commerce)\b/.test(normalize(question));
  const ranked = knowledge.map((source) => {
    const title = words(source.title);
    const tags = words(source.tags.join(" "));
    const text = words(source.text);
    const score = query.reduce((sum, word) => sum + (title.includes(word) ? 4 : 0) + (tags.includes(word) ? 5 : 0) + (text.includes(word) ? 1 : 0), 0);
    const contextScore = context.reduce((sum, word) => sum + (tags.includes(word) ? 0.25 : 0), 0);
    const boost = !explicitProject && Number.isFinite(signals[source.id]) ? Math.max(0, Math.min(0.2, signals[source.id])) : 0;
    return { source, score: score + (score > 0 ? contextScore + boost : 0) };
  }).filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ source }) => source);
  return [...new Map([...namedProjectSources(question), ...ranked].map(source => [source.id,source])).values()].slice(0, 6);
}
