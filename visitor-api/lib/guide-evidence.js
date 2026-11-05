import { knowledge } from './guide-knowledge.js';
import { summaries } from './guide-summaries.js';

export const normalizeQuestion = text => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
const aliases = {
  'vn-ai-content-kit': /\b(vn ai content|vietnamese content kit|content kit)\b/,
  'growth-commerce-os': /\b(growth commerce|growth operations)\b/,
  stos: /\bstos\b/,
  'cho-kenh': /\bcho kenh\b/,
  'vibecode-kit': /\bvibecode\b/,
  'kkbox-results': /\bkkbox\b/,
  'career-agent-kit': /\b(vietnam career|career agent|career kit|job kit)\b/,
};

export function namedProjectSources(question) {
  const q = normalizeQuestion(question);
  return knowledge.filter(source => aliases[source.id]?.test(q));
}

// Text and citations are assembled together from approved records. Generated
// prose is never used as factual evidence, even when it cites a valid URL.
export function evidenceReply(sources, question = '') {
  const vi = /[ăâđêôơư]|\b(du an|san pham|tinh nang|ket qua|chua)\b/i.test(normalizeQuestion(question));
  return {
    answer: sources.map((source, index) => {
      const details = /\b(detail|details|vector|lexical|bm25|fts5|lcel|cutoff|snapshot|split|reproduc\w*|privacy|retention|expiry|technical|limitations|email|contact|date|labels|transactions|tokens|cost)\b/i.test(question);
      const summary = summaries[source.id]?.[vi ? 'vi' : 'en'];
      const text = !details && summary ? summary : vi && source.textVi ? source.textVi : source.text;
      return `${text} [${index + 1}]`;
    }).join('\n\n'),
    citations: sources.map(({ id, title, url }) => ({ sourceId: id, label: title, url })),
    suggestions: [], motion: 'point', responseMode: 'reviewed-evidence',
  };
}

export function projectEvidenceRequest(question) {
  const q = normalizeQuestion(question);
  if (/\b(kitemetric|mlops|gpu infrastructure)\b/.test(q)) return knowledge.filter(s => s.id === 'kitemetric-mlops');
  if (/\b(education|degree|university|daad|scholarship|ielts|hsk|frankfurt)\b/.test(q)) return knowledge.filter(s => s.id === 'academic-brief');
  if (/\b(lora|qwen3|fine.tuning experiment)\b/.test(q)) return knowledge.filter(s => s.id === 'cv-lora-experiment');
  if (/\b(work history|professional experience|employment|tenure|years.*ai|databricks|itechwx|nina|billion records)\b/.test(q)) return knowledge.filter(s => s.id === 'cv-professional-experience');
  const named = namedProjectSources(question);
  if (named.length) {
    if (/\b(private|source code)\b/.test(normalizeQuestion(question))) named.push(knowledge.find(s => s.id === 'recruiter-brief'));
    return named;
  }
  if (/\b(skills|capabilities|systems thinking|problem framing|martech|advertising budgets)\b/.test(q)) return knowledge.filter(s => s.id === 'cv-supported-skills');
  if (/\b(planned|roadmap|future features|ke hoach|du kien)\b/.test(q)) return knowledge.filter(s => ['stos','cho-kenh','career-agent-kit'].includes(s.id));
  if (/\b(all projects|which.*projects|list.*projects|all.*builds|tat ca.*du an)\b/.test(q)) return knowledge.filter(s => s.projectRecord);
  return [];
}
