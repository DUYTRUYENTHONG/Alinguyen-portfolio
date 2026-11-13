import { createHash } from 'node:crypto';
export const hashBytes = value => createHash('sha256').update(value).digest('hex');
export function trainingGate(record, data, model) {
  const reasons = [];
  if (!record) return { eligible:false, reasons:['No recorded training run'] };
  for (const split of ['train','dev','test'])
    if (record.dataHashes?.[split] !== hashBytes(data[split])) reasons.push(`${split} data fingerprint mismatch`);
  if (record.base?.name !== model.name || record.base?.revision !== model.revision) reasons.push('Base model pin mismatch');
  if (record.meaningfulBudgetCompleted !== true || record.completedUpdates !== 32) reasons.push('Training budget incomplete');
  if (!/^[a-f0-9]{64}$/.test(record.adapterSha256 ?? '')) reasons.push('Missing adapter fingerprint');
  return { eligible:reasons.length===0, reasons };
}
