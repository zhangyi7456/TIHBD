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
export type OutsiderPenaltyInput = { price:number; credit:number; quality:number; information:number; liquidation:number };
export function calculateOutsiderPenalty(p:OutsiderPenaltyInput){
  const values = Object.values(p).map(clamp);
  const weighted = values[0]*.15 + values[1]*.25 + values[2]*.2 + values[3]*.2 + values[4]*.2;
  return Math.round(weighted*10)/10;
}
export type ClaimInput = EvidenceInput & { direction:"支持"|"反驳"|"背景"; independenceGroupId:string; methodQuality:number };
export function aggregateClaims(prior:number,claims:ClaimInput[]){
  const unique=[...new Map(claims.map(x=>[x.independenceGroupId,x])).values()];
  const weighted=unique.map(x=>({...x,w:evidenceWeight(x)*x.methodQuality}));
  const support=weighted.filter(x=>x.direction==="支持").reduce((s,x)=>s+x.w,0);
  const oppose=weighted.filter(x=>x.direction==="反驳").reduce((s,x)=>s+x.w,0);
  const directional=support+oppose;
  const conflict=directional?2*Math.min(support,oppose)/directional:0;
  const shift=directional?15*(support-oppose)/(1+directional):0;
  const estimate=clamp(prior+shift);
  const coverage=Math.min(1,directional/2);
  const halfWidth=Math.max(6,25*(1-coverage)+15*conflict);
  return {estimate:Math.round(estimate),lower:Math.round(clamp(estimate-halfWidth)),upper:Math.round(clamp(estimate+halfWidth)),coverage:Math.round(coverage*100)/100,conflict:Math.round(conflict*100)/100,priorContribution:Math.round((1-coverage)*100)/100,effectiveEvidenceCount:unique.length};
}
export function smoothEEB(input:BarrierInput,lambda=.45,tau=12){
  const values=[clamp(input.rbi),clamp(input.sbi),clamp(input.cbi)];
  const weighted=.38*values[0]+.34*values[1]+.28*values[2];
  const max=Math.max(...values); const smooth=max+tau*Math.log(values.reduce((s,v)=>s+Math.exp((v-max)/tau),0))-tau*Math.log(3);
  return Math.round(((1-lambda)*weighted+lambda*smooth)*10)/10;
}
