import { knowledge } from './guide-knowledge.js';

export const normalizeQuestion = text => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
const aliases = {
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
    answer: [vi ? 'Thông tin từ nguồn portfolio đã duyệt:' : 'Reviewed portfolio evidence:',
      ...sources.map((source, index) => `${source.title} [${index + 1}]\n${vi && source.textVi ? source.textVi : source.text}`)].join('\n\n'),
    citations: sources.map(({ id, title, url }) => ({ sourceId: id, label: title, url })),
    suggestions: [], motion: 'point', responseMode: 'reviewed-evidence',
  };
}

export function projectEvidenceRequest(question) {
  const named = namedProjectSources(question);
  if (named.length) {
    if (/\b(private|source code)\b/.test(normalizeQuestion(question))) named.push(knowledge.find(s => s.id === 'recruiter-brief'));
    return named;
  }
  const q = normalizeQuestion(question);
  if (/\b(planned|roadmap|future features|ke hoach|du kien)\b/.test(q)) return knowledge.filter(s => ['stos','cho-kenh','career-agent-kit'].includes(s.id));
  if (/\b(all projects|which.*projects|list.*projects|all.*builds|tat ca.*du an)\b/.test(q)) return knowledge.filter(s => s.projectRecord);
  return [];
}
