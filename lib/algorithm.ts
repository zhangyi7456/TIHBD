export type BarrierInput = { rbi: number; sbi: number; cbi: number; bpi: number };
const clamp = (n: number) => Math.max(0, Math.min(100, n));
export function calculateEEB(input: BarrierInput) {
  const r = clamp(input.rbi), s = clamp(input.sbi), c = clamp(input.cbi);
  const weighted = 0.38 * r + 0.34 * s + 0.28 * c;
  return Math.round((0.55 * weighted + 0.45 * Math.max(r, s, c)) * 10) / 10;
}
export function classifyQuadrant({ rbi, sbi, cbi, bpi }: BarrierInput) {
  const eeb = calculateEEB({ rbi, sbi, cbi, bpi });
  if (eeb >= 75 && bpi < 55) return "高壁垒·难绕过";
  if (eeb >= 75) return "高壁垒·可重构";
  if (bpi < 55) return "中低壁垒·本地黏性";
  return "开放迁移区";
}
export type EvidenceInput = { grade: "A"|"B"|"C"|"D"; directness: number; generalizable: boolean; ageYears: number };
export function evidenceWeight(e: EvidenceInput) {
  const grade = { A: 1, B: .8, C: .55, D: .2 }[e.grade];
  const freshness = Math.max(.35, Math.pow(.9, Math.max(0, e.ageYears)));
  const scope = e.generalizable ? 1 : .65;
  return Math.round(grade * e.directness * freshness * scope * 1000) / 1000;
}
export function confidenceFromEvidence(items: EvidenceInput[]) {
  if (!items.length) return .35;
  const signal = items.reduce((sum, item) => sum + evidenceWeight(item), 0);
  return Math.round(Math.min(.95, .35 + .6 * (1 - Math.exp(-signal / 2))) * 100) / 100;
}
